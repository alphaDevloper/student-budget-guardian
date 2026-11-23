import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';
import { HomeScreen, BottomTabBar } from '@/components/dashboard';
import { AnalyticsScreen } from '@/components/analytics';
import { AddExpenseScreen } from '@/components/expenses';
import { TabKey } from '@/components/dashboard/BottomTabBar';
import {
  useBudgetStore,
  useExpenseStore,
  useIncomeStore,
  useFinancialMetrics,
  safeAsyncStorage,
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
    Promise.resolve(safeAsyncStorage.getItem('@student_guardian_onboarding_complete'))
      .then((saved) => {
        if (saved === 'false') {
          setIsOnboardingComplete(false);
        }
      })
      .catch(() => {});
  }, []);

  const handleCompleteOnboarding = async () => {
    setIsOnboardingComplete(true);
    try {
      await safeAsyncStorage.setItem('@student_guardian_onboarding_complete', 'true');
    } catch {}
  };

  const handleReplayOnboarding = async () => {
    setIsOnboardingComplete(false);
    try {
      await safeAsyncStorage.setItem('@student_guardian_onboarding_complete', 'false');
    } catch {}
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

  // Currency prefix from user profile or budget ($ by default as in design)
  const currencyPrefix = CURRENT_USER.currencyPrefix || '$';

  // Format category budget items for CategoryBudgetGrid
  const categoryGridItems = [
    {
      id: 'food',
      name: 'Food & Dining',
      spent: categorySpending['food'] !== undefined ? categorySpending['food'] : 120,
      allocated: 200,
      color: colors.warning,
    },
    {
      id: 'study',
      name: 'Books & Study',
      spent: categorySpending['study'] !== undefined ? categorySpending['study'] : 60,
      allocated: 100,
      color: colors.brightBlue,
    },
    {
      id: 'transport',
      name: 'Transport',
      spent: categorySpending['transport'] !== undefined ? categorySpending['transport'] : 40,
      allocated: 80,
      color: colors.success,
    },
    {
      id: 'other',
      name: 'Others',
      spent:
        ((categorySpending['other'] || 0) + (categorySpending['bills'] || 0)) || 60,
      allocated: 120,
      color: colors.purple,
    },
  ];

  // Real-time financial calculations connected to Zustand stores & AsyncStorage
  const totalMonthlyBudget =
    monthlyBudget?.totalBudget !== undefined ? monthlyBudget.totalBudget : 800;
  const totalMonthlySpent = totalExpenses > 0 ? totalExpenses : 480;
  const totalRemainingBudget = Math.max(0, totalMonthlyBudget - totalMonthlySpent);

  const foodSpent = categorySpending['food'] !== undefined ? categorySpending['food'] : 192;
  const studySpent = categorySpending['study'] !== undefined ? categorySpending['study'] : 96;
  const transportSpent = categorySpending['transport'] !== undefined ? categorySpending['transport'] : 72;
  const otherSpent =
    ((categorySpending['other'] || 0) + (categorySpending['bills'] || 0)) || 120;

  const analyticsDonutItems = [
    {
      id: 'food',
      name: 'Food & Dining',
      percentage: Math.round((foodSpent / totalMonthlySpent) * 100) || 40,
      color: '#FF9F43',
    },
    {
      id: 'study',
      name: 'Books & Study',
      percentage: Math.round((studySpent / totalMonthlySpent) * 100) || 20,
      color: '#FFB938',
    },
    {
      id: 'transport',
      name: 'Transport',
      percentage: Math.round((transportSpent / totalMonthlySpent) * 100) || 15,
      color: '#20D997',
    },
    {
      id: 'others',
      name: 'Others',
      percentage: Math.round((otherSpent / totalMonthlySpent) * 100) || 25,
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
        totalBudget={totalMonthlyBudget}
        totalSpent={totalMonthlySpent}
        remainingAmount={totalRemainingBudget}
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

  // 3. Add Expense Tab (Pixel-Perfect Matching Reference Design)
  if (activeTab === 'add') {
    return (
      <AddExpenseScreen
        onBack={() => setActiveTab('home')}
        onSuccess={() => setActiveTab('home')}
        currencyPrefix={currencyPrefix}
      />
    );
  }

  // 4. Analytics Tab (Pixel-Perfect Matching Reference Design)
  if (activeTab === 'analytics') {
    return (
      <AnalyticsScreen
        totalBudget={totalMonthlyBudget}
        totalSpent={totalMonthlySpent}
        remainingAmount={totalRemainingBudget}
        currencyPrefix={currencyPrefix}
        categoryDonutItems={analyticsDonutItems}
        categoryDetailItems={analyticsCategoryDetails}
        dailyAverage={dailyAverage || 16}
        budgetUtilizationPercent={
          totalMonthlyBudget > 0
            ? Math.round((totalMonthlySpent / totalMonthlyBudget) * 100)
            : 67
        }
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
