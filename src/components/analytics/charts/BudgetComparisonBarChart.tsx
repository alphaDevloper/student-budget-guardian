import React from 'react';
import { View, Text, Dimensions, StyleSheet, LayoutChangeEvent } from 'react-native';
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
  width: propWidth,
  height = 180,
  currencyPrefix = '$',
  title,
}: BudgetComparisonBarChartProps) {
  const [layoutWidth, setLayoutWidth] = React.useState<number>(propWidth || SCREEN_WIDTH - 72);

  const onLayout = (e: LayoutChangeEvent) => {
    if (!propWidth) {
      const w = e.nativeEvent.layout.width;
      if (w > 0 && Math.abs(w - layoutWidth) > 2) {
        setLayoutWidth(w);
      }
    }
  };

  const chartWidth = propWidth || layoutWidth;

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#0B1B36',
    backgroundGradientTo: '#111D35',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(32, 217, 151, ${opacity})`, // Green bars (#20D997)
    labelColor: (opacity = 1) => `rgba(143, 160, 192, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      stroke: '#192743',
      strokeDasharray: '4',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 10,
      fontFamily: 'Inter_400Regular',
    },
    barPercentage: 0.55,
  };

  return (
    <View onLayout={onLayout} style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <BarChart
        data={data}
        width={chartWidth}
        height={height}
        yAxisLabel={currencyPrefix}
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars={true}
        withInnerLines={true}
        fromZero={true}
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
    marginLeft: -12,
  },
});
