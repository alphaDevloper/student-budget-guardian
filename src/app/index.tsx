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
  useOnboardingStore,
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
  const {
    isOnboardingCompleted,
    hasAddedFirstExpense,
    setOnboardingCompleted,
    completeFirstTimeFlow,
    resetOnboarding,
  } = useOnboardingStore();

  const [isReplayingOnboarding, setIsReplayingOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // One-time purge of legacy sample transactions stored in AsyncStorage
    Promise.resolve(safeAsyncStorage.getItem('@student_guardian_v2_purged'))
      .then((purged) => {
        if (!purged) {
          useExpenseStore.getState().resetExpensesToDefault();
          useIncomeStore.getState().resetIncomesToDefault();
          useBudgetStore.getState().resetBudgetToDefault();
          resetOnboarding();
          Promise.all([
            safeAsyncStorage.removeItem('student-expense-storage'),
            safeAsyncStorage.removeItem('student-budget-storage'),
            safeAsyncStorage.removeItem('student-income-storage'),
            safeAsyncStorage.removeItem('student-expense-v2'),
            safeAsyncStorage.removeItem('student-budget-v2'),
            safeAsyncStorage.removeItem('student-income-v2'),
            safeAsyncStorage.removeItem('student-onboarding-v2'),
          ])
            .then(() => {
              safeAsyncStorage.setItem('@student_guardian_v2_purged', 'true');
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  // Zustand Stores
  const { monthlyBudget } = useBudgetStore();
  const { expenses, addExpense, deleteExpense } = useExpenseStore();
  const { incomes } = useIncomeStore();

  // If user has recorded expenses, ensure hasAddedFirstExpense is marked true
  useEffect(() => {
    if (expenses.length > 0 && !hasAddedFirstExpense) {
      completeFirstTimeFlow();
    }
  }, [expenses.length, hasAddedFirstExpense]);

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all expenses, income records, and budget allocations? This will also reset the onboarding flow.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            useExpenseStore.getState().resetExpensesToDefault();
            useIncomeStore.getState().resetIncomesToDefault();
            useBudgetStore.getState().resetBudgetToDefault();
            resetOnboarding();
            setIsReplayingOnboarding(false);
            setActiveTab('home');
            try {
              const keys = [
                'student-expense-v2',
                'student-budget-v2',
                'student-income-v2',
                'student-onboarding-v2',
                'student-expense-storage',
                'student-budget-storage',
                'student-income-storage',
              ];
              await Promise.all(keys.map((k) => safeAsyncStorage.removeItem(k)));
            } catch {}
            Alert.alert('Cleared', 'All stored data and onboarding progress have been reset.');
          },
        },
      ]
    );
  };
  const {
    totalIncome,
    totalExpenses,
    remainingBudget,
    utilization,
    savingsRate,
    categorySpending,
    dailyAverage,
    weeklySpending,
    spendingTrajectory,
    spendingTrend,
    peakDay,
    expenseCount,
    incomeCount,
  } = useFinancialMetrics();

  // Currency prefix from user profile or budget ($ by default as in design)
  const currencyPrefix = CURRENT_USER.currencyPrefix || '$';

  // Helper to get allocated budget for a category from real monthly budget
  const getCategoryAllocation = (catId: string) => {
    return (
      monthlyBudget?.categoryBudgets?.find((cb) => cb.categoryId === catId)?.allocatedAmount || 0
    );
  };

  // Format category budget items for CategoryBudgetGrid (purely real data from store)
  const categoryGridItems = [
    {
      id: 'food',
      name: 'Food & Dining',
      spent: categorySpending['food'] || 0,
      allocated: getCategoryAllocation('food'),
      color: colors.warning,
    },
    {
      id: 'study',
      name: 'Books & Study',
      spent: categorySpending['study'] || 0,
      allocated: getCategoryAllocation('study'),
      color: colors.brightBlue,
    },
    {
      id: 'transport',
      name: 'Transport',
      spent: categorySpending['transport'] || 0,
      allocated: getCategoryAllocation('transport'),
      color: colors.success,
    },
    {
      id: 'other',
      name: 'Others',
      spent:
        (categorySpending['other'] || 0) +
        (categorySpending['bills'] || 0) +
        (categorySpending['entertainment'] || 0) +
        (categorySpending['health'] || 0) +
        (categorySpending['shopping'] || 0),
      allocated:
        getCategoryAllocation('other') +
        getCategoryAllocation('bills') +
        getCategoryAllocation('entertainment') +
        getCategoryAllocation('health') +
        getCategoryAllocation('shopping'),
      color: colors.purple,
    },
  ];

  // Real-time financial calculations connected exclusively to Zustand stores & AsyncStorage
  const totalMonthlyBudget = monthlyBudget?.totalBudget || 0;
  const totalMonthlySpent = totalExpenses;
  const totalRemainingBudget = Math.max(0, totalMonthlyBudget - totalMonthlySpent);

  const foodSpent = categorySpending['food'] || 0;
  const studySpent = categorySpending['study'] || 0;
  const transportSpent = categorySpending['transport'] || 0;
  const otherSpent =
    (categorySpending['other'] || 0) +
    (categorySpending['bills'] || 0) +
    (categorySpending['entertainment'] || 0) +
    (categorySpending['health'] || 0) +
    (categorySpending['shopping'] || 0);

  const analyticsDonutItems = [
    {
      id: 'food',
      name: 'Food & Dining',
      percentage:
        totalMonthlySpent > 0
          ? Math.round((foodSpent / totalMonthlySpent) * 100)
          : 0,
      color: '#FF9F43',
    },
    {
      id: 'study',
      name: 'Books & Study',
      percentage:
        totalMonthlySpent > 0
          ? Math.round((studySpent / totalMonthlySpent) * 100)
          : 0,
      color: '#FFB938',
    },
    {
      id: 'transport',
      name: 'Transport',
      percentage:
        totalMonthlySpent > 0
          ? Math.round((transportSpent / totalMonthlySpent) * 100)
          : 0,
      color: '#20D997',
    },
    {
      id: 'others',
      name: 'Others',
      percentage:
        totalMonthlySpent > 0
          ? Math.round((otherSpent / totalMonthlySpent) * 100)
          : 0,
      color: '#965BFF',
    },
  ];

  const analyticsCategoryDetails = [
    {
      id: 'food',
      name: 'Food & Dining',
      spent: foodSpent,
      allocated: getCategoryAllocation('food'),
      color: '#FF9F43',
    },
    {
      id: 'study',
      name: 'Books & Study',
      spent: studySpent,
      allocated: getCategoryAllocation('study'),
      color: '#FFB938',
    },
    {
      id: 'transport',
      name: 'Transport',
      spent: transportSpent,
      allocated: getCategoryAllocation('transport'),
      color: '#20D997',
    },
    {
      id: 'others',
      name: 'Others',
      spent: otherSpent,
      allocated:
        getCategoryAllocation('other') +
        getCategoryAllocation('bills') +
        getCategoryAllocation('entertainment') +
        getCategoryAllocation('health') +
        getCategoryAllocation('shopping'),
      color: '#965BFF',
    },
  ];

  // All transactions combined and sorted by date
  const allTransactions: Transaction[] = [...expenses, ...incomes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 1. First-Time User Flow: Onboarding Screen
  if (!isOnboardingCompleted || isReplayingOnboarding) {
    return (
      <OnboardingScreen
        onGetStarted={() => {
          setIsReplayingOnboarding(false);
          setOnboardingCompleted(true);
        }}
        onSkip={() => {
          setIsReplayingOnboarding(false);
          setOnboardingCompleted(true);
        }}
      />
    );
  }

  // 2. Mandatory First Expense Screen (Secured first-time user flow)
  if (!hasAddedFirstExpense) {
    return (
      <AddExpenseScreen
        isFirstExpenseFlow={true}
        currencyPrefix={currencyPrefix}
        onBack={() => {
          setOnboardingCompleted(false);
        }}
        onSuccess={() => {
          completeFirstTimeFlow();
          setActiveTab('home');
        }}
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
        onNotificationPress={() => {
          if (totalMonthlySpent === 0) {
            Alert.alert(
              'Notifications',
              'No new alerts. Your budget is in great shape!'
            );
          } else if (totalMonthlyBudget > 0 && totalMonthlySpent > totalMonthlyBudget) {
            Alert.alert(
              'Budget Alert',
              `You have exceeded your total monthly budget of ${currencyPrefix}${totalMonthlyBudget}!`
            );
          } else if (totalMonthlyBudget > 0 && totalMonthlySpent >= totalMonthlyBudget * 0.8) {
            Alert.alert(
              'Budget Warning',
              `You have used ${Math.round((totalMonthlySpent / totalMonthlyBudget) * 100)}% of your monthly budget.`
            );
          } else {
            Alert.alert(
              'Notifications',
              "Keep it up! You're managing your budget well."
            );
          }
        }}
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
        dailyAverage={dailyAverage}
        budgetUtilizationPercent={
          totalMonthlyBudget > 0
            ? Math.round((totalMonthlySpent / totalMonthlyBudget) * 100)
            : 0
        }
        spendingTrend={spendingTrend}
        spendingTrajectory={spendingTrajectory}
        weeklySpending={weeklySpending}
        highestSpendingDay={peakDay.day}
        highestSpendingAmount={peakDay.amount}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onPressInsight={() => {
          if (totalMonthlySpent === 0) {
            Alert.alert(
              'Budget Status',
              'You have no expenses recorded yet. Tap + to add an expense.'
            );
          } else if (totalMonthlyBudget === 0) {
            Alert.alert(
              'Budget Status',
              `You have spent ${currencyPrefix}${totalMonthlySpent}. Set a monthly budget to track your target limit.`
            );
          } else {
            const pct = Math.round((totalMonthlySpent / totalMonthlyBudget) * 100);
            Alert.alert(
              pct > 100 ? 'Over Budget' : pct > 80 ? 'Budget Warning' : "You're on track!",
              `You have spent ${currencyPrefix}${totalMonthlySpent} of your ${currencyPrefix}${totalMonthlyBudget} budget (${pct}% used), leaving ${currencyPrefix}${totalRemainingBudget} remaining.`
            );
          }
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
          onPress={() => setIsReplayingOnboarding(true)}
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
          onPress={handleClearAllData}
          className="w-full py-3.5 rounded-full items-center justify-center mt-3 bg-danger/15 border border-danger/30 active:opacity-80"
        >
          <Text className="text-danger text-sm font-semibold">
            Clear All Data & Reset to 0
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setIsReplayingOnboarding(true)}
          className="w-full btn-secondary py-3.5 rounded-full items-center justify-center mt-3"
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
