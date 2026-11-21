import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";

export default function Index() {
  const [pressedBtn, setPressedBtn] = useState(false);
  const [toggleActive, setToggleActive] = useState(true);
  const [checkboxActive, setCheckboxActive] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const palette = [
    { name: "Primary", hex: "#087BFF", bg: colors.primary },
    { name: "Bright Blue", hex: "#168CFF", bg: colors.brightBlue },
    { name: "Deep Blue", hex: "#0645A8", bg: colors.deepBlue },
    { name: "Navy", hex: "#071329", bg: colors.navy },
    { name: "Dark Navy", hex: "#050D1C", bg: colors.darkNavy },
    { name: "Surface", hex: "#111D35", bg: colors.surface },
    { name: "Surface Elevated", hex: "#192743", bg: colors.surfaceElevated },
    { name: "Border", hex: "#263754", bg: colors.border },
    { name: "Success", hex: "#20D997", bg: colors.success },
    { name: "Warning", hex: "#FF9F43", bg: colors.warning },
    { name: "Danger", hex: "#FF5B65", bg: colors.danger },
    { name: "Purple", hex: "#965BFF", bg: colors.purple },
  ];

  const typographyScale = [
    { label: "Display", size: "32px", weight: "Bold", sample: "Inter Display", cls: "text-display" },
    { label: "Heading 1", size: "26px", weight: "Bold", sample: "Inter Heading 1", cls: "text-h1" },
    { label: "Heading 2", size: "22px", weight: "SemiBold", sample: "Inter Heading 2", cls: "text-h2" },
    { label: "Heading 3", size: "18px", weight: "SemiBold", sample: "Inter Heading 3", cls: "text-h3" },
    { label: "Body Large", size: "16px", weight: "Regular", sample: "Inter Body Large", cls: "text-body-lg" },
    { label: "Body", size: "14px", weight: "Regular", sample: "Inter Body Regular", cls: "text-body" },
    { label: "Body Small", size: "12px", weight: "Regular", sample: "Inter Body Small", cls: "text-body-sm" },
    { label: "Caption", size: "11px", weight: "Medium", sample: "Inter Caption", cls: "text-caption" },
    { label: "Button", size: "15px", weight: "SemiBold", sample: "Inter Button", cls: "text-button" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-navy" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Brand */}
        <View className="pt-4 pb-6 flex-row items-center justify-between border-b border-border">
          <View className="flex-1">
            <View className="flex-row items-baseline">
              <Text className="text-h1 text-white font-bold">Student </Text>
              <Text className="text-h1 text-bright-blue font-bold">Budget Guardian</Text>
            </View>
            <Text className="text-caption text-text-secondary mt-1">
              Plan • Track • Stay on Budget
            </Text>
          </View>
          <View className="bg-primary/20 px-3 py-1.5 rounded-full border border-primary/40">
            <Text className="text-caption text-bright-blue font-semibold">Version 1.0</Text>
          </View>
        </View>

        {/* Section: Color Palette */}
        <View className="mt-6">
          <Text className="text-h2 text-white font-bold mb-1">Color Palette</Text>
          <Text className="text-body-sm text-text-secondary mb-4">
            Official 12-color system tokenized across NativeWind and TypeScript
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {palette.map((item) => (
              <View
                key={item.hex}
                className="w-[30%] mb-3 p-2 rounded-md bg-surface border border-border items-center"
              >
                <View
                  className="w-10 h-10 rounded-sm mb-2 border border-border"
                  style={{ backgroundColor: item.bg }}
                />
                <Text
                  className="text-caption text-white font-semibold text-center"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text className="text-[10px] text-text-secondary mt-0.5">{item.hex}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section: Typography (Inter) */}
        <View className="mt-6 p-4 rounded-lg bg-surface border border-border">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-h2 text-white font-bold">Aa Typography</Text>
            <Text className="text-caption text-bright-blue font-semibold">Inter Family</Text>
          </View>
          <Text className="text-caption text-text-secondary mb-4">Modern • Clean • Readable</Text>

          <View className="space-y-3">
            {typographyScale.map((t) => (
              <View
                key={t.label}
                className="flex-row items-center justify-between py-2 border-b border-border/40"
              >
                <View className="w-28">
                  <Text className="text-body-sm text-text-secondary font-medium">{t.label}</Text>
                  <Text className="text-[10px] text-text-disabled">{t.size} {t.weight}</Text>
                </View>
                <Text className={`flex-1 text-white ${t.cls}`} numberOfLines={1}>
                  {t.sample}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section: Spacing & Radius */}
        <View className="mt-6 flex-row space-x-3">
          {/* Spacing card */}
          <View className="flex-1 p-4 rounded-lg bg-surface border border-border">
            <Text className="text-h3 text-white font-bold mb-3">Spacing</Text>
            {[
              { k: "XS", v: "4px" },
              { k: "SM", v: "8px" },
              { k: "MD", v: "12px" },
              { k: "LG", v: "16px" },
              { k: "XL", v: "20px" },
              { k: "2XL", v: "24px" },
              { k: "3XL", v: "32px" },
              { k: "4XL", v: "40px" },
              { k: "5XL", v: "48px" },
            ].map((s) => (
              <View key={s.k} className="flex-row justify-between py-0.5">
                <Text className="text-body-sm text-text-secondary">{s.k}</Text>
                <Text className="text-body-sm text-white font-medium">{s.v}</Text>
              </View>
            ))}
          </View>

          {/* Radius card */}
          <View className="flex-1 p-4 rounded-lg bg-surface border border-border">
            <Text className="text-h3 text-white font-bold mb-3">Radius</Text>
            {[
              { k: "SM", v: "10px" },
              { k: "MD", v: "14px" },
              { k: "LG", v: "20px" },
              { k: "XL", v: "24px" },
              { k: "Full", v: "9999px" },
            ].map((r) => (
              <View key={r.k} className="flex-row justify-between py-1">
                <Text className="text-body-sm text-text-secondary">{r.k}</Text>
                <Text className="text-body-sm text-white font-medium">{r.v}</Text>
              </View>
            ))}
            <View className="mt-4 pt-3 border-t border-border">
              <Text className="text-caption text-text-secondary mb-2">Category Colors</Text>
              <View className="flex-row justify-between">
                <View className="w-6 h-6 rounded-full bg-cat-food items-center justify-center">
                  <Text className="text-[10px] text-white">🍔</Text>
                </View>
                <View className="w-6 h-6 rounded-full bg-cat-study items-center justify-center">
                  <Text className="text-[10px] text-white">📚</Text>
                </View>
                <View className="w-6 h-6 rounded-full bg-cat-transport items-center justify-center">
                  <Text className="text-[10px] text-white">🚌</Text>
                </View>
                <View className="w-6 h-6 rounded-full bg-cat-other items-center justify-center">
                  <Text className="text-[10px] text-white">⚡</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Section: Buttons */}
        <View className="mt-6">
          <Text className="text-h2 text-white font-bold mb-3">Buttons</Text>
          <View className="space-y-3">
            {/* Primary Button */}
            <Pressable
              className="btn-primary flex-row items-center justify-center active:opacity-90"
              onPress={() => setPressedBtn(!pressedBtn)}
            >
              <Text className="text-button text-white">Primary Button →</Text>
            </Pressable>

            {/* Secondary Button */}
            <Pressable className="btn-secondary active:opacity-90">
              <Text className="text-button text-white">Secondary Button</Text>
            </Pressable>

            {/* Ghost Button */}
            <Pressable className="btn-ghost active:opacity-90">
              <Text className="text-button text-white">Ghost Button</Text>
            </Pressable>

            {/* Destructive Button */}
            <Pressable className="btn-destructive active:opacity-90">
              <Text className="text-button text-danger">Destructive Button</Text>
            </Pressable>

            {/* Icon & Pressed & Disabled row */}
            <View className="flex-row space-x-3 mt-1">
              <Pressable className="flex-1 bg-surface-elevated py-3 rounded-md border border-border items-center justify-center flex-row">
                <Text className="text-bright-blue font-bold mr-1">+</Text>
                <Text className="text-body-sm text-white font-semibold">Icon Button</Text>
              </Pressable>

              <Pressable className="flex-1 bg-bright-blue py-3 rounded-md items-center justify-center">
                <Text className="text-body-sm text-white font-semibold">Pressed</Text>
              </Pressable>

              <View className="flex-1 btn-disabled py-3">
                <Text className="text-body-sm text-text-disabled font-semibold">Disabled</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section: Cards from Design System */}
        <View className="mt-8">
          <Text className="text-h2 text-white font-bold mb-3">Cards & Widgets</Text>

          {/* Monthly Budget Card */}
          <View className="card-surface p-5 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-caption text-text-secondary uppercase tracking-wider">
                  Total Monthly Budget
                </Text>
                <View className="flex-row items-baseline mt-1">
                  <Text className="text-display text-white font-bold">$800</Text>
                  <View className="ml-2 bg-surface-elevated px-2 py-0.5 rounded-sm border border-border">
                    <Text className="text-[10px] text-text-secondary">This Month ▾</Text>
                  </View>
                </View>
              </View>

              {/* Progress Ring badge */}
              <View className="w-16 h-16 rounded-full border-4 border-success items-center justify-center bg-surface-elevated">
                <Text className="text-h3 text-white font-bold">$320</Text>
                <Text className="text-[9px] text-success font-semibold">Left</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View className="w-full h-2.5 bg-surface-elevated rounded-full overflow-hidden mb-3">
              <View className="h-full bg-success rounded-full" style={{ width: "60%" }} />
            </View>

            <View className="flex-row justify-between">
              <Text className="text-caption text-text-secondary">$480 Spent</Text>
              <Text className="text-caption text-success font-semibold">$320 Left</Text>
            </View>
          </View>

          {/* Food & Dining Category Card */}
          <View className="card-surface p-4 flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-md bg-warning/20 border border-warning/40 items-center justify-center mr-3">
                <Text className="text-xl">🍴</Text>
              </View>
              <View className="flex-1">
                <Text className="text-body text-white font-semibold">Food & Dining</Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-h3 text-white font-bold mr-1">$120</Text>
                  <Text className="text-caption text-text-secondary">/ $200</Text>
                </View>
                {/* Micro progress bar */}
                <View className="w-32 h-1.5 bg-surface-elevated rounded-full overflow-hidden mt-1.5">
                  <View className="h-full bg-warning rounded-full" style={{ width: "60%" }} />
                </View>
              </View>
            </View>
            <Text className="text-h3 text-warning font-bold">60%</Text>
          </View>
        </View>

        {/* Section: Input Fields */}
        <View className="mt-6">
          <Text className="text-h2 text-white font-bold mb-3">Input Fields</Text>

          <View className="space-y-3">
            <View>
              <Text className="text-caption text-text-secondary mb-1.5 font-medium">Name</Text>
              <TextInput
                className="input-field"
                placeholder="Enter your name"
                placeholderTextColor={colors.text.disabled}
                value={nameInput}
                onChangeText={setNameInput}
              />
            </View>

            <View>
              <Text className="text-caption text-text-secondary mb-1.5 font-medium">Email</Text>
              <TextInput
                className="input-field"
                placeholder="you@example.com"
                placeholderTextColor={colors.text.disabled}
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-caption text-text-secondary mb-1.5 font-medium">Phone</Text>
              <TextInput
                className="input-field"
                placeholder="+1 (555) 123-4567"
                placeholderTextColor={colors.text.disabled}
                value={phoneInput}
                onChangeText={setPhoneInput}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Section: Status Badges & Toggles */}
        <View className="mt-8">
          <Text className="text-h2 text-white font-bold mb-3">Status Badges & Controls</Text>

          {/* Badges */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="badge-success flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-success mr-1.5" />
              <Text className="text-caption text-success font-semibold">Success</Text>
            </View>

            <View className="badge-warning flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-warning mr-1.5" />
              <Text className="text-caption text-warning font-semibold">Warning</Text>
            </View>

            <View className="badge-danger flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-danger mr-1.5" />
              <Text className="text-caption text-danger font-semibold">Error</Text>
            </View>

            <View className="badge-info flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-bright-blue mr-1.5" />
              <Text className="text-caption text-bright-blue font-semibold">Info</Text>
            </View>
          </View>

          {/* Toggles */}
          <View className="card-surface p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => setToggleActive(!toggleActive)}
                className={`w-12 h-7 rounded-full p-1 justify-center ${
                  toggleActive ? "bg-bright-blue items-end" : "bg-surface-elevated items-start"
                }`}
              >
                <View className="w-5 h-5 rounded-full bg-white" />
              </Pressable>
              <Text className="text-body-sm text-white ml-3 font-medium">
                {toggleActive ? "Active Toggle" : "Inactive Toggle"}
              </Text>
            </View>

            <Pressable
              onPress={() => setCheckboxActive(!checkboxActive)}
              className="flex-row items-center"
            >
              <View
                className={`w-5 h-5 rounded-sm items-center justify-center border ${
                  checkboxActive ? "bg-bright-blue border-bright-blue" : "border-border bg-surface"
                }`}
              >
                {checkboxActive && <Text className="text-white text-xs font-bold">✓</Text>}
              </View>
              <Text className="text-body-sm text-text-secondary ml-2">Checkbox</Text>
            </Pressable>
          </View>
        </View>

        {/* Section: Transactions preview */}
        <View className="mt-8">
          <Text className="text-h2 text-white font-bold mb-3">Recent Transactions</Text>
          <View className="card-surface p-4 space-y-3">
            {[
              {
                title: "Burger King",
                sub: "Food & Dining • Today, 7:30 PM",
                amt: "-$8.99",
                icon: "🍔",
                bg: "bg-warning/20",
                border: "border-warning/30",
              },
              {
                title: "Book Store",
                sub: "Books & Study • Yesterday, 5:20 PM",
                amt: "-$24.50",
                icon: "📚",
                bg: "bg-bright-blue/20",
                border: "border-bright-blue/30",
              },
              {
                title: "Bus Fare",
                sub: "Transport • Yesterday, 3:15 PM",
                amt: "-$1.50",
                icon: "🚌",
                bg: "bg-success/20",
                border: "border-success/30",
              },
            ].map((tx) => (
              <View
                key={tx.title}
                className="flex-row items-center justify-between py-2 border-b border-border/30 last:border-0"
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-10 h-10 rounded-md ${tx.bg} border ${tx.border} items-center justify-center mr-3`}
                  >
                    <Text className="text-base">{tx.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-body text-white font-semibold">{tx.title}</Text>
                    <Text className="text-caption text-text-secondary">{tx.sub}</Text>
                  </View>
                </View>
                <Text className="text-body text-danger font-bold">{tx.amt}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
