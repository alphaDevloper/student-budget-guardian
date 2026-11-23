import React from 'react';
import { View, Text, Dimensions, StyleSheet, LayoutChangeEvent } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

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
  showAxes?: boolean;
  color?: string;
}

const DEFAULT_DATA: SpendingTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [15, 22, 18, 30, 35, 45, 20],
};

export default function SpendingTrendLineChart({
  data = DEFAULT_DATA,
  width: propWidth,
  height = 140,
  currencyPrefix = '$',
  bezier = true,
  title,
  showAxes = true,
  color = '#168CFF',
}: SpendingTrendLineChartProps) {
  const [layoutWidth, setLayoutWidth] = React.useState<number>(propWidth || SCREEN_WIDTH - 48);

  const onLayout = (e: LayoutChangeEvent) => {
    if (!propWidth) {
      const w = e.nativeEvent.layout.width;
      if (w > 0 && Math.abs(w - layoutWidth) > 2) {
        setLayoutWidth(w);
      }
    }
  };

  const chartWidth = propWidth || layoutWidth;

  const chartData = {
    labels: showAxes ? data.labels : data.labels.map(() => ''),
    datasets: [
      {
        data: data.values,
        color: (opacity = 1) => color,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#0B1B36',
    backgroundGradientTo: '#0B1B36',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalPlaces: 0,
    color: (opacity = 1) => color,
    labelColor: (opacity = 1) => `rgba(143, 160, 192, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: showAxes
      ? {
          r: '4',
          strokeWidth: '2',
          stroke: '#FFFFFF',
          fill: color,
        }
      : {
          r: '0',
        },
    propsForBackgroundLines: {
      stroke: showAxes ? '#192743' : 'transparent',
      strokeDasharray: '4',
      strokeWidth: showAxes ? 1 : 0,
    },
    propsForLabels: {
      fontSize: 10,
      fontFamily: 'Inter_400Regular',
    },
  };

  return (
    <View onLayout={onLayout} style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <LineChart
        data={chartData}
        width={chartWidth}
        height={height}
        yAxisLabel={showAxes ? currencyPrefix : ''}
        yAxisSuffix=""
        chartConfig={chartConfig}
        bezier={bezier}
        style={{
          ...styles.chart,
          ...(!showAxes ? styles.noAxesChart : {}),
        }}
        withInnerLines={showAxes}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={showAxes}
        withVerticalLabels={showAxes}
        withHorizontalLabels={showAxes}
        withDots={showAxes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 16,
    marginLeft: -10,
  },
  noAxesChart: {
    marginLeft: -24,
    marginBottom: -16,
    marginTop: -8,
  },
});
