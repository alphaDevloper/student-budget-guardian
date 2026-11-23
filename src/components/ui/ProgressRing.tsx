import React from 'react';
import { View, Text } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  centerAmount?: string;
  centerLabel?: string;
}

/**
 * High-performance circular progress ring built with React Native Chart Kit
 */
export default function ProgressRing({
  size = 80,
  strokeWidth = 7,
  progress = 0.6,
  color = '#20D997',
  trackColor = '#10284A',
  centerAmount = '$320',
  centerLabel = 'Left',
}: ProgressRingProps) {
  const safeProgress = Math.min(1, Math.max(0, isNaN(progress) ? 0 : progress));

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#0A2552',
    backgroundGradientTo: '#0A2552',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => color,
    strokeWidth: strokeWidth,
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ProgressChart
        data={[safeProgress]}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        radius={(size - strokeWidth * 2) / 2}
        chartConfig={chartConfig}
        hideLegend={true}
        style={{
          paddingRight: 0,
          paddingTop: 0,
        }}
      />

      {/* Centered Amount & Label */}
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {centerAmount ? (
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '700',
              fontFamily: 'Inter_700Bold',
              textAlign: 'center',
            }}
          >
            {centerAmount}
          </Text>
        ) : null}
        {centerLabel ? (
          <Text
            style={{
              color: '#8FA0C0',
              fontSize: 10,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
              marginTop: 1,
            }}
          >
            {centerLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
