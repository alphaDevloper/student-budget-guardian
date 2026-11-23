import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, Text as SvgText, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Plus } from 'lucide-react-native';

interface ExpenseReceiptIllustrationProps {
  size?: number;
}

export default function ExpenseReceiptIllustration({ size = 110 }: ExpenseReceiptIllustrationProps) {
  const width = size;
  const height = size * 1.05;

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={width} height={height} viewBox="0 0 110 116" fill="none">
        <Defs>
          {/* Subtle background glow */}
          <LinearGradient id="receiptGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#168CFF" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#0B1B36" stopOpacity="0" />
          </LinearGradient>
          {/* Paper gradient */}
          <LinearGradient id="paperGrad" x1="0" y1="0" x2="0.2" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#E2EAF8" />
          </LinearGradient>
        </Defs>

        {/* Halo Glow behind receipt */}
        <Circle cx="55" cy="55" r="48" fill="url(#receiptGlow)" />

        {/* Receipt Paper Body with Jagged Bottom */}
        <G transform="rotate(-3 50 55)">
          {/* Paper with rounded top corners and zigzag bottom */}
          <Path
            d="
              M 22 16
              C 22 10, 26 6, 32 6
              L 78 6
              C 84 6, 88 10, 88 16
              L 88 88
              L 82 83
              L 76 88
              L 70 83
              L 64 88
              L 58 83
              L 52 88
              L 46 83
              L 40 88
              L 34 83
              L 28 88
              L 22 83
              Z
            "
            fill="url(#paperGrad)"
            stroke="#CBD5E1"
            strokeWidth="0.75"
          />

          {/* "$ $" Currency symbols on receipt */}
          <SvgText
            x="32"
            y="28"
            fill="#168CFF"
            fontSize="15"
            fontWeight="bold"
            fontFamily="System"
          >
            $ $
          </SvgText>

          {/* Receipt Top Header Dashed Lines */}
          <Rect x="64" y="19" width="16" height="3" rx="1.5" fill="#8FA0C0" opacity="0.6" />
          <Rect x="64" y="25" width="12" height="3" rx="1.5" fill="#8FA0C0" opacity="0.4" />

          {/* Divider Line */}
          <Path d="M 28 35 L 82 35" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 2" />

          {/* Line Items */}
          <Rect x="28" y="42" width="34" height="4" rx="2" fill="#8FA0C0" opacity="0.5" />
          <Rect x="68" y="42" width="14" height="4" rx="2" fill="#8FA0C0" opacity="0.7" />

          <Rect x="28" y="51" width="26" height="4" rx="2" fill="#8FA0C0" opacity="0.5" />
          <Rect x="72" y="51" width="10" height="4" rx="2" fill="#8FA0C0" opacity="0.7" />

          <Rect x="28" y="60" width="38" height="4" rx="2" fill="#8FA0C0" opacity="0.4" />
          <Rect x="70" y="60" width="12" height="4" rx="2" fill="#8FA0C0" opacity="0.7" />

          {/* Total Line */}
          <Rect x="28" y="70" width="22" height="5" rx="2.5" fill="#168CFF" opacity="0.7" />
        </G>
      </Svg>

      {/* Floating Bright Blue Plus Badge */}
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          right: 14,
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: '#087BFF',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: '#050D1C',
          shadowColor: '#087BFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Plus size={20} color="#FFFFFF" strokeWidth={3.5} />
      </View>
    </View>
  );
}
