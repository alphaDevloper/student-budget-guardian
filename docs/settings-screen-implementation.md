# Settings Screen Implementation Guide

This guide provides a complete, step-by-step implementation for the **Settings** screen in **Student Budget Guardian**, matching the dark navy design system, NativeWind styling, Zustand state management, and AsyncStorage persistence defined in `AGENTS.md`.

---

## Architecture & File Structure

Create the following files in order. All paths are relative to the project root (`src/`):

```text
src/
├── types/
│   └── settings.ts                    # Step 1: Settings TypeScript interfaces
├── store/
│   ├── settings-store.ts              # Step 2: Zustand store + AsyncStorage persistence
│   └── index.ts                       # Step 2b: Re-export useSettingsStore
├── components/
│   └── settings/
│       ├── SettingsItem.tsx           # Step 3: Reusable row item (icon, text, chevron/switch)
│       ├── ProfileCard.tsx            # Step 4: User avatar, name, role card
│       ├── BudgetGoalsModal.tsx       # Step 5: Modal to edit monthly & category goals
│       ├── ProfileEditModal.tsx       # Step 6: Modal to edit student profile info
│       ├── SettingsScreen.tsx         # Step 7: Complete Settings screen
│       └── index.ts                   # Step 8: Barrel exports
└── app/
    └── index.tsx                      # Step 9: Wire SettingsScreen into the settings tab
```

### Dependencies Used (Already Installed)
- `react-native` (`View`, `Text`, `Pressable`, `ScrollView`, `Switch`, `Modal`, `TextInput`, `Alert`)
- `react-native-safe-area-context` (`SafeAreaView`, `useSafeAreaInsets`)
- `lucide-react-native` (`Settings`, `ChevronRight`, `Target`, `Bell`, `Moon`, `HelpCircle`, `Info`, `LogOut`, `X`, `Check`)
- `expo-constants` (`Constants.expoConfig?.version`)
- `zustand` + `@react-native-async-storage/async-storage` (via existing `safeAsyncStorage`)

No additional packages are required.

---

## Step 1: Settings TypeScript Types

Create `src/types/settings.ts` to define the types for user preferences, appearance mode, and profile data.

**File:** `src/types/settings.ts`

```ts
export type AppearanceMode = 'dark' | 'light';

export interface UserSettingsProfile {
  name: string;
  role: string;
  currencyPrefix: string;
}

export interface SettingsPreferences {
  notificationsEnabled: boolean;
  appearanceMode: AppearanceMode;
  profile: UserSettingsProfile;
}
```

---

## Step 2: Settings Zustand Store with AsyncStorage Persistence

Create `src/store/settings-store.ts` to persist notification preferences, appearance mode, and user profile details using the existing `safeAsyncStorage` adapter.

**File:** `src/store/settings-store.ts`

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeAsyncStorage } from './storage';
import { AppearanceMode, UserSettingsProfile } from '@/types/settings';
import { CURRENT_USER } from '@/constants/user';

export interface SettingsState {
  notificationsEnabled: boolean;
  appearanceMode: AppearanceMode;
  profile: UserSettingsProfile;

  setNotificationsEnabled: (enabled: boolean) => void;
  toggleNotifications: () => void;
  setAppearanceMode: (mode: AppearanceMode) => void;
  toggleAppearanceMode: () => void;
  updateProfile: (updates: Partial<UserSettingsProfile>) => void;
  resetSettingsToDefault: () => void;
}

