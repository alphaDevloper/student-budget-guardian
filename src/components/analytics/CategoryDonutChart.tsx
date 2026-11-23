import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export interface DonutCategoryItem {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

interface CategoryDonutChartProps {
  items: DonutCategoryItem[];
  size?: number;
  strokeWidth?: number;
}

export default function CategoryDonutChart({
  items,
  size = 124,
  strokeWidth = 16,
}: CategoryDonutChartProps) {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Filter items with percentage > 0
  const validItems = items.filter((item) => item.percentage > 0);
  const totalPercentage = validItems.reduce((acc, item) => acc + item.percentage, 0) || 100;

  // Gap between segments in SVG stroke units
  const gap = validItems.length > 1 ? 2.5 : 0;

  let currentOffset = 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Base background ring */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#192743"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Category Segments */}
          {validItems.map((item) => {
            const normalizedRatio = item.percentage / totalPercentage;
            const segmentLength = Math.max(0, normalizedRatio * circumference - gap);
            const offset = currentOffset;
            currentOffset += normalizedRatio * circumference;

            return (
              <Circle
                key={item.id}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                fill="transparent"
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
}
