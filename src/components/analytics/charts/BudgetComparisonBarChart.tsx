import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface BudgetBarData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

interface BudgetComparisonBarChartProps {
  data?: BudgetBarData;
  width?: number;
  height?: number;
  currencyPrefix?: string;
  title?: string;
}

const DEFAULT_DATA: BudgetBarData = {
  labels: ['Food', 'Study', 'Trans.', 'Other'],
  datasets: [
    {
      data: [120, 60, 40, 60],
    },
  ],
};

export default function BudgetComparisonBarChart({
  data = DEFAULT_DATA,
  width = SCREEN_WIDTH - 40,
  height = 190,
  currencyPrefix = '$',
  title,
}: BudgetComparisonBarChartProps) {
  const chartConfig = {
    backgroundColor: '#0B1B36',
    backgroundGradientFrom: '#0B1B36',
    backgroundGradientTo: '#111D35',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(32, 217, 151, ${opacity})`, // Green bars (#20D997)
    labelColor: (opacity = 1) => `rgba(143, 160, 192, ${opacity})`,
    style: {
      borderRadius: 20,
    },
    propsForBackgroundLines: {
      stroke: '#192743',
      strokeDasharray: '4',
      strokeWidth: 1,
    },
    barPercentage: 0.65,
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <BarChart
        data={data}
        width={width}
        height={height}
        yAxisLabel={currencyPrefix}
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars={true}
        withInnerLines={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 20,
    marginVertical: 4,
  },
});
