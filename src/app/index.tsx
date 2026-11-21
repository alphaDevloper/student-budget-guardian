import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import { colors } from "@/theme/colors";
import {
  useBudgetStore,
  useExpenseStore,
  useIncomeStore,
  useFinancialMetrics,
} from "@/store";
import { EXPENSE_CATEGORIES, getCategoryById } from "@/data/categories";
import { FINANCIAL_TIPS } from "@/data/financial-tips";
import {
  formatPKR,
  formatTransactionAmount,
  formatTransactionDate,
  calculateBudgetUtilization,
} from "@/utils";
import { PaymentMethod, Transaction } from "@/types/budget";

type ActiveTab = "home" | "add" | "analytics";

const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Easypaisa",
  "Nayapay",
  "Sadapay",
  "JazzCash",
  "Bank Transfer",
];

export default function Index() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  // Zustand Store Hooks
  const { monthlyBudget, financialGoals, contributeToGoal } = useBudgetStore();
  const { expenses, addExpense, deleteExpense } = useExpenseStore();
  const { incomes } = useIncomeStore();
  const {
    totalIncome,
    totalExpenses,
    remainingBudget,
    utilization,
    savingsRate,
    categorySpending,
    dailyAverage,
  } = useFinancialMetrics();

  // Add Expense Form State
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("Cash");
  const [expenseNote, setExpenseNote] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Combine and sort recent transactions
  const allTransactions: Transaction[] = [...expenses, ...incomes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleCreateExpense = () => {
    const numAmount = parseFloat(expenseAmount.replace(/[^0-9.]/g, ""));
    if (!expenseTitle.trim()) {
      Alert.alert("Missing Title", "Please enter a title for the expense.");
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid expense amount in PKR.");
      return;
    }

    addExpense({
      title: expenseTitle.trim(),
      amount: numAmount,
      categoryId: selectedCategory,
      paymentMethod: selectedPayment,
      note: expenseNote.trim() || undefined,
    });

    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseNote("");
    setFormSuccess(true);

    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab("home");
    }, 1200);
  };

  const handleDeleteTransaction = (tx: Transaction) => {
    if (tx.type === "expense") {
      deleteExpense(tx.id);
    }
  };

  // If onboarding is active, show the onboarding screen
  if (!isOnboardingComplete) {
    return (
      <OnboardingScreen
        onGetStarted={() => setIsOnboardingComplete(true)}
        onSkip={() => setIsOnboardingComplete(true)}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-navy" edges={["top", "bottom"]}>
      {/* App Header & Navigation */}
      <View className="px-5 pt-3 pb-3 border-b border-border bg-dark-navy">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <View className="flex-row items-baseline">
              <Text
                className="text-white text-xl font-bold"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Student{" "}
              </Text>
              <Text
                className="text-bright-blue text-xl font-bold"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Guardian
              </Text>
            </View>
            <Text
              className="text-text-secondary text-[11px] mt-0.5"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              PKR Budget • Zustand Persisted
            </Text>
          </View>

          <Pressable
            onPress={() => setIsOnboardingComplete(false)}
            className="bg-surface-elevated px-3 py-1.5 rounded-full border border-border active:opacity-70"
          >
            <Text className="text-bright-blue text-xs font-semibold">
              ‹ Onboarding
            </Text>
          </Pressable>
        </View>

        {/* Tab Navigation: Home | Add Expense | Analytics */}
        <View className="flex-row bg-surface p-1 rounded-xl border border-border">
          <Pressable
            onPress={() => setActiveTab("home")}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === "home" ? "bg-bright-blue" : ""
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                activeTab === "home" ? "text-white" : "text-text-secondary"
              }`}
            >
              Home
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("add")}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === "add" ? "bg-bright-blue" : ""
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                activeTab === "add" ? "text-white" : "text-text-secondary"
              }`}
            >
              + Add Expense
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("analytics")}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === "analytics" ? "bg-bright-blue" : ""
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                activeTab === "analytics" ? "text-white" : "text-text-secondary"
              }`}
            >
              Analytics
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TAB 1: HOME SCREEN */}
        {activeTab === "home" && (
          <View className="pt-4">
            {/* Live Monthly Budget Overview Card */}
            <View className="card-surface p-5 mb-5">
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text className="text-text-secondary text-xs uppercase font-medium">
                    Total Monthly Budget
                  </Text>
                  <Text
                    className="text-white text-3xl font-bold mt-1"
                    style={{ fontFamily: "Inter_700Bold" }}
                  >
                    {formatPKR(monthlyBudget.totalBudget)}
                  </Text>
                </View>

                <View className="items-end">
                  <View className="badge-success px-2.5 py-1 flex-row items-center">
                    <Text className="text-success text-xs font-semibold">
                      Income: {formatPKR(totalIncome)}
                    </Text>
                  </View>
                  <Text
                    className={`text-xs font-semibold mt-1.5 ${
                      remainingBudget >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    Remaining: {formatPKR(remainingBudget)}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="w-full h-2.5 bg-surface-elevated rounded-full overflow-hidden my-2">
                <View
                  className={`h-full rounded-full ${
                    utilization > 100
                      ? "bg-danger"
                      : utilization > 80
                      ? "bg-warning"
                      : "bg-bright-blue"
                  }`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </View>

              <View className="flex-row justify-between mt-1">
                <Text className="text-text-secondary text-xs">
                  Spent: {formatPKR(totalExpenses)}
                </Text>
                <Text className="text-bright-blue text-xs font-semibold">
                  {utilization}% Utilized
                </Text>
              </View>
            </View>

            {/* Category Budgets (Live Updated from Expense Store) */}
            <View className="mb-6">
              <Text
                className="text-white text-lg font-bold mb-3"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Category Budgets
              </Text>

              {monthlyBudget.categoryBudgets.map((cb) => {
                const cat = getCategoryById(cb.categoryId);
                // Calculate live spending from expenses store
                const liveSpent = categorySpending[cb.categoryId] || 0;
                const percent = calculateBudgetUtilization(
                  cb.allocatedAmount,
                  liveSpent
                );

                return (
                  <View
                    key={cb.categoryId}
                    className="card-surface p-3.5 mb-2.5 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center flex-1 mr-3">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: `${cat.color}25` }}
                      >
                        <View
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-semibold text-sm">
                          {cat.name}
                        </Text>
                        <Text className="text-text-secondary text-xs mt-0.5">
                          {formatPKR(liveSpent)} / {formatPKR(cb.allocatedAmount)}
                        </Text>
                        <View className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden mt-1.5">
                          <View
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(percent, 100)}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                    <Text
                      className="font-bold text-xs"
                      style={{ color: cat.color }}
                    >
                      {percent}%
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Financial Goals with Interactive Contribution */}
            <View className="mb-6">
              <Text
                className="text-white text-lg font-bold mb-3"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Student Financial Goals
              </Text>
              {financialGoals.map((goal) => {
                const pct = calculateBudgetUtilization(
                  goal.targetAmount,
                  goal.currentAmount
                );
                return (
                  <View key={goal.id} className="card-surface p-3.5 mb-2.5">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-white font-semibold text-sm">
                        {goal.title}
                      </Text>
                      <View className="flex-row items-center space-x-2">
                        <Text className="text-success text-xs font-bold mr-2">
                          {goal.isCompleted ? "Goal Met ✓" : `${pct}%`}
                        </Text>
                        {!goal.isCompleted && (
                          <Pressable
                            onPress={() => contributeToGoal(goal.id, 1000)}
                            className="bg-primary/20 px-2 py-0.5 rounded border border-primary/40 active:opacity-70"
                          >
                            <Text className="text-bright-blue text-[10px] font-bold">
                              +Rs. 1,000
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                    <Text className="text-text-secondary text-xs mb-2">
                      Saved {formatPKR(goal.currentAmount)} of{" "}
                      {formatPKR(goal.targetAmount)}
                    </Text>
                    <View className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                      <View
                        className="h-full bg-success rounded-full"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Recent Transactions (Live list with Delete support) */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text
                  className="text-white text-lg font-bold"
                  style={{ fontFamily: "Inter_700Bold" }}
                >
                  Recent Transactions
                </Text>
                <Text className="text-text-secondary text-xs">
                  {allTransactions.length} total
                </Text>
              </View>

              <View className="card-surface p-4">
                {allTransactions.slice(0, 7).map((tx) => {
                  const cat = getCategoryById(tx.categoryId);
                  return (
                    <View
                      key={tx.id}
                      className="flex-row items-center justify-between py-2.5 border-b border-border/30 last:border-0"
                    >
                      <View className="flex-row items-center flex-1 mr-2">
                        <View
                          className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                          style={{ backgroundColor: `${cat.color}25` }}
                        >
                          <View
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-white font-medium text-sm"
                            numberOfLines={1}
                          >
                            {tx.title}
                          </Text>
                          <Text className="text-text-secondary text-[11px] mt-0.5">
                            {formatTransactionDate(tx.date)} • {tx.paymentMethod}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center space-x-2">
                        <Text
                          className={`font-bold text-sm mr-2 ${
                            tx.type === "income"
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {formatTransactionAmount(tx.amount, tx.type)}
                        </Text>
                        {tx.type === "expense" && (
                          <Pressable
                            onPress={() => handleDeleteTransaction(tx)}
                            hitSlop={8}
                            className="p-1 active:opacity-60"
                          >
                            <Text className="text-text-disabled text-xs font-bold">
                              ✕
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Financial Tips */}
            <View className="mb-4">
              <Text
                className="text-white text-lg font-bold mb-3"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Student Budgeting Tips
              </Text>
              {FINANCIAL_TIPS.slice(0, 2).map((tip) => (
                <View key={tip.id} className="card-surface p-4 mb-3">
                  <Text className="text-bright-blue font-semibold text-sm mb-1">
                    {tip.title}
                  </Text>
                  <Text className="text-text-secondary text-xs leading-4">
                    {tip.summary}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 2: ADD EXPENSE SCREEN */}
        {activeTab === "add" && (
          <View className="pt-4">
            <Text
              className="text-white text-2xl font-bold mb-1"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Add New Expense
            </Text>
            <Text className="text-text-secondary text-xs mb-5">
              Record a student expense in PKR. Data updates your budget instantly.
            </Text>

            {formSuccess && (
              <View className="mb-4 p-3 bg-success/20 border border-success/40 rounded-xl flex-row items-center">
                <Text className="text-success text-sm font-semibold">
                  ✓ Expense added successfully! Updating budget...
                </Text>
              </View>
            )}

            {/* Expense Title */}
            <View className="mb-4">
              <Text className="text-text-secondary text-xs font-medium mb-1.5">
                Expense Title *
              </Text>
              <TextInput
                className="input-field"
                placeholder="e.g. Campus Cafeteria, Notebooks, Bus"
                placeholderTextColor={colors.text.disabled}
                value={expenseTitle}
                onChangeText={setExpenseTitle}
              />
            </View>

            {/* Expense Amount */}
            <View className="mb-4">
              <Text className="text-text-secondary text-xs font-medium mb-1.5">
                Amount (PKR) *
              </Text>
              <TextInput
                className="input-field text-lg font-bold"
                placeholder="Rs. 0"
                placeholderTextColor={colors.text.disabled}
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Category Selector */}
            <View className="mb-5">
              <Text className="text-text-secondary text-xs font-medium mb-2">
                Select Category *
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
                          ? "bg-surface-elevated border-bright-blue"
                          : "bg-surface border-border"
                      }`}
                    >
                      <View
                        className="w-2.5 h-2.5 rounded-full mr-2"
                        style={{ backgroundColor: cat.color }}
                      />
                      <Text
                        className={`text-xs font-medium ${
                          isSelected ? "text-white" : "text-text-secondary"
                        }`}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Payment Method Selector */}
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
                          ? "bg-bright-blue/20 border-bright-blue"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          isSelected
                            ? "text-bright-blue font-semibold"
                            : "text-text-secondary"
                        }`}
                      >
                        {method}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Optional Note */}
            <View className="mb-6">
              <Text className="text-text-secondary text-xs font-medium mb-1.5">
                Note (Optional)
              </Text>
              <TextInput
                className="input-field"
                placeholder="Add optional detail or tags"
                placeholderTextColor={colors.text.disabled}
                value={expenseNote}
                onChangeText={setExpenseNote}
              />
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleCreateExpense}
              className="w-full btn-primary py-4 rounded-full items-center justify-center flex-row active:opacity-90 shadow-lg shadow-bright-blue/30"
            >
              <Text
                className="text-white text-base font-semibold"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Save Expense
              </Text>
            </Pressable>
          </View>
        )}

        {/* TAB 3: ANALYTICS SCREEN */}
        {activeTab === "analytics" && (
          <View className="pt-4">
            <Text
              className="text-white text-2xl font-bold mb-1"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Monthly Analytics
            </Text>
            <Text className="text-text-secondary text-xs mb-5">
              Live breakdown of student spending patterns in PKR.
            </Text>

            {/* Key Stat Cards */}
            <View className="flex-row space-x-3 mb-5">
              <View className="flex-1 card-surface p-4">
                <Text className="text-text-secondary text-[11px]">
                  Daily Average
                </Text>
                <Text
                  className="text-white text-xl font-bold mt-1"
                  style={{ fontFamily: "Inter_700Bold" }}
                >
                  {formatPKR(dailyAverage)}
                </Text>
                <Text className="text-text-disabled text-[10px] mt-0.5">
                  Over 21 days
                </Text>
              </View>

              <View className="flex-1 card-surface p-4">
                <Text className="text-text-secondary text-[11px]">
                  Savings Rate
                </Text>
                <Text
                  className="text-success text-xl font-bold mt-1"
                  style={{ fontFamily: "Inter_700Bold" }}
                >
                  {savingsRate}%
                </Text>
                <Text className="text-text-disabled text-[10px] mt-0.5">
                  Target: 15%
                </Text>
              </View>
            </View>

            {/* Category Breakdown Bars */}
            <View className="card-surface p-5 mb-5">
              <Text
                className="text-white text-base font-bold mb-3"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Spending by Category
              </Text>

              {EXPENSE_CATEGORIES.map((cat) => {
                const catSpent = categorySpending[cat.id] || 0;
                if (catSpent === 0) return null;
                const catPercent =
                  totalExpenses > 0
                    ? Math.round((catSpent / totalExpenses) * 100)
                    : 0;

                return (
                  <View key={cat.id} className="mb-3.5">
                    <View className="flex-row justify-between items-center mb-1">
                      <View className="flex-row items-center">
                        <View
                          className="w-2.5 h-2.5 rounded-full mr-2"
                          style={{ backgroundColor: cat.color }}
                        />
                        <Text className="text-white text-xs font-medium">
                          {cat.name}
                        </Text>
                      </View>
                      <Text className="text-white text-xs font-semibold">
                        {formatPKR(catSpent)}{" "}
                        <Text className="text-text-secondary text-[11px]">
                          ({catPercent}%)
                        </Text>
                      </Text>
                    </View>

                    <View className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${catPercent}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Financial Health Summary */}
            <View className="card-surface p-5 mb-5">
              <Text
                className="text-white text-base font-bold mb-2"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Financial Guardian Health
              </Text>
              <View className="flex-row items-center py-1.5 border-b border-border/30">
                <Text className="text-text-secondary text-xs flex-1">
                  Budget Utilization
                </Text>
                <Text
                  className={`text-xs font-bold ${
                    utilization > 100
                      ? "text-danger"
                      : utilization > 80
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {utilization}%{" "}
                  {utilization > 100
                    ? "(Over Budget)"
                    : utilization > 80
                    ? "(Warning Zone)"
                    : "(Healthy)"}
                </Text>
              </View>

              <View className="flex-row items-center py-1.5 border-b border-border/30">
                <Text className="text-text-secondary text-xs flex-1">
                  Total Expenses Count
                </Text>
                <Text className="text-white text-xs font-semibold">
                  {expenses.length} records
                </Text>
              </View>

              <View className="flex-row items-center py-1.5">
                <Text className="text-text-secondary text-xs flex-1">
                  Total Income Count
                </Text>
                <Text className="text-white text-xs font-semibold">
                  {incomes.length} records
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
