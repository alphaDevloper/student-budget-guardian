import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, ArrowDown, Award, Zap } from 'lucide-react-native';
import { SpendingTrendLineChart, BudgetComparisonBarChart } from './charts';

interface TrendsTabProps {
  totalSpent?: number;
  dailyAverage?: number;
  currencyPrefix?: string;
  highestSpendingDay?: string;
  highestSpendingAmount?: number;
  weeklySpending?: { day: string; amount: number; pct: number }[];
  spendingTrajectory?: { labels: string[]; values: number[] };
}

export default function TrendsTab({
  totalSpent = 0,
  dailyAverage = 0,
  currencyPrefix = '$',
  highestSpendingDay = 'None',
  highestSpendingAmount = 0,
  weeklySpending = [
    { day: 'Mon', amount: 0, pct: 0 },
    { day: 'Tue', amount: 0, pct: 0 },
    { day: 'Wed', amount: 0, pct: 0 },
    { day: 'Thu', amount: 0, pct: 0 },
    { day: 'Fri', amount: 0, pct: 0 },
    { day: 'Sat', amount: 0, pct: 0 },
    { day: 'Sun', amount: 0, pct: 0 },
  ],
  spendingTrajectory = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    values: [0, 0, 0, 0],
  },
}: TrendsTabProps) {

  return (
    <View>
      {/* 1. Monthly Spending Trajectory */}
      <View
        className="rounded-[24px] p-5 border border-[#263754] overflow-hidden mb-3.5"
        style={{ backgroundColor: '#0B1B36', marginBottom: 14 }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-text-secondary text-xs font-medium font-inter-medium">
              Spending Trajectory
            </Text>
            <Text className="text-white text-xl font-bold font-inter-bold mt-0.5">
              {totalSpent > 0 ? 'Consistent & Stable' : 'No spending yet'}
            </Text>
          </View>
          <View className="w-8 h-8 rounded-lg bg-[#152A50] border border-[#263754] items-center justify-center">
            <TrendingUp size={16} color="#168CFF" />
          </View>
        </View>

        {/* Chart Kit Line Chart for Trajectory */}
        <View className="mt-1 -mx-2">
          <SpendingTrendLineChart
            height={80}
            showAxes={false}
            bezier={true}
            color="#168CFF"
            data={spendingTrajectory}
          />
        </View>

        <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-[#192743]">
          <Text className="text-text-secondary text-xs font-inter-regular">
            vs. Last Month
          </Text>
          <View className="flex-row items-center">
            <ArrowDown size={12} color="#20D997" strokeWidth={2.5} />
            <Text className="text-[#20D997] text-xs font-bold font-inter-bold ml-1">
              {totalSpent > 0 ? 'Active tracking' : '0% spending'}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Key Insights Row */}
      <View
        className="flex-row space-x-3 gap-3 mb-3.5"
        style={{ marginBottom: 14 }}
      >
        <View className="flex-1 card-surface p-4 rounded-2xl justify-between">
          <View className="w-8 h-8 rounded-lg bg-[#152A50] border border-[#263754] items-center justify-center mb-2">
            <Zap size={16} color="#FFB938" />
          </View>
          <Text className="text-text-secondary text-[11px] font-medium font-inter-medium">
            Daily Average
          </Text>
          <Text className="text-white text-xl font-bold font-inter-bold mt-1">
            {currencyPrefix}{Math.round(dailyAverage)}/day
          </Text>
        </View>

        <View className="flex-1 card-surface p-4 rounded-2xl justify-between">
          <View className="w-8 h-8 rounded-lg bg-[#152A50] border border-[#263754] items-center justify-center mb-2">
            <Award size={16} color="#20D997" />
          </View>
          <Text className="text-text-secondary text-[11px] font-medium font-inter-medium">
            Peak Day
          </Text>
          <Text className="text-white text-xl font-bold font-inter-bold mt-1">
            {highestSpendingDay}
          </Text>
        </View>
      </View>

      {/* 3. Weekly Distribution Bar Chart using Chart Kit */}
      <View
        className="card-surface p-4 rounded-2xl mb-4"
        style={{ marginBottom: 16 }}
      >
        <Text className="text-white text-sm font-bold font-inter-bold mb-2">
          Weekly Spending Pattern
        </Text>

        <BudgetComparisonBarChart
          height={170}
          currencyPrefix={currencyPrefix}
          data={{
            labels: weeklySpending.map((w) => w.day),
            datasets: [
              {
                data: weeklySpending.map((w) => w.amount),
              },
            ],
          }}
        />
      </View>
    </View>
  );
}
