import React from 'react';
import { View, Text } from 'react-native';
import { Utensils, BookOpen, Bus, MoreHorizontal } from 'lucide-react-native';
import AnimatedProgressBar from '@/components/ui/AnimatedProgressBar';
import { colors } from '@/theme/colors';

export interface CategoryBudgetItem {
  id: string;
  name: string;
  spent: number;
  allocated: number;
  color: string;
}

interface CategoryBudgetGridProps {
  categories?: CategoryBudgetItem[];
  currencyPrefix?: string;
}

const DEFAULT_CATEGORIES: CategoryBudgetItem[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    spent: 120,
    allocated: 200,
    color: colors.warning, // #FF9F43
  },
  {
    id: 'study',
    name: 'Books & Study',
    spent: 60,
    allocated: 100,
    color: colors.brightBlue, // #168CFF
  },
  {
    id: 'transport',
    name: 'Transport',
    spent: 40,
    allocated: 80,
    color: colors.success, // #20D997
  },
  {
    id: 'other',
    name: 'Others',
    spent: 60,
    allocated: 120,
    color: colors.purple, // #965BFF
  },
];

function renderCategoryIcon(id: string) {
  switch (id) {
    case 'food':
      return <Utensils size={18} color="#FFFFFF" />;
    case 'study':
      return <BookOpen size={18} color="#FFFFFF" />;
    case 'transport':
      return <Bus size={18} color="#FFFFFF" />;
    case 'other':
    default:
      return <MoreHorizontal size={18} color="#FFFFFF" />;
  }
}

export default function CategoryBudgetGrid({
  categories = DEFAULT_CATEGORIES,
  currencyPrefix = '$',
}: CategoryBudgetGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between my-4">
      {categories.map((item) => {
        const safeAllocated = Math.max(1, item.allocated);
        const percent = Math.round((item.spent / safeAllocated) * 100);

        return (
          <View
            key={item.id}
            style={{
              width: '48%',
              backgroundColor: '#111D35',
              borderColor: '#263754',
              borderWidth: 1,
              borderRadius: 18,
              padding: 14,
              marginBottom: 12,
            }}
          >
            {/* Top row: Icon and Title */}
            <View className="flex-row items-center mb-2.5">
              <View
                className="w-9 h-9 rounded-full items-center justify-center mr-2.5"
                style={{ backgroundColor: item.color }}
              >
                {renderCategoryIcon(item.id)}
              </View>

              <Text
                className="text-white text-xs font-semibold flex-1 leading-4"
                style={{ fontFamily: 'Inter_600SemiBold' }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </View>

            {/* Middle: Spending Ratio */}
            <View className="flex-row items-baseline mb-2">
              <Text
                className="text-white text-base font-bold"
                style={{ fontFamily: 'Inter_700Bold' }}
              >
                {currencyPrefix}
                {item.spent}
              </Text>
              <Text
                className="text-text-secondary text-xs ml-1 font-medium"
                style={{ fontFamily: 'Inter_400Regular' }}
              >
                / {currencyPrefix}
                {item.allocated}
              </Text>
            </View>

            {/* Bottom Row: Micro Progress Bar & Percentage */}
            <View className="flex-row items-center justify-between">
              <AnimatedProgressBar
                percentage={percent}
                height={6}
                color={item.color}
                backgroundColor="#192743"
                style={{ flex: 1, marginRight: 8 }}
              />

              <Text
                className="text-[11px] font-bold"
                style={{ color: item.color, fontFamily: 'Inter_700Bold' }}
              >
                {percent}%
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
