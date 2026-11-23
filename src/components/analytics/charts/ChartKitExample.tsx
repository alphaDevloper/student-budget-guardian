import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import SpendingTrendLineChart from './SpendingTrendLineChart';
import CategoryPieChart from './CategoryPieChart';
import BudgetComparisonBarChart from './BudgetComparisonBarChart';

/**
 * ChartKitExample
 * A simple, beginner-friendly showcase verifying the installation and configuration
 * of React Native Chart Kit with dark-theme styling matching Student Budget Guardian.
 */
export default function ChartKitExample() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headerTitle}>Chart Kit Showcase</Text>
      <Text style={styles.headerSubtitle}>
        Reusable charts for spending trends, categories, and budget comparisons.
      </Text>

      {/* 1. Line Chart: Spending Trends */}
      <View style={styles.card}>
        <SpendingTrendLineChart
          title="Daily Spending Trend (7 Days)"
          currencyPrefix="$"
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [15, 22, 18, 30, 35, 45, 20],
          }}
        />
      </View>

      {/* 2. Pie Chart: Category-wise Spending */}
      <View style={styles.card}>
        <CategoryPieChart
          title="Category-wise Spending Breakdown"
          data={[
            { name: 'Food', population: 40, color: '#FF9F43', legendFontColor: '#FFFFFF' },
            { name: 'Study', population: 20, color: '#FFB938', legendFontColor: '#FFFFFF' },
            { name: 'Transport', population: 15, color: '#20D997', legendFontColor: '#FFFFFF' },
            { name: 'Others', population: 25, color: '#965BFF', legendFontColor: '#FFFFFF' },
          ]}
        />
      </View>

      {/* 3. Bar Chart: Budget Comparisons */}
      <View style={styles.card}>
        <BudgetComparisonBarChart
          title="Category Budget Spending ($)"
          currencyPrefix="$"
          data={{
            labels: ['Food', 'Study', 'Trans.', 'Other'],
            datasets: [{ data: [120, 60, 40, 60] }],
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#8FA0C0',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#0B1B36',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#263754',
    padding: 14,
    marginBottom: 14,
  },
});
