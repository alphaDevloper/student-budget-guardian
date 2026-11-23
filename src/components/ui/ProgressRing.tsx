import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  centerAmount?: string;
  centerLabel?: string;
  duration?: number;
}

/**
 * Animated Budget Progress Circle
 * Dynamically represents the remaining budget as a percentage of the total budget.
 * Smoothly animates transitions when expenses/budget update, and starts at 12 o'clock clockwise.
 */
export default function ProgressRing({
  size = 78,
  strokeWidth = 6.5,
  progress = 0.4,
  color = '#20D997',
  trackColor = '#071E3D',
  centerAmount = '$320',
  centerLabel = 'Left',
  duration = 650,
}: ProgressRingProps) {
  // Validate and clamp target progress safely between 0 and 1
  const safeProgress = Math.min(1, Math.max(0, isNaN(progress) ? 0 : progress));

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated value for smooth progress transitions
  const animatedValue = useRef(new Animated.Value(safeProgress)).current;
  const [displayProgress, setDisplayProgress] = useState(safeProgress);

  useEffect(() => {
    const listenerId = animatedValue.addListener(({ value }) => {
      setDisplayProgress(Math.min(1, Math.max(0, isNaN(value) ? 0 : value)));
    });

    Animated.timing(animatedValue, {
      toValue: safeProgress,
      duration: duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [safeProgress, duration]);

  // Stroke dashoffset: at progress = 1 -> offset = 0; at progress = 0.5 -> offset = circumference * 0.5; at progress = 0 -> offset = circumference
  const strokeDashoffset = circumference * (1 - displayProgress);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size}>
        {/* Background Track Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress Arc starting at 12 o'clock (-90 deg rotation) */}
        {displayProgress > 0.005 && (
          <G rotation="-90" origin={`${center}, ${center}`}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </G>
        )}
      </Svg>

      {/* Centered Amount & Label */}
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 4,
        }}
        pointerEvents="none"
      >
        {centerAmount ? (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              color: '#FFFFFF',
              fontSize: 13,
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
              fontSize: 9.5,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
              marginTop: 0.5,
            }}
          >
            {centerLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
