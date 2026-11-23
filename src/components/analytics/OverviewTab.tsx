import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BarChart2, Calendar, Lightbulb, ChevronRight, ArrowDown } from 'lucide-react-native';
import { SpendingTrendLineChart, CategoryPieChart } from './charts';
import { DonutCategoryItem } from './CategoryDonutChart';
import { colors } from '@/theme/colors';

interface OverviewTabProps {
  totalBudget: number;
  totalSpent: number;
  remainingAmount: number;
  currencyPrefix?: string;
  categoryDonutItems: DonutCategoryItem[];
  budgetUtilizationPercent?: number;
  onPressInsight?: () => void;
  onPressCategoryCard?: () => void;
}

export default function OverviewTab({
  totalBudget = 800,
  totalSpent = 480,
  remainingAmount = 320,
  currencyPrefix = '$',
  categoryDonutItems,
  budgetUtilizationPercent = 67,
  onPressInsight,
  onPressCategoryCard,
}: OverviewTabProps) {
  // Format percentage change (down 12% as in reference design)
  const changePercent = 12;

  return (
    <View>
      {/* 1. Total Spending Card with Wave Chart */}
      <View
        className="rounded-[24px] p-5 border border-[#263754] overflow-hidden mb-3.5"
        style={{
          backgroundColor: '#0B1B36',
          marginBottom: 14,
        }}
      >
        {/* Top Header Row inside Card */}
        <View className="flex-row items-start justify-between mb-2">
          <View>
            <Text className="text-text-secondary text-sm font-medium font-inter-medium">
              Total Spending
            </Text>

            <View className="flex-row items-center mt-1">
              <Text className="text-white text-3xl font-bold font-inter-bold">
                {currencyPrefix}{totalSpent.toLocaleString()}
              </Text>

              {/* Percentage Change Badge */}
              <View className="ml-3 px-2 py-0.5 rounded-md bg-[#20D997]/15 border border-[#20D997]/30 flex-row items-center">
                <ArrowDown size={11} color="#20D997" strokeWidth={2.5} />
                <Text className="text-[#20D997] text-xs font-bold font-inter-bold ml-0.5">
                  {changePercent}%
                </Text>
              </View>
            </View>
          </View>

          {/* Mini Bar Chart Icon Badge */}
          <View className="w-9 h-9 rounded-xl bg-[#152A50] border border-[#263754] items-center justify-center">
            <BarChart2 size={18} color="#168CFF" />
          </View>
        </View>

        {/* Chart Kit Line Chart */}
        <View className="mt-1 -mx-2">
          <SpendingTrendLineChart
            height={80}
            showAxes={false}
            bezier={true}
            color="#168CFF"
            data={{
              labels: ['1', '5', '10', '15', '20', '25', '30'],
              values: [120, 180, 240, 310, 390, 440, 480],
            }}
          />
        </View>
      </View>

      {/* 2. Two-Column Stats Row: Budget Left & Total Budget */}
      <View
        className="flex-row space-x-3 gap-3 mb-3.5"
        style={{ marginBottom: 14 }}
      >
        {/* Budget Left Card */}
        <View className="flex-1 card-surface p-4 rounded-2xl justify-between">
          <Text className="text-text-secondary text-xs font-medium font-inter-medium">
            Budget Left
          </Text>
          <Text className="text-white text-2xl font-bold font-inter-bold mt-1 mb-2">
            {currencyPrefix}{remainingAmount.toLocaleString()}
          </Text>

          {/* Progress Bar & Percentage */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 h-2 bg-[#192743] rounded-full overflow-hidden mr-2">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(0, budgetUtilizationPercent))}%`,
                  backgroundColor: '#20D997',
                }}
              />
            </View>
            <Text className="text-[#20D997] text-xs font-bold font-inter-bold">
              {budgetUtilizationPercent}%
            </Text>
          </View>
        </View>

        {/* Total Budget Card */}
        <View className="flex-1 card-surface p-4 rounded-2xl justify-between relative">
          <View className="flex-row items-center justify-between">
            <Text className="text-text-secondary text-xs font-medium font-inter-medium">
              Total Budget
            </Text>
            {/* Calendar Icon Badge */}
            <View className="w-7 h-7 rounded-lg bg-[#152A50] border border-[#263754] items-center justify-center">
              <Calendar size={14} color="#168CFF" />
            </View>
          </View>

          <Text className="text-white text-2xl font-bold font-inter-bold mt-1 mb-2">
            {currencyPrefix}{totalBudget.toLocaleString()}
          </Text>

          {/* Subtle bottom indicator matching left card symmetry */}
          <View className="w-full h-2 bg-[#192743] rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: '100%',
                backgroundColor: '#168CFF',
                opacity: 0.3,
              }}
            />
          </View>
        </View>
      </View>

      {/* 3. Spending by Category Card with Donut Chart */}
      <Pressable
        onPress={onPressCategoryCard}
        className="card-surface p-5 rounded-2xl active:opacity-95 mb-3.5"
        style={{ marginBottom: 14 }}
      >
        <Text className="text-white text-base font-bold font-inter-bold mb-4">
          Spending by Category
        </Text>

        <View className="flex-row items-center justify-between">
          {/* Chart Kit Category Pie Chart */}
          <View className="mr-3 items-center justify-center" style={{ width: 126, height: 126 }}>
            <CategoryPieChart
              data={categoryDonutItems.map((item) => ({
                name: item.name,
                population: item.percentage,
                color: item.color,
                legendFontColor: '#FFFFFF',
              }))}
              width={126}
              height={126}
              hasLegend={false}
              paddingLeft="31"
            />
          </View>

          {/* Category Breakdown Legend */}
          <View className="flex-1">
            {categoryDonutItems.map((item, index) => (
              <View
                key={item.id}
                className="flex-row items-center justify-between py-1"
                style={{
                  marginBottom: index < categoryDonutItems.length - 1 ? 8 : 0,
                }}
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <View
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <Text
                    numberOfLines={1}
                    className="text-white text-xs font-medium font-inter-medium"
                  >
                    {item.name}
                  </Text>
                </View>
                <Text className="text-white text-xs font-bold font-inter-bold">
                  {item.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>

      {/* 4. Financial Insight Card */}
      <Pressable
        onPress={onPressInsight}
        className="card-surface p-4 rounded-2xl flex-row items-center justify-between active:opacity-90 mb-4"
        style={{ marginBottom: 16 }}
      >
        <View className="flex-row items-center flex-1 mr-3">
          {/* Lightbulb Icon in Yellow */}
          <View className="w-10 h-10 rounded-xl bg-[#FFB938]/15 border border-[#FFB938]/30 items-center justify-center mr-3">
            <Lightbulb size={20} color="#FFB938" />
          </View>

          {/* Text Content */}
          <View className="flex-1">
            <Text className="text-white text-sm font-bold font-inter-bold">
              You're on track!
            </Text>
            <Text className="text-text-secondary text-xs font-inter-regular mt-0.5">
              Great job keeping your expenses under control this month.
            </Text>
          </View>
        </View>

        {/* Chevron Arrow */}
        <ChevronRight size={18} color="#168CFF" />
      </Pressable>
    </View>
  );
}
