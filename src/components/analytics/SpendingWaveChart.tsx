import React from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

interface SpendingWaveChartProps {
  height?: number;
  color?: string;
  gradientStartOpacity?: number;
}

export default function SpendingWaveChart({
  height = 80,
  color = '#168CFF',
  gradientStartOpacity = 0.35,
}: SpendingWaveChartProps) {
  const [width, setWidth] = React.useState(300);

  const onLayout = (event: LayoutChangeEvent) => {
    const layoutWidth = event.nativeEvent.layout.width;
    if (layoutWidth > 0 && layoutWidth !== width) {
      setWidth(layoutWidth);
    }
  };

  // Generate smooth cubic bezier wave path matching design
  // Peaks and valleys with right-side ascending to end marker
  const w = Math.max(100, width);
  const h = height;

  // Normalized coordinate points across width
  const p0 = { x: 0, y: h * 0.75 };
  const cp1a = { x: w * 0.12, y: h * 0.72 };
  const cp1b = { x: w * 0.20, y: h * 0.40 };
  const p1 = { x: w * 0.28, y: h * 0.48 };

  const cp2a = { x: w * 0.36, y: h * 0.55 };
  const cp2b = { x: w * 0.44, y: h * 0.25 };
  const p2 = { x: w * 0.52, y: h * 0.32 };

  const cp3a = { x: w * 0.60, y: h * 0.40 };
  const cp3b = { x: w * 0.68, y: h * 0.15 };
  const p3 = { x: w * 0.76, y: h * 0.22 };

  const cp4a = { x: w * 0.84, y: h * 0.30 };
  const cp4b = { x: w * 0.92, y: h * 0.10 };
  const pEnd = { x: w - 8, y: h * 0.18 };

  const linePath = `
    M ${p0.x} ${p0.y}
    C ${cp1a.x} ${cp1a.y}, ${cp1b.x} ${cp1b.y}, ${p1.x} ${p1.y}
    C ${cp2a.x} ${cp2a.y}, ${cp2b.x} ${cp2b.y}, ${p2.x} ${p2.y}
    C ${cp3a.x} ${cp3a.y}, ${cp3b.x} ${cp3b.y}, ${p3.x} ${p3.y}
    C ${cp4a.x} ${cp4a.y}, ${cp4b.x} ${cp4b.y}, ${pEnd.x} ${pEnd.y}
  `;

  const areaPath = `
    ${linePath}
    L ${w} ${h}
    L 0 ${h}
    Z
  `;

  return (
    <View onLayout={onLayout} className="w-full overflow-hidden" style={{ height }}>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="spendingWaveGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={gradientStartOpacity} />
            <Stop offset="70%" stopColor={color} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </LinearGradient>
        </Defs>

        {/* Shaded Area Under Curve */}
        <Path d={areaPath} fill="url(#spendingWaveGradient)" />

        {/* Smooth Curved Line */}
        <Path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glow Ring & White Center Dot at endpoint */}
        <Circle
          cx={pEnd.x}
          cy={pEnd.y}
          r={7}
          fill="#0B1B36"
          stroke={color}
          strokeWidth={2.5}
        />
        <Circle
          cx={pEnd.x}
          cy={pEnd.y}
          r={3.5}
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
}
