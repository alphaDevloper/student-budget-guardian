import React, { useState } from 'react';
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
import { useExpenseStore } from '@/store';
import { colors } from '@/theme/colors';

interface AddExpenseScreenProps {
  onBack: () => void;
  onSuccess?: () => void;
  currencyPrefix?: string;
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
}: AddExpenseScreenProps) {
  const insets = useSafeAreaInsets();
  const { addExpense } = useExpenseStore();

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<Category>(EXPENSE_CATEGORIES[0]); // Default: Food & Dining
  const [amount, setAmount] = useState('');
  const [displayDate, setDisplayDate] = useState(`Today, ${formatExpenseDisplayDate(new Date())}`);
  const [isoDate, setIsoDate] = useState(new Date().toISOString());
  const [note, setNote] = useState('');

  // Modals State
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    const cleanAmountStr = amount.replace(/[^0-9.]/g, '');
    const numAmount = parseFloat(cleanAmountStr);

    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid expense amount greater than 0.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine appropriate title (e.g. note if provided, or category name)
      const expenseTitle = note.trim() ? note.trim() : selectedCategory.name;

      addExpense({
        title: expenseTitle,
        amount: numAmount,
        categoryId: selectedCategory.id,
        date: isoDate,
        note: note.trim() || undefined,
      });

      // Clear form and navigate back
      setAmount('');
      setNote('');

      if (onSuccess) {
        onSuccess();
      } else {
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
                    {getCategoryIcon(selectedCategory.icon, '#168CFF')}
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

              {/* Card 2: Amount Input */}
              <View className="card-surface p-4 rounded-2xl flex-row items-center border border-[#263754] mb-3">
                <View className="w-10 h-10 items-center justify-center mr-3">
                  <DollarSign size={22} color="#168CFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-secondary text-xs font-medium font-inter-medium">
                    Amount
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

              {/* Card 3: Date Selector */}
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

              {/* Card 4: Note Input (Optional) */}
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
                Add Expense
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
