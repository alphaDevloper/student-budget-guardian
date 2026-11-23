import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, ArrowDown, Award, Zap } from 'lucide-react-native';
import SpendingWaveChart from './SpendingWaveChart';

interface TrendsTabProps {
  totalSpent: number;
  dailyAverage: number;
  currencyPrefix?: string;
  highestSpendingDay?: string;
  highestSpendingAmount?: number;
}

export default function TrendsTab({
  totalSpent = 480,
  dailyAverage = 16,
  currencyPrefix = '$',
  highestSpendingDay = 'Saturday',
  highestSpendingAmount = 45,
}: TrendsTabProps) {
  // Weekly spending breakdown (sample student schedule)
  const days = [
    { day: 'Mon', amount: 15, pct: 35 },
    { day: 'Tue', amount: 22, pct: 50 },
    { day: 'Wed', amount: 18, pct: 40 },
    { day: 'Thu', amount: 30, pct: 70 },
    { day: 'Fri', amount: 35, pct: 80 },
    { day: 'Sat', amount: highestSpendingAmount, pct: 100 },
    { day: 'Sun', amount: 20, pct: 45 },
  ];

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
              Consistent & Stable
            </Text>
          </View>
          <View className="w-8 h-8 rounded-lg bg-[#152A50] border border-[#263754] items-center justify-center">
            <TrendingUp size={16} color="#168CFF" />
          </View>
        </View>

        <SpendingWaveChart height={70} color="#168CFF" gradientStartOpacity={0.4} />

        <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-[#192743]">
          <Text className="text-text-secondary text-xs font-inter-regular">
            vs. Last Month
          </Text>
          <View className="flex-row items-center">
            <ArrowDown size={12} color="#20D997" strokeWidth={2.5} />
            <Text className="text-[#20D997] text-xs font-bold font-inter-bold ml-1">
              12% less spending
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

      {/* 3. Weekly Distribution Bar Chart */}
      <View
        className="card-surface p-5 rounded-2xl mb-4"
        style={{ marginBottom: 16 }}
      >
        <Text className="text-white text-sm font-bold font-inter-bold mb-4">
          Weekly Spending Pattern
        </Text>

        <View className="flex-row items-end justify-between h-28 pt-2">
          {days.map((item) => {
            const isPeak = item.day === 'Sat';
            return (
              <View key={item.day} className="items-center flex-1">
                <Text className="text-text-secondary text-[10px] font-inter-regular mb-1">
                  {currencyPrefix}{item.amount}
                </Text>
                <View className="w-4 h-16 bg-[#192743] rounded-full overflow-hidden justify-end">
                  <View
                    className="w-full rounded-full"
                    style={{
                      height: `${item.pct}%`,
                      backgroundColor: isPeak ? '#168CFF' : '#20D997',
                    }}
                  />
                </View>
                <Text
                  className={`text-[11px] mt-1.5 font-inter-medium ${
                    isPeak ? 'text-[#168CFF] font-bold' : 'text-text-secondary'
                  }`}
                >
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
