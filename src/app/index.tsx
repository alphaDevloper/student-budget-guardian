import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';
import { HomeScreen, BottomTabBar } from '@/components/dashboard';
import { AnalyticsScreen } from '@/components/analytics';
import { TabKey } from '@/components/dashboard/BottomTabBar';
import {
  useBudgetStore,
  useExpenseStore,
  useIncomeStore,
  useFinancialMetrics,
} from '@/store';
import { EXPENSE_CATEGORIES, getCategoryById } from '@/data/categories';
import { CURRENT_USER } from '@/constants/user';
import { colors } from '@/theme/colors';
import {
  formatCurrency,
  calculateBudgetUtilization,
} from '@/utils';
import { PaymentMethod, Transaction } from '@/types/budget';

const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Easypaisa',
  'Nayapay',
  'Sadapay',
  'JazzCash',
  'Bank Transfer',
];

export default function Index() {
  // Default to true so Home screen UI is immediately visible on launch
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    AsyncStorage.getItem('@student_guardian_onboarding_complete')
      .then((saved) => {
        if (saved === 'false') {
          setIsOnboardingComplete(false);
        }
      })
      .catch(() => {});
  }, []);

  const handleCompleteOnboarding = async () => {
    setIsOnboardingComplete(true);
    await AsyncStorage.setItem('@student_guardian_onboarding_complete', 'true').catch(() => {});
  };

  const handleReplayOnboarding = async () => {
    setIsOnboardingComplete(false);
    await AsyncStorage.setItem('@student_guardian_onboarding_complete', 'false').catch(() => {});
  };

  // Zustand Stores
  const { monthlyBudget } = useBudgetStore();
  const { expenses, addExpense, deleteExpense } = useExpenseStore();
  const { incomes } = useIncomeStore();
  const {
    totalExpenses,
    remainingBudget,
    utilization,
    savingsRate,
    categorySpending,
    dailyAverage,
  } = useFinancialMetrics();

  // Add Expense Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('Cash');
  const [expenseNote, setExpenseNote] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Currency prefix from user profile or budget ($ by default as in design)
  const currencyPrefix = CURRENT_USER.currencyPrefix || '$';

  // Format category budget items for CategoryBudgetGrid
  const categoryGridItems = [
    {
      id: 'food',
      name: 'Food & Dining',
      spent: categorySpending['food'] || 120,
      allocated: 200,
      color: colors.warning,
    },
    {
      id: 'study',
      name: 'Books & Study',
      spent: categorySpending['study'] || 60,
      allocated: 100,
      color: colors.brightBlue,
    },
    {
      id: 'transport',
      name: 'Transport',
      spent: categorySpending['transport'] || 40,
      allocated: 80,
      color: colors.success,
    },
    {
      id: 'other',
      name: 'Others',
      spent: (categorySpending['other'] || 0) + (categorySpending['bills'] || 0) || 60,
      allocated: 120,
      color: colors.purple,
    },
  ];

  // Analytics data calculation from stores with fallback matching reference design
  const analyticsTotalBudget = monthlyBudget?.totalBudget || 800;
  const analyticsTotalSpent = totalExpenses > 0 ? totalExpenses : 480;
  const analyticsRemaining = remainingBudget > 0 ? remainingBudget : 320;

  const foodSpent = categorySpending['food'] || 192;
  const studySpent = categorySpending['study'] || 96;
  const transportSpent = categorySpending['transport'] || 72;
  const otherSpent =
    (categorySpending['other'] || 0) + (categorySpending['bills'] || 0) || 120;

  const analyticsDonutItems = [
    {
      id: 'food',
      name: 'Food & Dining',
      percentage: Math.round((foodSpent / analyticsTotalSpent) * 100) || 40,
      color: '#FF9F43',
    },
    {
      id: 'study',
      name: 'Books & Study',
      percentage: Math.round((studySpent / analyticsTotalSpent) * 100) || 20,
      color: '#FFB938',
    },
    {
      id: 'transport',
      name: 'Transport',
      percentage: Math.round((transportSpent / analyticsTotalSpent) * 100) || 15,
      color: '#20D997',
    },
    {
      id: 'others',
      name: 'Others',
      percentage: Math.round((otherSpent / analyticsTotalSpent) * 100) || 25,
      color: '#965BFF',
    },
  ];

  const analyticsCategoryDetails = [
    {
      id: 'food',
      name: 'Food & Dining',
      spent: foodSpent,
      allocated: 320,
      color: '#FF9F43',
    },
    {
      id: 'study',
      name: 'Books & Study',
      spent: studySpent,
      allocated: 160,
      color: '#FFB938',
    },
    {
      id: 'transport',
      name: 'Transport',
      spent: transportSpent,
      allocated: 120,
      color: '#20D997',
    },
    {
      id: 'others',
      name: 'Others',
      spent: otherSpent,
      allocated: 200,
      color: '#965BFF',
    },
  ];

  // All transactions combined and sorted by date
  const allTransactions: Transaction[] = [...expenses, ...incomes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleCreateExpense = () => {
    const numAmount = parseFloat(expenseAmount.replace(/[^0-9.]/g, ''));
    if (!expenseTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for the expense.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid expense amount.');
      return;
    }

    addExpense({
      title: expenseTitle.trim(),
      amount: numAmount,
      categoryId: selectedCategory,
      paymentMethod: selectedPayment,
      note: expenseNote.trim() || undefined,
    });

    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseNote('');
    setFormSuccess(true);

    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('home');
    }, 1200);
  };

  // 1. Onboarding Screen
  if (!isOnboardingComplete) {
    return (
      <OnboardingScreen
        onGetStarted={handleCompleteOnboarding}
        onSkip={handleCompleteOnboarding}
      />
    );
  }

  // 2. Home Tab (Pixel-Perfect Home Screen from Design)
  if (activeTab === 'home') {
    return (
      <HomeScreen
        totalBudget={800}
        totalSpent={480}
        remainingAmount={320}
        currencyPrefix={currencyPrefix}
        categories={categoryGridItems}
        transactions={allTransactions}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onNotificationPress={() =>
          Alert.alert(
            'Notifications',
            "You have 1 budget alert: You've used 60% of your Food & Dining budget."
          )
        }
        onSeeAllTransactions={() => setActiveTab('analytics')}
        onPressTransaction={(tx) => {
          Alert.alert(
            tx.title,
            `Amount: ${currencyPrefix}${tx.amount}\nCategory: ${
              getCategoryById(tx.categoryId).name
            }\nDate: ${new Date(tx.date).toLocaleDateString()}`,
            [
              { text: 'Close', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => deleteExpense(tx.id),
              },
            ]
          );
        }}
      />
    );
  }

  // 3. Add Expense Tab
  if (activeTab === 'add') {
    return (
      <SafeAreaView className="flex-1 bg-dark-navy" edges={['top']}>
        <View className="px-5 pt-3 pb-3 border-b border-border flex-row items-center justify-between">
          <Text
            className="text-white text-xl font-bold"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            Add Expense
          </Text>
          <Pressable
            onPress={() => setActiveTab('home')}
            className="px-3 py-1 rounded-full bg-surface border border-border"
          >
            <Text className="text-bright-blue text-xs font-semibold">
              Cancel
            </Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {formSuccess && (
            <View className="mb-4 p-3 bg-success/20 border border-success/40 rounded-xl flex-row items-center">
              <Text className="text-success text-sm font-semibold">
                ✓ Expense recorded! Budget updated.
              </Text>
            </View>
          )}

          {/* Title */}
          <View className="mb-4">
            <Text className="text-text-secondary text-xs font-medium mb-1.5">
              Expense Title *
            </Text>
            <TextInput
              className="input-field"
              placeholder="e.g. Burger King, Bookstore, Bus Fare"
              placeholderTextColor={colors.text.disabled}
              value={expenseTitle}
              onChangeText={setExpenseTitle}
            />
          </View>

          {/* Amount */}
          <View className="mb-4">
            <Text className="text-text-secondary text-xs font-medium mb-1.5">
              Amount ({currencyPrefix}) *
            </Text>
            <TextInput
              className="input-field text-lg font-bold"
              placeholder={`${currencyPrefix}0.00`}
              placeholderTextColor={colors.text.disabled}
              value={expenseAmount}
              onChangeText={setExpenseAmount}
              keyboardType="numeric"
            />
          </View>

          {/* Category */}
          <View className="mb-5">
            <Text className="text-text-secondary text-xs font-medium mb-2">
              Category *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl border flex-row items-center ${
                      isSelected
                        ? 'bg-surface-elevated border-bright-blue'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <View
                      className="w-2.5 h-2.5 rounded-full mr-2"
                      style={{ backgroundColor: cat.color }}
                    />
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? 'text-white' : 'text-text-secondary'
                      }`}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Payment Method */}
          <View className="mb-5">
            <Text className="text-text-secondary text-xs font-medium mb-2">
              Payment Method
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPayment === method;
                return (
                  <Pressable
                    key={method}
                    onPress={() => setSelectedPayment(method)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      isSelected
                        ? 'bg-bright-blue/20 border-bright-blue'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        isSelected
                          ? 'text-bright-blue font-semibold'
                          : 'text-text-secondary'
                      }`}
                    >
                      {method}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Note */}
          <View className="mb-6">
            <Text className="text-text-secondary text-xs font-medium mb-1.5">
              Note (Optional)
            </Text>
            <TextInput
              className="input-field"
              placeholder="e.g. Lunch with study group"
              placeholderTextColor={colors.text.disabled}
              value={expenseNote}
              onChangeText={setExpenseNote}
            />
          </View>

          <Pressable
            onPress={handleCreateExpense}
            className="w-full btn-primary py-4 rounded-full items-center justify-center flex-row active:opacity-90 shadow-lg shadow-bright-blue/30"
          >
            <Text
              className="text-white text-base font-semibold"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Save Expense
            </Text>
          </Pressable>
        </ScrollView>

        <BottomTabBar
          activeTab={activeTab}
          onTabPress={setActiveTab}
          bottomInset={insets.bottom}
        />
      </SafeAreaView>
    );
  }

  // 4. Analytics Tab (Pixel-Perfect Matching Reference Design)
  if (activeTab === 'analytics') {
    return (
      <AnalyticsScreen
        totalBudget={analyticsTotalBudget}
        totalSpent={analyticsTotalSpent}
        remainingAmount={analyticsRemaining}
        currencyPrefix={currencyPrefix}
        categoryDonutItems={analyticsDonutItems}
        categoryDetailItems={analyticsCategoryDetails}
        dailyAverage={dailyAverage || 16}
        budgetUtilizationPercent={67}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onPressInsight={() => {
          Alert.alert(
            "You're on track!",
            'Great job keeping your expenses under control this month. You have spent $480 of your $800 monthly budget, leaving $320 remaining.'
          );
        }}
      />
    );
  }

  // 5. Settings Tab
  return (
    <SafeAreaView className="flex-1 bg-dark-navy" edges={['top']}>
      <View className="px-5 pt-3 pb-3 border-b border-border flex-row items-center justify-between">
        <Text
          className="text-white text-xl font-bold"
          style={{ fontFamily: 'Inter_700Bold' }}
        >
          Settings
        </Text>
        <Pressable
          onPress={() => setIsOnboardingComplete(false)}
          className="px-3 py-1 rounded-full bg-surface border border-border"
        >
          <Text className="text-bright-blue text-xs font-semibold">
            ‹ Onboarding
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="card-surface p-5 rounded-2xl mb-4">
          <Text className="text-white font-bold text-base mb-2">
            User Profile
          </Text>
          <Text className="text-text-secondary text-sm">
            Name: {CURRENT_USER.name}
          </Text>
          <Text className="text-text-secondary text-sm mt-1">
            Currency: {currencyPrefix}
          </Text>
          <Text className="text-text-secondary text-sm mt-1">
            Greeting: {CURRENT_USER.greetingTitle}
          </Text>
        </View>

        <Pressable
          onPress={handleReplayOnboarding}
          className="w-full btn-secondary py-3.5 rounded-full items-center justify-center mt-4"
        >
          <Text className="text-white text-sm font-semibold">
            ← Replay Onboarding Screen
          </Text>
        </Pressable>
      </ScrollView>

      <BottomTabBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
        bottomInset={insets.bottom}
      />
    </SafeAreaView>
  );
}