const DEFAULT_PROFILE: UserSettingsProfile = {
  name: CURRENT_USER.name,
  role: 'Student',
  currencyPrefix: CURRENT_USER.currencyPrefix,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      appearanceMode: 'dark',
      profile: DEFAULT_PROFILE,

      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      toggleNotifications: () =>
        set((state) => ({
          notificationsEnabled: !state.notificationsEnabled,
        })),

      setAppearanceMode: (mode) =>
        set({ appearanceMode: mode }),

      toggleAppearanceMode: () =>
        set((state) => ({
          appearanceMode: state.appearanceMode === 'dark' ? 'light' : 'dark',
        })),

      updateProfile: (updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        })),

      resetSettingsToDefault: () =>
        set({
          notificationsEnabled: true,
          appearanceMode: 'dark',
          profile: DEFAULT_PROFILE,
        }),
    }),
    {
      name: 'student-settings-v2',
      storage: createJSONStorage(() => safeAsyncStorage),
    }
  )
);
```

### Step 2b: Export from Store Barrel

Add the export to `src/store/index.ts`:

**File:** `src/store/index.ts` (add this line alongside the existing exports)

```ts
export * from './settings-store';
```

---

## Step 3: Reusable `SettingsItem` Component

Create `src/components/settings/SettingsItem.tsx` for each row inside grouped settings cards. It supports a tinted circular icon badge, title, subtitle, an optional right-side value label (such as `"Dark"`), a chevron arrow, or a native `Switch` toggle.

**File:** `src/components/settings/SettingsItem.tsx`

```tsx
import React from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface SettingsItemProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  subtitle: string;
  rightText?: string;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  showDivider?: boolean;
}

export default function SettingsItem({
  icon,
  iconBgColor,
  title,
  subtitle,
  rightText,
  showChevron = true,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  showDivider = true,
}: SettingsItemProps) {
  const Container = showSwitch ? View : Pressable;

  return (
    <Container
      {...(!showSwitch && onPress
        ? {
            onPress,
            accessibilityRole: 'button' as const,
            accessibilityLabel: title,
          }
        : {})}
      className={`flex-row items-center justify-between px-4 py-3.5 ${
        !showSwitch ? 'active:bg-[#192743]/70' : ''
      } ${showDivider ? 'border-b border-[#192743]' : ''}`}
    >
      {/* Left: Circular Icon Badge + Title & Subtitle */}
      <View className="flex-row items-center flex-1 pr-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3.5"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </View>

        <View className="flex-1">
          <Text
            className="text-white text-[15px] font-semibold"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            {title}
          </Text>
          <Text
            className="text-text-secondary text-xs mt-0.5"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Right: Optional Text, Switch, or Chevron */}
      <View className="flex-row items-center">
        {rightText ? (
          <Text
            className="text-text-secondary text-sm mr-1.5"
            style={{ fontFamily: 'Inter_500Medium' }}
          >
            {rightText}
          </Text>
        ) : null}

        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#192743', true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#192743"
          />
        ) : showChevron ? (
          <ChevronRight size={18} color={colors.text.secondary} />
        ) : null}
      </View>
    </Container>
  );
}
```

---

## Step 4: `ProfileCard` Component

Create `src/components/settings/ProfileCard.tsx` for the top user profile card with the blue circular initial avatar, student name, role subtitle, and right chevron.

**File:** `src/components/settings/ProfileCard.tsx`

```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface ProfileCardProps {
  name: string;
  role: string;
  onPress: () => void;
}

