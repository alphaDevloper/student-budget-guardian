import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleProp, ViewStyle } from 'react-native';

export interface AnimatedProgressBarProps {
  /**
   * Progress value between 0 and 1, or percentage between 0 and 100
   */
  progress?: number;
  percentage?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * High-performance smooth animated progress bar for React Native
 * Automatically transitions to new progress values when budget/expenses change.
 */
export default function AnimatedProgressBar({
  progress,
  percentage,
  height = 8,
  color = '#20D997',
  backgroundColor = '#192743',
  borderRadius = 9999,
  duration = 600,
  style,
}: AnimatedProgressBarProps) {
  // Normalize target value to 0..1 range
  const targetProgress = Math.min(
    1,
    Math.max(
      0,
      progress !== undefined
        ? progress
        : percentage !== undefined
        ? percentage / 100
        : 0
    )
  );

  // Animated value for smooth progress transitions
  const animatedValue = useRef(new Animated.Value(0)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: targetProgress,
      duration: isFirstRender.current ? duration : Math.max(350, duration - 150),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    isFirstRender.current = false;
  }, [targetProgress, duration]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[
        {
          height,
          backgroundColor,
          borderRadius,
          overflow: 'hidden',
          width: '100%',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          height: '100%',
          width: widthInterpolated,
          backgroundColor: color,
          borderRadius,
        }}
      />
    </View>
  );
}
