import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import { colors } from "@/theme/colors";
import {
  SAMPLE_MONTHLY_BUDGET,
  SAMPLE_TRANSACTIONS,
  FINANCIAL_TIPS,
  SAMPLE_FINANCIAL_GOALS,
  getCategoryById,
} from "@/data";
import {
  formatPKR,
  formatTransactionAmount,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateRemainingBudget,
  calculateBudgetUtilization,
  formatTransactionDate,
} from "@/utils";

export default function Index() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const handleGetStarted = () => {
    setIsOnboardingComplete(true);
  };

  const handleSkip = () => {
    setIsOnboardingComplete(true);
  };

  // If onboarding is active, show the onboarding screen
  if (!isOnboardingComplete) {
    return (
      <OnboardingScreen
        onGetStarted={handleGetStarted}
        onSkip={handleSkip}
      />
    );
  }

  // Calculate live summary from sample data
  const totalIncome = calculateTotalIncome(SAMPLE_TRANSACTIONS) || SAMPLE_MONTHLY_BUDGET.totalIncome;
  const totalExpenses = calculateTotalExpenses(SAMPLE_TRANSACTIONS);
  const remainingBudget = calculateRemainingBudget(
    SAMPLE_MONTHLY_BUDGET.totalBudget,
    totalExpenses
  );
  const utilization = calculateBudgetUtilization(
    SAMPLE_MONTHLY_BUDGET.totalBudget,
    totalExpenses
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-navy" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View className="pt-4 pb-4 flex-row items-center justify-between border-b border-border">
          <View>
            <Text
              className="text-white text-xl font-bold"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Student Dashboard
            </Text>
            <Text
              className="text-text-secondary text-xs mt-0.5"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              November 2026 • PKR Budget
            </Text>
          </View>
          <Pressable
            onPress={() => setIsOnboardingComplete(false)}
            className="bg-surface-elevated px-3 py-1.5 rounded-full border border-border"
          >
            <Text className="text-bright-blue text-xs font-semibold">
              ‹ Onboarding
            </Text>
          </Pressable>
        </View>

        {/* Monthly Budget Card */}
        <View className="card-surface p-5 mt-5">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-text-secondary text-xs uppercase font-medium">
                Total Monthly Budget
              </Text>
              <Text
                className="text-white text-3xl font-bold mt-1"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {formatPKR(SAMPLE_MONTHLY_BUDGET.totalBudget)}
              </Text>
            </View>

            <View className="items-end">
              <View className="badge-success px-2.5 py-1 flex-row items-center">
                <Text className="text-success text-xs font-semibold">
                  Income: {formatPKR(totalIncome)}
                </Text>
              </View>
              <Text className="text-text-secondary text-[11px] mt-1">
                Left: {formatPKR(remainingBudget)}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="w-full h-2.5 bg-surface-elevated rounded-full overflow-hidden my-2">
            <View
              className="h-full bg-bright-blue rounded-full"
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </View>

          <View className="flex-row justify-between mt-1">
            <Text className="text-text-secondary text-xs">
              Spent: {formatPKR(totalExpenses)}
            </Text>
            <Text className="text-bright-blue text-xs font-semibold">
              {utilization}% Used
            </Text>
          </View>
        </View>

        {/* Category Budgets */}
        <View className="mt-6">
          <Text
            className="text-white text-lg font-bold mb-3"
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Category Budgets
          </Text>

          {SAMPLE_MONTHLY_BUDGET.categoryBudgets.slice(0, 4).map((cb) => {
            const cat = getCategoryById(cb.categoryId);
            const percent = calculateBudgetUtilization(
              cb.allocatedAmount,
              cb.spentAmount
            );
            return (
              <View
                key={cb.categoryId}
                className="card-surface p-3.5 mb-2.5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${cat.color}25` }}
                  >
                    <View
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </View>
                  <View className="flex-1 mr-2">
                    <Text className="text-white font-semibold text-sm">
                      {cat.name}
                    </Text>
                    <Text className="text-text-secondary text-xs mt-0.5">
                      {formatPKR(cb.spentAmount)} / {formatPKR(cb.allocatedAmount)}
                    </Text>
                    {/* Micro bar */}
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

        {/* Financial Goals */}
        <View className="mt-6">
          <Text
            className="text-white text-lg font-bold mb-3"
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Student Financial Goals
          </Text>
          {SAMPLE_FINANCIAL_GOALS.map((goal) => {
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
                  <Text className="text-success text-xs font-bold">
                    {goal.isCompleted ? "Completed ✓" : `${pct}%`}
                  </Text>
                </View>
                <Text className="text-text-secondary text-xs mb-2">
                  Saved {formatPKR(goal.currentAmount)} of {formatPKR(goal.targetAmount)}
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

        {/* Recent Transactions in PKR */}
        <View className="mt-6">
          <Text
            className="text-white text-lg font-bold mb-3"
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Recent Transactions
          </Text>

          <View className="card-surface p-4">
            {SAMPLE_TRANSACTIONS.slice(0, 5).map((tx) => {
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

                  <Text
                    className={`font-bold text-sm ${
                      tx.type === "income" ? "text-success" : "text-danger"
                    }`}
                  >
                    {formatTransactionAmount(tx.amount, tx.type)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Financial Tips */}
        <View className="mt-6">
          <Text
            className="text-white text-lg font-bold mb-3"
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Student Budgeting Tips
          </Text>

          {FINANCIAL_TIPS.slice(0, 3).map((tip) => (
            <View key={tip.id} className="card-surface p-4 mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-bright-blue font-semibold text-sm">
                  {tip.title}
                </Text>
                <Text className="text-text-secondary text-[10px]">
                  {tip.readTimeMinutes} min read
                </Text>
              </View>
              <Text className="text-text-secondary text-xs leading-4 mt-1">
                {tip.summary}
              </Text>
              {tip.actionableStep && (
                <View className="mt-2.5 bg-surface-elevated p-2 rounded-md border border-border/50">
                  <Text className="text-[11px] text-white">
                    <Text className="text-bright-blue font-semibold">Tip: </Text>
                    {tip.actionableStep}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Back to onboarding preview */}
        <Pressable
          onPress={() => setIsOnboardingComplete(false)}
          className="w-full btn-secondary py-3.5 rounded-full items-center justify-center mt-6 active:opacity-90"
        >
          <Text
            className="text-white text-sm font-semibold"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            ← View Onboarding Screen
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
