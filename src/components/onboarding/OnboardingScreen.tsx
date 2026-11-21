import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight } from "@/components/ui";

interface OnboardingScreenProps {
  onGetStarted?: () => void;
  onSkip?: () => void;
}

export default function OnboardingScreen({
  onGetStarted,
  onSkip,
}: OnboardingScreenProps) {
  const { height, width } = useWindowDimensions();
  const isSmallScreen = height < 720;
  const isWideScreen = width > 480;
  const [activeSlide, setActiveSlide] = useState(0);

  // Dynamic spacer to position content perfectly below the 3D books & graduation cap
  const heroSpacerHeight = isSmallScreen
    ? Math.round(height * 0.28)
    : Math.round(Math.min(height * 0.33, 270));

  return (
    <SafeAreaView className="flex-1 bg-dark-navy" edges={["top", "bottom"]}>
      {/* Full-bleed background illustration with top wave, 3D graduation cap/books/coin, and bottom luminous wave */}
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        className="items-center justify-center overflow-hidden"
      >
        <Image
          source={require("@/assets/images/onboarding_illustration.png")}
          style={{
            width: isWideScreen ? 420 : "100%",
            height: "100%",
          }}
          resizeMode="cover"
          accessibilityLabel="Onboarding background with graduation cap, books, calculator, coin and luminous waves"
        />
      </View>

      {/* Top Bar with Skip */}
      <View className="px-6 pt-2 pb-1 flex-row items-center justify-end z-10">
        <Pressable
          onPress={onSkip}
          hitSlop={12}
          className="py-1 px-2 rounded-md active:opacity-60"
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text className="text-white text-sm font-medium">Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingBottom: isSmallScreen ? 16 : 24,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="items-center px-6">
          {/* Spacer reserving the upper section for the 3D illustration artwork */}
          <View style={{ height: heroSpacerHeight }} />

          {/* App Title & Subtitle */}
          <View className="items-center mt-1 mb-5">
            <Text
              className="text-[30px] font-bold text-white text-center leading-[36px] tracking-tight"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Student
            </Text>
            <Text
              className="text-[30px] font-bold text-bright-blue text-center leading-[36px] tracking-tight"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              Budget Guardian
            </Text>
            <Text
              className="text-text-secondary text-sm text-center mt-2"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Plan. Track. Stay on Budget.
            </Text>
          </View>

          {/* Three Feature Highlights */}
          <View className="w-full max-w-[340px] space-y-4">
            {/* Feature 1: Spending & Insights */}
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{
                  backgroundColor: "#0C234B",
                  borderWidth: 1,
                  borderColor: "#164483",
                }}
              >
                {/* 3 Progressive Bar Chart Icon */}
                <View className="flex-row items-end h-5 space-x-1">
                  <View
                    className="w-1.5 rounded-full bg-bright-blue"
                    style={{ height: 10 }}
                  />
                  <View
                    className="w-1.5 rounded-full bg-bright-blue"
                    style={{ height: 15 }}
                  />
                  <View
                    className="w-1.5 rounded-full bg-bright-blue"
                    style={{ height: 20 }}
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text
                  className="text-white text-[15px] font-semibold leading-5"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Track Your Spending
                </Text>
                <Text
                  className="text-text-secondary text-[13px] leading-4 mt-0.5"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  with Easy Insights
                </Text>
              </View>
            </View>

            {/* Feature 2: Category Budgets */}
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{
                  backgroundColor: "#0A2D22",
                  borderWidth: 1,
                  borderColor: "#12553E",
                }}
              >
                {/* Shield Checkmark Icon */}
                <View className="w-5 h-6 items-center justify-center">
                  <View
                    className="w-5 h-6 rounded-t-sm rounded-b-xl border-[2px] border-success items-center justify-center"
                    style={{
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}
                  >
                    <Text
                      className="text-success text-[12px] font-bold"
                      style={{ marginTop: -1 }}
                    >
                      ✓
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-1">
                <Text
                  className="text-white text-[15px] font-semibold leading-5"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Set Budgets for Categories
                </Text>
              </View>
            </View>

            {/* Feature 3: Smart Alerts */}
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{
                  backgroundColor: "#351F0E",
                  borderWidth: 1,
                  borderColor: "#613615",
                }}
              >
                {/* Bell Icon */}
                <View className="items-center justify-center">
                  {/* Bell top loop */}
                  <View className="w-1.5 h-1 rounded-t-full bg-warning" />
                  {/* Bell body */}
                  <View
                    className="w-4 h-3.5 bg-warning rounded-t-full"
                    style={{
                      borderBottomLeftRadius: 2,
                      borderBottomRightRadius: 2,
                    }}
                  />
                  {/* Bell rim */}
                  <View className="w-5 h-0.5 bg-warning rounded-full mt-[1px]" />
                  {/* Bell clapper */}
                  <View className="w-1.5 h-1 bg-warning rounded-full mt-[1px]" />
                </View>
              </View>

              <View className="flex-1">
                <Text
                  className="text-white text-[15px] font-semibold leading-5"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Get Smart Alerts & Reminders
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Section: Pagination Dots + Get Started Button */}
        <View className="px-6 mt-6">
          {/* Pagination Dots */}
          <View className="flex-row items-center justify-center mb-5 space-x-2">
            {[0, 1, 2, 3].map((index) => {
              const isActive = index === activeSlide;
              return (
                <Pressable
                  key={index}
                  onPress={() => setActiveSlide(index)}
                  hitSlop={8}
                >
                  <View
                    className={`rounded-full transition-all ${
                      isActive
                        ? "w-5 h-1.5 bg-bright-blue"
                        : "w-1.5 h-1.5 bg-[#17253E]"
                    }`}
                  />
                </Pressable>
              );
            })}
          </View>

          {/* Get Started Button */}
          <Pressable
            onPress={onGetStarted}
            className="w-full bg-bright-blue py-4 rounded-full items-center justify-center flex-row active:opacity-90 shadow-lg shadow-bright-blue/30"
            accessibilityRole="button"
            accessibilityLabel="Get Started with Student Budget Guardian"
          >
            <Text
              className="text-white text-base font-semibold mr-2"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Get Started
            </Text>
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
