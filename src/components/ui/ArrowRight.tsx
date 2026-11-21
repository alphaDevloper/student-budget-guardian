import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

interface ArrowRightProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * High-performance vector right arrow that renders reliably on all mobile devices
 * (iOS, Android, and Web) without relying on custom font glyphs or unicode fallback.
 */
export default function ArrowRight({
  size = 16,
  color = "#FFFFFF",
  strokeWidth = 2,
  style,
}: ArrowRightProps) {
  const height = Math.round(size * 0.75);
  const headSize = Math.round(size * 0.45);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: height,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel="Right Arrow"
    >
      {/* Horizontal Stem */}
      <View
        style={[
          styles.stem,
          {
            height: strokeWidth,
            backgroundColor: color,
            borderRadius: strokeWidth / 2,
            right: Math.round(strokeWidth / 2),
          },
        ]}
      />
      {/* 45-degree Angled Arrowhead */}
      <View
        style={[
          styles.head,
          {
            width: headSize,
            height: headSize,
            borderTopWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            borderColor: color,
            right: 1,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  stem: {
    position: "absolute",
    left: 0,
  },
  head: {
    position: "absolute",
    transform: [{ rotate: "45deg" }],
  },
});
