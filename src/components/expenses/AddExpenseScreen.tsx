import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronDown,
  DollarSign,
  Calendar as CalendarIcon,
  FileText,
  ArrowRight,
  Wallet,
  Utensils,
  BookOpen,
  Bus,
  Wifi,
  Film,
  HeartPulse,
  User,
  ShoppingBag,
  MoreHorizontal,
} from 'lucide-react-native';
import ExpenseReceiptIllustration from './ExpenseReceiptIllustration';
import CategoryPickerModal from './CategoryPickerModal';
import DatePickerModal, { formatExpenseDisplayDate } from './DatePickerModal';
import { EXPENSE_CATEGORIES } from '@/data/categories';
import { Category, Transaction } from '@/types/budget';
import { useExpenseStore, useBudgetStore } from '@/store';
import { colors } from '@/theme/colors';

interface AddExpenseScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
  currencyPrefix?: string;
  isFirstExpenseFlow?: boolean;
}

function getCategoryIcon(iconName: string, color: string = '#168CFF') {
  const size = 22;
  switch (iconName) {
    case 'utensils':
      return <Utensils size={size} color={color} />;
    case 'book-open':
      return <BookOpen size={size} color={color} />;
    case 'bus':
      return <Bus size={size} color={color} />;
    case 'wifi':
      return <Wifi size={size} color={color} />;
    case 'film':
      return <Film size={size} color={color} />;
    case 'heart-pulse':
      return <HeartPulse size={size} color={color} />;
    case 'user':
      return <User size={size} color={color} />;
    case 'shopping-bag':
      return <ShoppingBag size={size} color={color} />;
    default:
      return <MoreHorizontal size={size} color={color} />;
  }
}

