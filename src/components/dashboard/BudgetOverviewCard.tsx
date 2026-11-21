import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Wallet, ChevronDown } from 'lucide-react-native';
import ProgressRing from '@/components/ui/ProgressRing';
import { colors } from '@/theme/colors';

interface BudgetOverviewCardProps {
  totalBudget: number;
  totalSpent: number;
  remainingAmount: number;
  currencyPrefix?: string;
  onSelectPeriod?: () => void;
}

export default function BudgetOverviewCard({
  totalBudget = 800,
  totalSpent = 480,
  remainingAmount = 320,
  currencyPrefix = '$',
  onSelectPeriod,
}: BudgetOverviewCardProps) {
  const safeBudget = Math.max(1, totalBudget);
  const progressRatio = Math.min(1, Math.max(0, remainingAmount / safeBudget));
  const spentRatio = Math.min(1, Math.max(0, totalSpent / safeBudget));

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

      {/* Top Row: Info & Progress Ring */}
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
              {totalBudget.toLocaleString()}
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

        {/* Right Side: Circular Progress Ring */}
        <ProgressRing
          size={78}
          strokeWidth={6.5}
          progress={progressRatio}
          color={colors.success}
          trackColor="#071E3D"
          centerAmount={`${currencyPrefix}${remainingAmount.toLocaleString()}`}
          centerLabel="Left"
        />
      </View>

      {/* Dual Progress Bar */}
      <View className="w-full h-2 bg-[#06152B] rounded-full overflow-hidden mb-2">
        <View
          className="h-full rounded-full"
          style={{
            width: `${spentRatio * 100}%`,
            backgroundColor: colors.success,
          }}
        />
      </View>

      {/* Bottom Labels */}
      <View className="flex-row justify-between items-center">
        <Text
          className="text-text-secondary text-xs font-normal"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {currencyPrefix}
          {totalSpent.toLocaleString()} Spent
        </Text>
        <Text
          className="text-success text-xs font-semibold"
          style={{ fontFamily: 'Inter_600SemiBold' }}
        >
          {currencyPrefix}
          {remainingAmount.toLocaleString()} Left
        </Text>
      </View>
    </View>
  );
}
