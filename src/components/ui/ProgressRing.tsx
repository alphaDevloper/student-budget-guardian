import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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
 * High-performance circular SVG progress ring matching Design System v1.0
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
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Math.min(1, Math.max(0, isNaN(progress) ? 0 : progress));
  const strokeDashoffset = circumference - safeProgress * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Active Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {/* Centered Amount & Label */}
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          className="text-white text-base font-bold"
          style={{ fontFamily: 'Inter_700Bold' }}
        >
          {centerAmount}
        </Text>
        <Text
          className="text-text-secondary text-[11px] font-medium"
          style={{ fontFamily: 'Inter_500Medium' }}
        >
          {centerLabel}
        </Text>
      </View>
    </View>
  );
}
