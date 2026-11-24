import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Wallet, ChevronDown } from 'lucide-react-native';
import ProgressRing from '@/components/ui/ProgressRing';
import AnimatedProgressBar from '@/components/ui/AnimatedProgressBar';
import { colors } from '@/theme/colors';

interface BudgetOverviewCardProps {
  totalBudget: number;
  totalSpent: number;
  remainingAmount: number;
  currencyPrefix?: string;
  onSelectPeriod?: () => void;
}

export default function BudgetOverviewCard({
  totalBudget = 0,
  totalSpent = 0,
  remainingAmount = 0,
  currencyPrefix = '$',
  onSelectPeriod,
}: BudgetOverviewCardProps) {
  // Validate and handle numeric values safely
  const validBudget = isNaN(totalBudget) ? 0 : Math.max(0, totalBudget);
  const validSpent = isNaN(totalSpent) ? 0 : Math.max(0, totalSpent);
  const validRemaining = isNaN(remainingAmount)
    ? Math.max(0, validBudget - validSpent)
    : Math.max(0, remainingAmount);

  // Dynamic progress circle calculation:
  // Remaining budget as a percentage of the total budget (e.g. 150 / 300 = 0.5 -> 50% filled)
  const remainingRatio = validBudget > 0 ? Math.min(1, Math.max(0, validRemaining / validBudget)) : 0;
  const spentRatio = validBudget > 0 ? Math.min(1, Math.max(0, validSpent / validBudget)) : 0;

  return (
    <View
      style={{
        backgroundColor: '#0A2552',
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: '#263754',
        marginBottom: 14,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background glow circle */}
      <View
        className="absolute -top-10 -left-10 w-44 h-44 rounded-full opacity-30 pointer-events-none"
        style={{ backgroundColor: colors.brightBlue }}
      />

      {/* Top Row: Info & Animated Progress Ring */}
      <View className="flex-row items-center justify-between mb-4">
        {/* Left Side: Wallet, Title, Amount & Month Filter */}
        <View className="flex-1 pr-3">
          <View className="flex-row items-center mb-1.5">
            <View className="w-8 h-8 rounded-lg bg-bright-blue/20 border border-bright-blue/30 items-center justify-center mr-2">
              <Wallet size={16} color={colors.brightBlue} />
            </View>
            <Text
              className="text-text-secondary text-xs font-medium"
              style={{ fontFamily: 'Inter_500Medium' }}
            >
              Total Monthly Budget
            </Text>
          </View>

          <View className="flex-row items-baseline space-x-2 mt-1">
            <Text
              className="text-white text-[32px] font-bold leading-9 tracking-tight"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              {currencyPrefix}
              {validBudget.toLocaleString()}
            </Text>

            <Pressable
              onPress={onSelectPeriod}
              className="flex-row items-center bg-[#071936] px-2.5 py-1 rounded-md border border-border ml-2"
            >
              <Text
                className="text-text-secondary text-[11px] font-medium mr-1"
                style={{ fontFamily: 'Inter_500Medium' }}
              >
                This Month
              </Text>
              <ChevronDown size={11} color={colors.text.secondary} />
            </Pressable>
          </View>
        </View>

        {/* Right Side: Animated Circular Progress Ring (dynamically represents remaining budget %) */}
        <ProgressRing
          size={78}
          strokeWidth={6.5}
          progress={remainingRatio}
          color={colors.success}
          trackColor="#071E3D"
          centerAmount={`${currencyPrefix}${validRemaining.toLocaleString()}`}
          centerLabel="Left"
        />
      </View>

      {/* Dual Progress Bar with smooth animation on budget/spending changes */}
      <AnimatedProgressBar
        progress={spentRatio}
        height={8}
        color={colors.success}
        backgroundColor="#06152B"
        style={{ marginBottom: 8 }}
      />

      {/* Bottom Labels */}
      <View className="flex-row justify-between items-center">
        <Text
          className="text-text-secondary text-xs font-normal"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {currencyPrefix}
          {validSpent.toLocaleString()} Spent
        </Text>
        <Text
          className="text-success text-xs font-semibold"
          style={{ fontFamily: 'Inter_600SemiBold' }}
        >
          {currencyPrefix}
          {validRemaining.toLocaleString()} Left
        </Text>
      </View>
    </View>
  );
}
