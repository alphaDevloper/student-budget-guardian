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
  activeTab?: TabKey;
  onTabPress?: (tab: TabKey) => void;
  onPressInsight?: () => void;
}

export default function AnalyticsScreen({
  totalBudget = 800,
  totalSpent = 480,
  remainingAmount = 320,
  currencyPrefix = '$',
  categoryDonutItems = [
    { id: 'food', name: 'Food & Dining', percentage: 40, color: '#FF9F43' },
    { id: 'study', name: 'Books & Study', percentage: 20, color: '#FFB938' },
    { id: 'transport', name: 'Transport', percentage: 15, color: '#20D997' },
    { id: 'others', name: 'Others', percentage: 25, color: '#965BFF' },
  ],
  categoryDetailItems = [
    { id: 'food', name: 'Food & Dining', spent: 192, allocated: 320, color: '#FF9F43' },
    { id: 'study', name: 'Books & Study', spent: 96, allocated: 160, color: '#FFB938' },
    { id: 'transport', name: 'Transport', spent: 72, allocated: 120, color: '#20D997' },
    { id: 'others', name: 'Others', spent: 120, allocated: 200, color: '#965BFF' },
  ],
  dailyAverage = 16,
  budgetUtilizationPercent = 67,
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
