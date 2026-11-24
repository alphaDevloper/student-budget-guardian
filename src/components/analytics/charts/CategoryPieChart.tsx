import React from 'react';
import { View, Text, Dimensions, StyleSheet, Animated, Easing } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface CategoryPieItem {
  name: string;
  population: number; // Amount or percentage
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

interface CategoryPieChartProps {
  data?: CategoryPieItem[];
  width?: number;
  height?: number;
  title?: string;
  accessor?: string;
  hasLegend?: boolean;
  paddingLeft?: string;
  center?: [number, number];
}

const DEFAULT_DATA: CategoryPieItem[] = [];

export default function CategoryPieChart({
  data = DEFAULT_DATA,
  width = SCREEN_WIDTH - 40,
  height = 140,
  title,
  accessor = 'population',
  hasLegend = true,
  paddingLeft = '0',
  center,
}: CategoryPieChartProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    fadeAnim.setValue(0.3);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 550,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [data]);

  const hasData = Array.isArray(data) && data.some((d) => (Number(d[accessor as keyof CategoryPieItem]) || 0) > 0);

  if (!hasData) {
    return (
      <View style={[styles.container, { width, height }]}>
        <View
          style={{
            width: Math.min(width, height) - 10,
            height: Math.min(width, height) - 10,
            borderRadius: 999,
            borderWidth: 10,
            borderColor: '#192743',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: '#8FA0C0',
              fontSize: 10,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
            }}
          >
            No data
          </Text>
        </View>
      </View>
    );
  }

  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(143, 160, 192, ${opacity})`,
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <PieChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        accessor={accessor}
        backgroundColor="transparent"
        paddingLeft={paddingLeft}
        center={center}
        hasLegend={hasLegend}
        style={styles.chart}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});