export default function AddExpenseScreen({
  onBack,
  onSuccess,
  currencyPrefix = '$',
  isFirstExpenseFlow = false,
}: AddExpenseScreenProps) {
  const insets = useSafeAreaInsets();
  const { addExpense, expenses } = useExpenseStore();
  const { monthlyBudget, setTotalBudget, updateCategoryBudget } = useBudgetStore();

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<Category>(EXPENSE_CATEGORIES[0]); // Default: Food & Dining
  const [amount, setAmount] = useState('');
  const [displayDate, setDisplayDate] = useState(`Today, ${formatExpenseDisplayDate(new Date())}`);
  const [isoDate, setIsoDate] = useState(new Date().toISOString());
  const [note, setNote] = useState('');

  // Budget Input State
  const [monthlyBudgetString, setMonthlyBudgetString] = useState(
    monthlyBudget?.totalBudget && monthlyBudget.totalBudget > 0
      ? String(monthlyBudget.totalBudget)
      : ''
  );

  const getCategoryAllocatedAmount = (catId: string) => {
    return (
      monthlyBudget?.categoryBudgets?.find((cb) => cb.categoryId === catId)?.allocatedAmount || 0
    );
  };

  const [categoryBudgetString, setCategoryBudgetString] = useState(
    getCategoryAllocatedAmount(EXPENSE_CATEGORIES[0].id) > 0
      ? String(getCategoryAllocatedAmount(EXPENSE_CATEGORIES[0].id))
      : ''
  );

  // Sync category budget input when selectedCategory changes or categoryBudgets change
  useEffect(() => {
    const alloc = getCategoryAllocatedAmount(selectedCategory.id);
    setCategoryBudgetString(alloc > 0 ? String(alloc) : '');
  }, [selectedCategory.id, monthlyBudget?.categoryBudgets]);

  // Sync total monthly budget string if store updates externally
  useEffect(() => {
    if (monthlyBudget?.totalBudget !== undefined) {
      const current = parseFloat(monthlyBudgetString) || 0;
      if (current !== monthlyBudget.totalBudget) {
        setMonthlyBudgetString(
          monthlyBudget.totalBudget > 0 ? String(monthlyBudget.totalBudget) : ''
        );
      }
    }
  }, [monthlyBudget?.totalBudget]);

  // Modals State
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Real-Time Financial Calculations from Actual Transactions
  const totalMonthlySpent = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const categorySpent = expenses
    .filter((e) => e.type === 'expense' && e.categoryId === selectedCategory.id)
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const currentTotalBudgetNum = parseFloat(monthlyBudgetString) || 0;
  const currentCategoryBudgetNum = parseFloat(categoryBudgetString) || 0;

  const totalRemaining = currentTotalBudgetNum - totalMonthlySpent;
  const categoryRemaining = currentCategoryBudgetNum - categorySpent;

  const totalUtilizationPct =
    currentTotalBudgetNum > 0
      ? Math.min(100, Math.round((totalMonthlySpent / currentTotalBudgetNum) * 100))
      : 0;

  const categoryUtilizationPct =
    currentCategoryBudgetNum > 0
      ? Math.min(100, Math.round((categorySpent / currentCategoryBudgetNum) * 100))
      : 0;

  const handleMonthlyBudgetChange = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, '');
    setMonthlyBudgetString(clean);
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      setTotalBudget(num);
    } else if (clean === '') {
      setTotalBudget(0);
    }
  };

  const handleCategoryBudgetChange = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, '');
    setCategoryBudgetString(clean);
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      updateCategoryBudget(selectedCategory.id, num);
    } else if (clean === '') {
      updateCategoryBudget(selectedCategory.id, 0);
    }
  };

  const handleSubmit = () => {
    const cleanAmountStr = amount.replace(/[^0-9.]/g, '');
    const numAmount = parseFloat(cleanAmountStr);

    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid expense amount greater than 0.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure budget inputs are persisted to store
      const finalMonthlyBudget = parseFloat(monthlyBudgetString);
      if (!isNaN(finalMonthlyBudget)) {
        setTotalBudget(finalMonthlyBudget);
      }
      const finalCategoryBudget = parseFloat(categoryBudgetString);
      if (!isNaN(finalCategoryBudget)) {
        updateCategoryBudget(selectedCategory.id, finalCategoryBudget);
      }

      // Determine appropriate title (e.g. note if provided, or category name)
      const expenseTitle = note.trim() ? note.trim() : selectedCategory.name;

      addExpense({
        title: expenseTitle,
        amount: numAmount,
        categoryId: selectedCategory.id,
        date: isoDate,
        note: note.trim() || undefined,
      });

      // Clear expense amount and note, while keeping budgets intact
      setAmount('');
      setNote('');

      if (onSuccess) {
        onSuccess();
      } else if (onBack) {
        onBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.darkNavy }}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 1. Header Bar: Back Arrow & Centered Title */}
        <View className="px-5 pt-2 pb-3 flex-row items-center justify-between border-b border-[#111D35]">
          <Pressable
            onPress={onBack}
            className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-[#111D35]"
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </Pressable>

          <Text className="text-white text-lg font-bold font-inter-bold">
            Add Expense
          </Text>

          {/* Balanced spacer */}
          <View className="w-10 h-10" />
        </View>

        {/* 2. Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom + 24, 32),
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {/* Expense Illustration & Headlines */}
            <View className="items-center justify-center mb-6">
              <ExpenseReceiptIllustration size={110} />

              <Text className="text-white text-xl font-bold font-inter-bold mt-3 text-center">
                Add Your Expense
              </Text>

              <Text className="text-text-secondary text-sm font-inter-regular mt-1.5 text-center leading-5 px-4">
                Keep track of your spending by{'\n'}adding a new expense.
              </Text>
            </View>

            {/* 3. Form Input Cards */}
            <View className="space-y-3">
              {/* Card 1: Category Selector */}
              <Pressable
                onPress={() => setIsCategoryModalVisible(true)}
                className="card-surface p-4 rounded-2xl flex-row items-center justify-between border border-[#263754] active:bg-[#192743] mb-3"
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-10 h-10 items-center justify-center mr-3">
                    {getCategoryIcon(selectedCategory.icon, selectedCategory.color || '#168CFF')}
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-secondary text-xs font-medium font-inter-medium">
                      Category
                    </Text>
                    <Text className="text-white text-sm font-semibold font-inter-semibold mt-0.5">
                      {selectedCategory.name}
                    </Text>
                  </View>
                </View>
                <ChevronDown size={18} color="#8FA0C0" />
              </Pressable>

              {/* Card 2: Selected Category Budget Input + Spent & Remaining Display */}
              <View className="card-surface p-4 rounded-2xl border border-[#263754] mb-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 items-center justify-center mr-3">
                    {getCategoryIcon(selectedCategory.icon, selectedCategory.color || '#168CFF')}
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-secondary text-xs font-medium font-inter-medium">
                      {selectedCategory.name} Budget
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Text className="text-white text-sm font-semibold mr-1">{currencyPrefix}</Text>
                      <TextInput
                        value={categoryBudgetString}
                        onChangeText={handleCategoryBudgetChange}
                        placeholder="Set category budget (e.g. 100)"
                        placeholderTextColor="#5C7194"
                        keyboardType="decimal-pad"
                        className="text-white text-sm font-semibold font-inter-semibold p-0 flex-1"
                      />
                    </View>
                  </View>
                </View>

                {/* Category Spent & Remaining Row */}
                <View className="mt-3 pt-3 border-t border-[#192743] flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="text-text-secondary text-xs font-inter-medium">Spent: </Text>
                    <Text className="text-white text-xs font-semibold font-inter-semibold">
                      {currencyPrefix}{categorySpent.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-text-secondary text-xs font-inter-medium">Remaining: </Text>
                    <Text
                      className={`text-xs font-semibold font-inter-semibold ${
                        categoryRemaining < 0
                          ? 'text-[#FF4D4D]'
                          : currentCategoryBudgetNum > 0
                          ? 'text-[#20D997]'
                          : 'text-text-secondary'
                      }`}
                    >
                      {currentCategoryBudgetNum > 0
                        ? categoryRemaining < 0
                          ? `${currencyPrefix}0 (${currencyPrefix}${Math.abs(categoryRemaining).toLocaleString()} over)`
                          : `${currencyPrefix}${categoryRemaining.toLocaleString()}`
                        : `${currencyPrefix}0`}
                    </Text>
                  </View>
                </View>

                {/* Visual Category Budget Progress Bar */}
                {currentCategoryBudgetNum > 0 && (
                  <View className="mt-2.5">
                    <View className="h-1.5 w-full bg-[#111D35] rounded-full overflow-hidden">
                      <View
                        style={{
                          width: `${categoryUtilizationPct}%`,
                          backgroundColor:
                            categorySpent > currentCategoryBudgetNum
                              ? '#FF4D4D'
                              : categorySpent >= currentCategoryBudgetNum * 0.8
                              ? '#FF9F43'
                              : selectedCategory.color || '#168CFF',
                          height: '100%',
                          borderRadius: 9999,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Card 3: Expense Amount Input */}
              <View className="card-surface p-4 rounded-2xl flex-row items-center border border-[#263754] mb-3">
                <View className="w-10 h-10 items-center justify-center mr-3">
                  <DollarSign size={22} color="#168CFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-secondary text-xs font-medium font-inter-medium">
                    Expense Amount
                  </Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="Enter amount (e.g. 25)"
                    placeholderTextColor="#5C7194"
                    keyboardType="decimal-pad"
                    className="text-white text-sm font-semibold font-inter-semibold p-0 mt-0.5"
                  />
                </View>
              </View>

              {/* Card 4: Total Monthly Budget Input + Spent & Remaining Display */}
              <View className="card-surface p-4 rounded-2xl border border-[#263754] mb-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 items-center justify-center mr-3">
                    <Wallet size={22} color="#168CFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-secondary text-xs font-medium font-inter-medium">
                      Total Monthly Budget
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Text className="text-white text-sm font-semibold mr-1">{currencyPrefix}</Text>
                      <TextInput
                        value={monthlyBudgetString}
                        onChangeText={handleMonthlyBudgetChange}
                        placeholder="Set monthly budget (e.g. 500)"
                        placeholderTextColor="#5C7194"
                        keyboardType="decimal-pad"
                        className="text-white text-sm font-semibold font-inter-semibold p-0 flex-1"
                      />
                    </View>
                  </View>
                </View>

                {/* Total Spent & Remaining Row */}
                <View className="mt-3 pt-3 border-t border-[#192743] flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="text-text-secondary text-xs font-inter-medium">Spent: </Text>
                    <Text className="text-white text-xs font-semibold font-inter-semibold">
                      {currencyPrefix}{totalMonthlySpent.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-text-secondary text-xs font-inter-medium">Remaining: </Text>
                    <Text
                      className={`text-xs font-semibold font-inter-semibold ${
                        totalRemaining < 0
                          ? 'text-[#FF4D4D]'
                          : currentTotalBudgetNum > 0
                          ? 'text-[#20D997]'
                          : 'text-text-secondary'
                      }`}
                    >
                      {currentTotalBudgetNum > 0
                        ? totalRemaining < 0
                          ? `${currencyPrefix}0 (${currencyPrefix}${Math.abs(totalRemaining).toLocaleString()} over)`
                          : `${currencyPrefix}${totalRemaining.toLocaleString()}`
                        : `${currencyPrefix}0`}
                    </Text>
                  </View>
                </View>

                {/* Visual Total Budget Progress Bar */}
                {currentTotalBudgetNum > 0 && (
                  <View className="mt-2.5">
                    <View className="h-1.5 w-full bg-[#111D35] rounded-full overflow-hidden">
                      <View
                        style={{
                          width: `${totalUtilizationPct}%`,
                          backgroundColor:
                            totalMonthlySpent > currentTotalBudgetNum
                              ? '#FF4D4D'
                              : totalMonthlySpent >= currentTotalBudgetNum * 0.8
                              ? '#FF9F43'
                              : '#087BFF',
                          height: '100%',
                          borderRadius: 9999,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Card 5: Date Selector */}
              <Pressable
                onPress={() => setIsDateModalVisible(true)}
                className="card-surface p-4 rounded-2xl flex-row items-center justify-between border border-[#263754] active:bg-[#192743] mb-3"
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-10 h-10 items-center justify-center mr-3">
                    <CalendarIcon size={22} color="#168CFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-secondary text-xs font-medium font-inter-medium">
                      Date
                    </Text>
                    <Text className="text-white text-sm font-semibold font-inter-semibold mt-0.5">
                      {displayDate}
                    </Text>
                  </View>
                </View>
                <ChevronDown size={18} color="#8FA0C0" />
              </Pressable>

              {/* Card 6: Note Input (Optional) */}
              <View className="card-surface p-4 rounded-2xl flex-row items-center border border-[#263754] mb-4">
                <View className="w-10 h-10 items-center justify-center mr-3">
                  <FileText size={22} color="#168CFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-secondary text-xs font-medium font-inter-medium">
                    Note (Optional)
                  </Text>
                  <TextInput
                    value={note}
                    onChangeText={setNote}
                    placeholder="Add a note..."
                    placeholderTextColor="#5C7194"
                    className="text-white text-sm font-normal font-inter-regular p-0 mt-0.5"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 4. Action Button: Add Expense -> */}
          <View className="pt-4">
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#087BFF] py-4 rounded-full flex-row items-center justify-center active:opacity-90 shadow-lg shadow-[#087BFF]/30"
              style={{
                backgroundColor: '#087BFF',
                borderRadius: 9999,
              }}
            >
              <Text className="text-white text-base font-bold font-inter-bold">
                {isSubmitting
                  ? 'Saving...'
                  : isFirstExpenseFlow
                  ? 'Save First Expense'
                  : 'Add Expense'}
              </Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: 8 }} />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Picker Modal */}
      <CategoryPickerModal
        visible={isCategoryModalVisible}
        selectedCategoryId={selectedCategory.id}
        onSelectCategory={setSelectedCategory}
        onClose={() => setIsCategoryModalVisible(false)}
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={isDateModalVisible}
        selectedDate={displayDate}
        onSelectDate={(disp, iso) => {
          setDisplayDate(disp);
          setIsoDate(iso);
        }}
        onClose={() => setIsDateModalVisible(false)}
      />
    </SafeAreaView>
  );
}
