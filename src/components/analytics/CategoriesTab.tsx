import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '@/theme/colors';

export interface CategoryDetailItem {
  id: string;
  name: string;
  spent: number;
  allocated: number;
  color: string;
}

interface CategoriesTabProps {
  categories: CategoryDetailItem[];
  currencyPrefix?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export default function CategoriesTab({
  categories,
  currencyPrefix = '$',
  onSelectCategory,
}: CategoriesTabProps) {
  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <View>
      {/* Category Summary Header Card */}
      <View
        className="card-surface p-5 rounded-2xl mb-3.5"
        style={{ marginBottom: 14 }}
      >
        <Text className="text-text-secondary text-xs font-medium font-inter-medium">
          Category Budgets Allocation
        </Text>
        <View className="flex-row items-baseline justify-between mt-1 mb-3">
          <Text className="text-white text-2xl font-bold font-inter-bold">
            {currencyPrefix}{totalSpent.toLocaleString()}
            <Text className="text-text-secondary text-sm font-normal">
              {' '}/ {currencyPrefix}{totalAllocated.toLocaleString()}
            </Text>
          </Text>
          <Text className="text-[#20D997] text-xs font-bold font-inter-bold">
            {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}% used
          </Text>
        </View>

        {/* Multi-segment distribution bar */}
        <View className="w-full h-2.5 bg-[#192743] rounded-full overflow-hidden flex-row">
          {categories.map((cat) => {
            const widthPct = totalAllocated > 0 ? (cat.spent / totalAllocated) * 100 : 0;
            return (
              <View
                key={cat.id}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: cat.color,
                }}
              />
            );
          })}
        </View>
      </View>

      {/* Individual Category Cards */}
      <View>
        {categories.map((cat) => {
          const percentUsed =
            cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
          const remaining = Math.max(0, cat.allocated - cat.spent);
          const isOverBudget = cat.spent > cat.allocated;

          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelectCategory?.(cat.id)}
              className="card-surface p-4 rounded-2xl active:opacity-90 mb-3.5"
              style={{ marginBottom: 14 }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View
                    className="w-3 h-3 rounded-full mr-2.5"
                    style={{ backgroundColor: cat.color }}
                  />
                  <Text className="text-white text-sm font-bold font-inter-bold">
                    {cat.name}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="text-white text-sm font-bold font-inter-bold">
                    {currencyPrefix}{cat.spent}
                  </Text>
                  <Text className="text-text-secondary text-xs ml-1 font-inter-regular">
                    / {currencyPrefix}{cat.allocated}
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View className="w-full h-2 bg-[#192743] rounded-full overflow-hidden mb-2">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, percentUsed)}%`,
                    backgroundColor: isOverBudget ? colors.danger : cat.color,
                  }}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-text-secondary text-[11px] font-inter-regular">
                  {isOverBudget
                    ? `Over budget by ${currencyPrefix}${cat.spent - cat.allocated}`
                    : `${currencyPrefix}${remaining} left`}
                </Text>
                <Text
                  className="text-xs font-bold font-inter-bold"
                  style={{ color: isOverBudget ? colors.danger : cat.color }}
                >
                  {percentUsed}%
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
