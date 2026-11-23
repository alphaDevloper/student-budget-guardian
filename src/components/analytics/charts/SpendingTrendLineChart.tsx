import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '@/theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface SpendingTrendData {
  labels: string[];
  values: number[];
}

interface SpendingTrendLineChartProps {
  data?: SpendingTrendData;
  width?: number;
  height?: number;
  currencyPrefix?: string;
  bezier?: boolean;
  title?: string;
}

const DEFAULT_DATA: SpendingTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [15, 22, 18, 30, 35, 45, 20],
};

export default function SpendingTrendLineChart({
  data = DEFAULT_DATA,
  width = SCREEN_WIDTH - 40,
  height = 180,
  currencyPrefix = '$',
  bezier = true,
  title,
}: SpendingTrendLineChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        color: (opacity = 1) => `rgba(22, 140, 255, ${opacity})`, // Bright Blue
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#0B1B36',
    backgroundGradientFrom: '#0B1B36',
    backgroundGradientTo: '#111D35',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(22, 140, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(143, 160, 192, ${opacity})`,
    style: {
      borderRadius: 20,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2.5',
      stroke: '#FFFFFF',
      fill: '#168CFF',
    },
    propsForBackgroundLines: {
      stroke: '#192743',
      strokeDasharray: '4',
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <LineChart
        data={chartData}
        width={width}
        height={height}
        yAxisLabel={currencyPrefix}
        chartConfig={chartConfig}
        bezier={bezier}
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
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
