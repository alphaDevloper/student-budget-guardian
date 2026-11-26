import { BottomTabBar } from '@/components/dashboard';
import { TabKey } from '@/components/dashboard/BottomTabBar';
import {
    safeAsyncStorage,
    useBudgetStore,
    useExpenseStore,
    useIncomeStore,
    useOnboardingStore,
    useSettingsStore,
} from '@/store';
import { colors } from '@/theme/colors';
import Constants from 'expo-constants';
import {
    Bell,
    HelpCircle,
    Info,
    LogOut,
    Moon,
    Settings as SettingsIcon,
    Target,
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BudgetGoalsModal from './BudgetGoalsModal';
import ProfileCard from './ProfileCard';
import ProfileEditModal from './ProfileEditModal';
import SettingsItem from './SettingsItem';

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