export default function ProfileCard({
  name,
  role,
  onPress,
}: ProfileCardProps) {
  const initial = name.trim().length > 0 ? name.trim().charAt(0).toUpperCase() : 'S';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Edit profile for ${name}`}
      className="bg-[#0B172E] border border-[#263754] rounded-2xl px-4 py-4 flex-row items-center justify-between mb-4 active:bg-[#111D35]"
    >
      <View className="flex-row items-center flex-1 pr-3">
        {/* Blue Circular Avatar */}
        <View
          className="w-14 h-14 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: colors.primary }}
        >
          <Text
            className="text-white text-2xl font-bold"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            {initial}
          </Text>
        </View>

        {/* Name & Role */}
        <View className="flex-1">
          <Text
            className="text-white text-lg font-bold"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            {name}
          </Text>
          <Text
            className="text-text-secondary text-sm mt-0.5"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            {role}
          </Text>
        </View>
      </View>

      <ChevronRight size={20} color={colors.text.secondary} />
    </Pressable>
  );
}
```

---

## Step 5: `BudgetGoalsModal` Component

Create `src/components/settings/BudgetGoalsModal.tsx` so tapping **Budget Goals** lets the user update their overall monthly budget and individual category spending goals directly in `useBudgetStore`.

**File:** `src/components/settings/BudgetGoalsModal.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { X, Check, Target } from 'lucide-react-native';
import { useBudgetStore } from '@/store';
import { EXPENSE_CATEGORIES } from '@/data/categories';
import { colors } from '@/theme/colors';

interface BudgetGoalsModalProps {
  visible: boolean;
  currencyPrefix: string;
  onClose: () => void;
}

const TRACKED_CATEGORY_IDS = ['food', 'study', 'transport', 'other'];

export default function BudgetGoalsModal({
  visible,
  currencyPrefix,
  onClose,
}: BudgetGoalsModalProps) {
  const { monthlyBudget, setTotalBudget, updateCategoryBudget } = useBudgetStore();

  const [totalInput, setTotalInput] = useState('');
  const [categoryInputs, setCategoryInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) return;

    setTotalInput(
      monthlyBudget.totalBudget > 0 ? String(monthlyBudget.totalBudget) : ''
    );

    const initialCats: Record<string, string> = {};
    TRACKED_CATEGORY_IDS.forEach((catId) => {
      const existing = monthlyBudget.categoryBudgets.find(
        (cb) => cb.categoryId === catId
      );
      initialCats[catId] =
        existing && existing.allocatedAmount > 0
          ? String(existing.allocatedAmount)
          : '';
    });
    setCategoryInputs(initialCats);
  }, [visible, monthlyBudget]);

  const handleSave = () => {
    const parsedTotal = parseFloat(totalInput.replace(/[^0-9.]/g, '')) || 0;
    if (parsedTotal < 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid positive budget amount.');
      return;
    }

    setTotalBudget(parsedTotal);

    TRACKED_CATEGORY_IDS.forEach((catId) => {
      const raw = categoryInputs[catId] || '';
      const parsedCat = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
      updateCategoryBudget(catId, parsedCat);
    });

    onClose();
  };

  const trackedCategories = EXPENSE_CATEGORIES.filter((c) =>
    TRACKED_CATEGORY_IDS.includes(c.id)
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/70"
      >
        <View className="bg-[#0B172E] border-t border-[#263754] rounded-t-3xl px-5 pt-5 pb-8 max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View
                className="w-9 h-9 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.badge.warningBg }}
              >
                <Target size={18} color={colors.warning} />
              </View>
              <Text
                className="text-white text-lg font-bold"
                style={{ fontFamily: 'Inter_700Bold' }}
              >
                Monthly Budget Goals
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-[#111D35] items-center justify-center active:opacity-70"
            >
              <X size={18} color={colors.text.secondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Overall Monthly Budget */}
            <View className="bg-[#111D35] border border-[#263754] rounded-2xl p-4 mb-4">
              <Text className="text-text-secondary text-xs font-medium mb-1.5">
                Total Monthly Limit
              </Text>
              <View className="flex-row items-center">
                <Text className="text-white text-base font-bold mr-1.5">
                  {currencyPrefix}
                </Text>
                <TextInput
                  value={totalInput}
                  onChangeText={(t) => setTotalInput(t.replace(/[^0-9.]/g, ''))}
                  placeholder="0"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="decimal-pad"
                  className="text-white text-base font-bold flex-1 p-0"
                />
              </View>
            </View>

            {/* Category Allocations */}
            <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2.5 px-1">
              Category Limits
            </Text>

            {trackedCategories.map((cat) => (
              <View
                key={cat.id}
                className="bg-[#111D35] border border-[#263754] rounded-2xl p-4 mb-3 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <View
                    className="w-3 h-3 rounded-full mr-2.5"
                    style={{ backgroundColor: cat.color }}
                  />
                  <Text className="text-white text-sm font-semibold">
                    {cat.name}
                  </Text>
                </View>

                <View className="flex-row items-center bg-[#071329] border border-[#263754] rounded-xl px-3 py-2 min-w-[110px]">
                  <Text className="text-text-secondary text-sm font-semibold mr-1">
                    {currencyPrefix}
                  </Text>
                  <TextInput
                    value={categoryInputs[cat.id] || ''}
                    onChangeText={(t) =>
                      setCategoryInputs((prev) => ({
                        ...prev,
                        [cat.id]: t.replace(/[^0-9.]/g, ''),
                      }))
                    }
                    placeholder="0"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="decimal-pad"
                    className="text-white text-sm font-semibold flex-1 p-0 text-right"
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            className="w-full bg-[#087BFF] py-3.5 rounded-full flex-row items-center justify-center mt-3 active:opacity-90"
          >
            <Check size={18} color="#FFFFFF" />
            <Text
              className="text-white text-base font-bold ml-2"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Save Goals
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
```

---

## Step 6: `ProfileEditModal` Component

Create `src/components/settings/ProfileEditModal.tsx` so tapping the profile card lets the user update their display name, role, and currency symbol.

**File:** `src/components/settings/ProfileEditModal.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useSettingsStore } from '@/store';
import { colors } from '@/theme/colors';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileEditModal({
  visible,
  onClose,
}: ProfileEditModalProps) {
  const { profile, updateProfile } = useSettingsStore();

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [currencyPrefix, setCurrencyPrefix] = useState(profile.currencyPrefix);

  useEffect(() => {
    if (visible) {
      setName(profile.name);
      setRole(profile.role);
      setCurrencyPrefix(profile.currencyPrefix);
    }
  }, [visible, profile]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }

    updateProfile({
      name: trimmedName,
      role: role.trim() || 'Student',
      currencyPrefix: currencyPrefix.trim() || '$',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/70"
      >
        <View className="bg-[#0B172E] border-t border-[#263754] rounded-t-3xl px-5 pt-5 pb-8">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <Text
              className="text-white text-lg font-bold"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Edit Profile
            </Text>
            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-[#111D35] items-center justify-center active:opacity-70"
            >
              <X size={18} color={colors.text.secondary} />
            </Pressable>
          </View>

          {/* Name Input */}
          <View className="bg-[#111D35] border border-[#263754] rounded-2xl p-4 mb-3">
            <Text className="text-text-secondary text-xs font-medium mb-1">
              Full Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.text.tertiary}
              className="text-white text-sm font-semibold p-0"
            />
          </View>

          {/* Role Input */}
          <View className="bg-[#111D35] border border-[#263754] rounded-2xl p-4 mb-3">
            <Text className="text-text-secondary text-xs font-medium mb-1">
              Role / Title
            </Text>
            <TextInput
              value={role}
              onChangeText={setRole}
              placeholder="Student"
              placeholderTextColor={colors.text.tertiary}
              className="text-white text-sm font-semibold p-0"
            />
          </View>

          {/* Currency Input */}
          <View className="bg-[#111D35] border border-[#263754] rounded-2xl p-4 mb-5">
            <Text className="text-text-secondary text-xs font-medium mb-1">
              Currency Symbol
            </Text>
            <TextInput
              value={currencyPrefix}
              onChangeText={setCurrencyPrefix}
              placeholder="$"
              maxLength={4}
              placeholderTextColor={colors.text.tertiary}
              className="text-white text-sm font-semibold p-0"
            />
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            className="w-full bg-[#087BFF] py-3.5 rounded-full flex-row items-center justify-center active:opacity-90"
          >
            <Check size={18} color="#FFFFFF" />
            <Text
              className="text-white text-base font-bold ml-2"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Save Profile
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
```

---

## Step 7: Main `SettingsScreen` Component

Create `src/components/settings/SettingsScreen.tsx` bringing together the header, `ProfileCard`, grouped preference cards (`Budget Goals`, `Notifications`, `Appearance`), support card (`Help & Support`, `About App`), the outlined `Log Out` button, and `BottomTabBar`.

**File:** `src/components/settings/SettingsScreen.tsx`

```tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import {
  Settings as SettingsIcon,
  Target,
  Bell,
  Moon,
  HelpCircle,
  Info,
  LogOut,
} from 'lucide-react-native';
import { BottomTabBar } from '@/components/dashboard';
import { TabKey } from '@/components/dashboard/BottomTabBar';
import {
  useSettingsStore,
  useBudgetStore,
  useExpenseStore,
  useIncomeStore,
  useOnboardingStore,
  safeAsyncStorage,
} from '@/store';
import { colors } from '@/theme/colors';
import ProfileCard from './ProfileCard';
import SettingsItem from './SettingsItem';
import BudgetGoalsModal from './BudgetGoalsModal';
import ProfileEditModal from './ProfileEditModal';

interface SettingsScreenProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  onLoggedOut?: () => void;
}

export default function SettingsScreen({
  activeTab,
  onTabPress,
  onLoggedOut,
}: SettingsScreenProps) {
  const insets = useSafeAreaInsets();

  const {
    notificationsEnabled,
    appearanceMode,
    profile,
    toggleNotifications,
    toggleAppearanceMode,
    resetSettingsToDefault,
  } = useSettingsStore();

  const [isBudgetGoalsVisible, setIsBudgetGoalsVisible] = useState(false);
  const [isProfileEditVisible, setIsProfileEditVisible] = useState(false);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const appearanceLabel = appearanceMode === 'dark' ? 'Dark' : 'Light';

  const handleAppearancePress = () => {
    Alert.alert(
      'Appearance',
      'Choose your preferred display theme:',
      [
        {
          text: 'Dark Mode',
          onPress: () => useSettingsStore.getState().setAppearanceMode('dark'),
        },
        {
          text: 'Light Mode',
          onPress: () => useSettingsStore.getState().setAppearanceMode('light'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleHelpAndSupport = () => {
    Alert.alert(
      'Help & Support',
      'Need assistance managing your student budget?\n\n• Tap Budget Goals to adjust monthly or category limits.\n• Tap + on the tab bar to record new expenses.\n• Contact support: support@studentguardian.app',
      [{ text: 'Got it' }]
    );
  };

  const handleAboutApp = () => {
    Alert.alert(
      'About Student Budget Guardian',
      `Version ${appVersion}\n\nA student-friendly personal finance companion built to help you plan, track, and stay on budget every month.`,
      [{ text: 'Close' }]
    );
  };

  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Logging out will clear your local session and reset stored expenses, budgets, and onboarding progress. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            useExpenseStore.getState().resetExpensesToDefault();
            useIncomeStore.getState().resetIncomesToDefault();
            useBudgetStore.getState().resetBudgetToDefault();
            useOnboardingStore.getState().resetOnboarding();
            resetSettingsToDefault();

            try {
              const keys = [
                'student-expense-v2',
                'student-budget-v2',
                'student-income-v2',
                'student-onboarding-v2',
                'student-settings-v2',
              ];
              await Promise.all(keys.map((k) => safeAsyncStorage.removeItem(k)));
            } catch {
              // Storage cleanup fallback
            }

            if (onLoggedOut) {
              onLoggedOut();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.darkNavy }}
      edges={['top']}
    >
      {/* Top Header */}
      <View className="px-5 pt-3 pb-4 flex-row items-center justify-between">
        <Text
          className="text-white text-2xl font-bold"
          style={{ fontFamily: 'Inter_700Bold' }}
        >
          Settings
        </Text>

        <Pressable
          onPress={() => setIsProfileEditVisible(true)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Quick settings"
          className="p-1 active:opacity-70"
        >
          <SettingsIcon size={22} color={colors.text.secondary} />
        </Pressable>
      </View>

      {/* Scrollable Settings Sections */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Profile Card */}
        <ProfileCard
          name={profile.name}
          role={profile.role}
          onPress={() => setIsProfileEditVisible(true)}
        />

        {/* 2. Preferences Group Card */}
        <View className="bg-[#0B172E] border border-[#263754] rounded-2xl overflow-hidden mb-4">
          <SettingsItem
            icon={<Target size={19} color={colors.warning} />}
            iconBgColor={colors.badge.warningBg}
            title="Budget Goals"
            subtitle="Set your monthly goals"
            onPress={() => setIsBudgetGoalsVisible(true)}
          />

          <SettingsItem
            icon={<Bell size={19} color={colors.danger} />}
            iconBgColor={colors.badge.dangerBg}
            title="Notifications"
            subtitle="Manage alerts & reminders"
            showSwitch
            showChevron={false}
            switchValue={notificationsEnabled}
            onSwitchChange={toggleNotifications}
          />

          <SettingsItem
            icon={<Moon size={19} color={colors.brightBlue} />}
            iconBgColor={colors.badge.infoBg}
            title="Appearance"
            subtitle="Light / Dark Mode"
            rightText={appearanceLabel}
            onPress={handleAppearancePress}
            showDivider={false}
          />
        </View>

        {/* 3. Support & App Info Group Card */}
        <View className="bg-[#0B172E] border border-[#263754] rounded-2xl overflow-hidden mb-6">
          <SettingsItem
            icon={<HelpCircle size={19} color={colors.warning} />}
            iconBgColor={colors.badge.warningBg}
            title="Help & Support"
            subtitle="Get help or contact us"
            onPress={handleHelpAndSupport}
          />

          <SettingsItem
            icon={<Info size={19} color={colors.purple} />}
            iconBgColor={colors.badge.purpleBg}
            title="About App"
            subtitle={`Version ${appVersion}`}
            onPress={handleAboutApp}
            showDivider={false}
          />
        </View>

        {/* 4. Log Out Action Button */}
        <Pressable
          onPress={handleLogOut}
          accessibilityRole="button"
          accessibilityLabel="Log Out"
          className="w-full py-3.5 rounded-full flex-row items-center justify-center border border-[#FF5B65]/60 bg-[#FF5B65]/10 active:opacity-80"
        >
          <LogOut size={18} color={colors.danger} />
          <Text
            className="text-[#FF5B65] text-base font-semibold ml-2"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            Log Out
          </Text>
        </Pressable>
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={onTabPress}
        bottomInset={insets.bottom}
      />

      {/* Modals */}
      <BudgetGoalsModal
        visible={isBudgetGoalsVisible}
        currencyPrefix={profile.currencyPrefix}
        onClose={() => setIsBudgetGoalsVisible(false)}
      />

      <ProfileEditModal
        visible={isProfileEditVisible}
        onClose={() => setIsProfileEditVisible(false)}
      />
    </SafeAreaView>
  );
}
```

---

## Step 8: Barrel Export

Create `src/components/settings/index.ts` so `SettingsScreen` and its subcomponents can be cleanly imported.

**File:** `src/components/settings/index.ts`

```ts
export { default as SettingsScreen } from './SettingsScreen';
export { default as SettingsItem } from './SettingsItem';
export { default as ProfileCard } from './ProfileCard';
export { default as BudgetGoalsModal } from './BudgetGoalsModal';
export { default as ProfileEditModal } from './ProfileEditModal';
```

---

## Step 9: Connect `SettingsScreen` in `src/app/index.tsx`

Finally, update `src/app/index.tsx` to import `SettingsScreen` and `useSettingsStore`, use the persisted `currencyPrefix`, and render `SettingsScreen` when `activeTab === 'settings'`.

**File:** `src/app/index.tsx`

1. **Add imports** at the top of `src/app/index.tsx`:

```tsx
import { SettingsScreen } from '@/components/settings';
import { useSettingsStore } from '@/store';
```

2. **Read `profile.currencyPrefix`** inside `Index()` (replacing or falling back from `CURRENT_USER.currencyPrefix`):

```tsx
const { profile } = useSettingsStore();
const currencyPrefix = profile.currencyPrefix || CURRENT_USER.currencyPrefix;
```

3. **Replace the inline `// 5. Settings Tab` return block** at the bottom of `src/app/index.tsx` with:

```tsx
  // 5. Settings Tab
  return (
    <SettingsScreen
      activeTab={activeTab}
      onTabPress={setActiveTab}
      onLoggedOut={() => {
        setIsReplayingOnboarding(false);
        setActiveTab('home');
      }}
    />
  );
```
