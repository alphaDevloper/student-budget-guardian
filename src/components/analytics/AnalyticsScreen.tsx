import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, ChevronDown } from 'lucide-react-native';
import BottomTabBar, { TabKey } from '@/components/dashboard/BottomTabBar';
import OverviewTab from './OverviewTab';
import CategoriesTab, { CategoryDetailItem } from './CategoriesTab';
import TrendsTab from './TrendsTab';
import MonthSelectorModal, { MonthPeriod, PERIOD_LABELS } from './MonthSelectorModal';
import { DonutCategoryItem } from './CategoryDonutChart';
import { colors } from '@/theme/colors';

export type AnalyticsSubTab = 'overview' | 'categories' | 'trends';

interface AnalyticsScreenProps {
  totalBudget?: number;
  totalSpent?: number;
  remainingAmount?: number;
  currencyPrefix?: string;
  categoryDonutItems?: DonutCategoryItem[];
  categoryDetailItems?: CategoryDetailItem[];
  dailyAverage?: number;
  budgetUtilizationPercent?: number;
  spendingTrend?: { labels: string[]; values: number[] };
  spendingTrajectory?: { labels: string[]; values: number[] };
  weeklySpending?: { day: string; amount: number; pct: number }[];
  highestSpendingDay?: string;
  highestSpendingAmount?: number;
  activeTab?: TabKey;
  onTabPress?: (tab: TabKey) => void;
  onPressInsight?: () => void;
}

export default function AnalyticsScreen({
  totalBudget = 0,
  totalSpent = 0,
  remainingAmount = 0,
  currencyPrefix = '$',
  categoryDonutItems = [],
  categoryDetailItems = [],
  dailyAverage = 0,
  budgetUtilizationPercent = 0,
  spendingTrend,
  spendingTrajectory,
  weeklySpending,
  highestSpendingDay = 'None',
  highestSpendingAmount = 0,
  activeTab = 'analytics',
  onTabPress = () => {},
  onPressInsight,
}: AnalyticsScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedSubTab, setSelectedSubTab] = useState<AnalyticsSubTab>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<MonthPeriod>('this_month');
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);

  // Dynamic calculations based on selected period
  const periodMultiplier =
    selectedPeriod === 'last_month'
      ? 1.05
      : selectedPeriod === 'last_3_months'
      ? 3
      : selectedPeriod === 'all_time'
      ? 6
      : 1;

  const currentTotalBudget = Math.round(totalBudget * periodMultiplier);
  const currentTotalSpent = Math.round(totalSpent * periodMultiplier);
  const currentRemaining = Math.max(0, currentTotalBudget - currentTotalSpent);

  const subTabs: { id: AnalyticsSubTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'categories', label: 'Categories' },
    { id: 'trends', label: 'Trends' },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.darkNavy }}
      edges={['top']}
    >
      {/* 1. Header Row: Title & Month Selector Pill */}
      <View className="px-5 pt-2 pb-3 flex-row items-center justify-between">
        <Text className="text-white text-3xl font-bold font-inter-bold">
          Analytics
        </Text>

        {/* Month Selector Pill */}
        <Pressable
          onPress={() => setIsMonthModalVisible(true)}
          className="flex-row items-center px-3.5 py-1.5 rounded-full bg-[#111D35] border border-[#263754] active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Select Month"
        >
          <Calendar size={13} color="#FFFFFF" />
          <Text className="text-white text-xs font-medium font-inter-medium ml-1.5 mr-1">
            {PERIOD_LABELS[selectedPeriod]}
          </Text>
          <ChevronDown size={13} color="#8FA0C0" />
        </Pressable>
      </View>

      {/* 2. Segmented Pill Tabs: Overview / Categories / Trends */}
      <View className="px-5 pb-4">
        <View className="flex-row items-center space-x-2">
          {subTabs.map((tab) => {
            const isActive = selectedSubTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setSelectedSubTab(tab.id)}
                className={`px-5 py-2 rounded-full mr-2 ${
                  isActive
                    ? 'bg-[#087BFF]'
                    : 'bg-transparent active:bg-[#111D35]/50'
                }`}
              >
                <Text
                  className={`text-sm ${
                    isActive
                      ? 'text-white font-bold font-inter-bold'
                      : 'text-text-secondary font-medium font-inter-medium'
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 3. Main Scrollable Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {selectedSubTab === 'overview' && (
          <OverviewTab
            totalBudget={currentTotalBudget}
            totalSpent={currentTotalSpent}
            remainingAmount={currentRemaining}
            currencyPrefix={currencyPrefix}
            categoryDonutItems={categoryDonutItems}
            budgetUtilizationPercent={budgetUtilizationPercent}
            spendingTrend={spendingTrend}
            onPressInsight={onPressInsight}
            onPressCategoryCard={() => setSelectedSubTab('categories')}
          />
        )}

        {selectedSubTab === 'categories' && (
          <CategoriesTab
            categories={categoryDetailItems}
            currencyPrefix={currencyPrefix}
          />
        )}

        {selectedSubTab === 'trends' && (
          <TrendsTab
            totalSpent={currentTotalSpent}
            dailyAverage={dailyAverage}
            currencyPrefix={currencyPrefix}
            highestSpendingDay={highestSpendingDay}
            highestSpendingAmount={highestSpendingAmount}
            weeklySpending={weeklySpending}
            spendingTrajectory={spendingTrajectory}
          />
        )}
      </ScrollView>

      {/* 4. Bottom Tab Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={onTabPress}
        bottomInset={insets.bottom}
      />

      {/* 5. Month Selection Modal */}
      <MonthSelectorModal
        visible={isMonthModalVisible}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        onClose={() => setIsMonthModalVisible(false)}
      />
    </SafeAreaView>
  );
}
