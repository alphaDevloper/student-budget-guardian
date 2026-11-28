import { ArrowRight } from "@/components/ui";
import { IMAGES } from "@/constants/images";
import { useSettingsStore } from "@/store";
import { colors } from "@/theme/colors";
import { ChevronLeft, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OnboardingScreenProps {
  onGetStarted?: () => void;
  initialSlide?: number;
}

export default function OnboardingScreen({
  onGetStarted,
  initialSlide = 0,
}: OnboardingScreenProps) {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = height < 720;

  const { profile, updateProfile } = useSettingsStore();

  const [activeSlide, setActiveSlide] = useState(initialSlide);
  const [nameInput, setNameInput] = useState(profile.name || "");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [nameError, setNameError] = useState("");

  const isNameValid = nameInput.trim().length >= 2;

  const slideAnim = useRef(new Animated.Value(-initialSlide * width)).current;

  useEffect(() => {
    if (profile.name && !nameInput) {
      setNameInput(profile.name);
    }
  }, [profile.name]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: -activeSlide * width,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeSlide, width, slideAnim]);

  const goToSlide = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(1, index));
    setActiveSlide(clampedIndex);
  };

  const handleNameChange = (text: string) => {
    setNameInput(text);
    if (nameError) {
      setNameError("");
    }
  };

  const handleContinue = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setNameError("Please enter your full name to continue.");
      return;
    }
    if (trimmedName.length < 2) {
      setNameError("Name must be at least 2 characters long.");
      return;
    }

    updateProfile({ name: trimmedName });
    onGetStarted?.();
  };

  const renderPaginationDots = (currentIndex: number) => (
    <View className="flex-row items-center justify-center mb-5 space-x-2">
      {[0, 1, 2, 3].map((index) => {
        const isActive = index === currentIndex;
        return (
          <Pressable
            key={index}
            onPress={() => {
              if (index <= 1) {
                goToSlide(index);
              }
            }}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Onboarding step ${index + 1}`}
          >
            <View
              className={`rounded-full ${
                isActive
                  ? "w-5 h-1.5 bg-bright-blue"
                  : "w-1.5 h-1.5 bg-[#17253E]"
              }`}
            />
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.darkNavy }}
      edges={["top", "bottom"]}
    >
      {/* Top Bar with Optional Back (Slide 2) */}
      <View className="px-6 pt-2 pb-1 flex-row items-center justify-start z-10 min-h-[34px]">
        {activeSlide === 1 ? (
          <Pressable
            onPress={() => goToSlide(0)}
            hitSlop={12}
            className="py-1 px-1 rounded-full active:opacity-60"
            accessibilityRole="button"
            accessibilityLabel="Back to welcome slide"
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </Pressable>
        ) : null}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, overflow: "hidden" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={{
            flex: 1,
            flexDirection: "row",
            width: width * 2,
            transform: [{ translateX: slideAnim }],
          }}
        >
          {/* SLIDE 1: Welcome & Feature Highlights */}
          <View style={{ width, flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
                paddingBottom: isSmallScreen ? 16 : 24,
              }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View className="items-center px-6">
                {/* 3D Hero Illustration */}
                <View className="items-center justify-center relative w-full my-1">
                  <View
                    className="absolute w-60 h-60 rounded-full"
                    style={{
                      backgroundColor: "rgba(22, 140, 255, 0.12)",
                      transform: [{ scale: 1.15 }],
                    }}
                  />

                  <Image
                    source={IMAGES.onboardingHero}
                    style={{
                      width: isSmallScreen ? 240 : 280,
                      height: isSmallScreen ? 220 : 260,
                    }}
                    resizeMode="contain"
                    accessibilityLabel="Student graduation cap, books, calculator, and gold coin"
                  />
                </View>

                {/* App Title & Subtitle */}
                <View className="items-center mt-2 mb-6">
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
                      <View className="items-center justify-center">
                        <View className="w-1.5 h-1 rounded-t-full bg-warning" />
                        <View
                          className="w-4 h-3.5 bg-warning rounded-t-full"
                          style={{
                            borderBottomLeftRadius: 2,
                            borderBottomRightRadius: 2,
                          }}
                        />
                        <View className="w-5 h-0.5 bg-warning rounded-full mt-[1px]" />
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
              <View className="px-6 mt-8">
                {renderPaginationDots(0)}

                <Pressable
                  onPress={() => goToSlide(1)}
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
          </View>

          {/* SLIDE 2: What's Your Name? */}
          <View style={{ width, flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
                paddingBottom: isSmallScreen ? 16 : 24,
              }}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="items-center px-6 pt-2">
                {/* Graduation & Books Illustration */}
                <View className="items-center justify-center relative w-full my-2">
                  <View
                    className="absolute w-60 h-60 rounded-full"
                    style={{
                      backgroundColor: "rgba(22, 140, 255, 0.14)",
                      transform: [{ scale: 1.1 }],
                    }}
                  />

                  <Image
                    source={IMAGES.onboardingIllustration}
                    style={{
                      width: isSmallScreen ? 230 : 270,
                      height: isSmallScreen ? 200 : 240,
                    }}
                    resizeMode="contain"
                    accessibilityLabel="Graduation cap, books, and student ID badge"
                  />
                </View>

                {/* Heading: What's Your Name? */}
                <View className="items-center mt-4 mb-7">
                  <Text
                    className="text-[28px] font-bold text-white text-center leading-[34px] tracking-tight"
                    style={{ fontFamily: "Inter_700Bold" }}
                  >
                    What’s Your <Text className="text-bright-blue">Name?</Text>
                  </Text>
                  <Text
                    className="text-text-secondary text-sm text-center mt-2.5 leading-5 px-4"
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    Let’s get started! Please enter{"\n"}your name to continue
                  </Text>
                </View>

                {/* Full Name Input Field */}
                <View className="w-full max-w-[360px]">
                  <View
                    className="flex-row items-center rounded-2xl px-4 py-3.5"
                    style={{
                      backgroundColor: "#0B172E",
                      borderWidth: 1.5,
                      borderColor: nameError
                        ? colors.danger
                        : isInputFocused
                          ? colors.brightBlue
                          : "#1E3A6E",
                      shadowColor: isInputFocused ? colors.brightBlue : "#000",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: isInputFocused ? 0.35 : 0,
                      shadowRadius: 8,
                      elevation: isInputFocused ? 4 : 0,
                    }}
                  >
                    <User
                      size={20}
                      color={isInputFocused ? "#FFFFFF" : "#B4C6E7"}
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      value={nameInput}
                      onChangeText={handleNameChange}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="Enter your full name"
                      placeholderTextColor="#5C7194"
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleContinue}
                      className="flex-1 text-white text-[15px] p-0"
                      style={{ fontFamily: "Inter_500Medium" }}
                      accessibilityLabel="Full name input"
                    />
                  </View>

                  {nameError ? (
                    <Text
                      className="text-danger text-xs mt-2 px-1"
                      style={{ fontFamily: "Inter_500Medium" }}
                    >
                      {nameError}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* Bottom Section: Continue Button + Pagination Dots */}
              <View className="px-6 mt-8">
                <Pressable
                  onPress={handleContinue}
                  disabled={!isNameValid}
                  style={{ opacity: isNameValid ? 1 : 0.45 }}
                  className="w-full bg-bright-blue py-4 rounded-full items-center justify-center flex-row mb-5 active:opacity-90 shadow-lg shadow-bright-blue/30"
                  accessibilityRole="button"
                  accessibilityLabel="Continue to next step"
                  accessibilityState={{ disabled: !isNameValid }}
                >
                  <Text
                    className="text-white text-base font-semibold mr-2"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    Continue
                  </Text>
                  <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.2} />
                </Pressable>

                {renderPaginationDots(1)}
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
