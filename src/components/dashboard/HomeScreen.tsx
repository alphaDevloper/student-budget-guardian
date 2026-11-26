import {
  DEFAULT_GREETING_SUBTITLE,
  formatGreetingTitle,
} from "@/constants/user";
import { IMAGES } from "@/constants/images";
import { useOnboardingStore } from "@/store";
import { colors } from "@/theme/colors";
import { Transaction } from "@/types/budget";
import { Bell, GraduationCap } from "lucide-react-native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import BottomTabBar, { TabKey } from "./BottomTabBar";
import BudgetOverviewCard from "./BudgetOverviewCard";
import CategoryBudgetGrid, { CategoryBudgetItem } from "./CategoryBudgetGrid";
import RecentTransactionsList from "./RecentTransactionsList";

interface HomeScreenProps {
  userName?: string;
  totalBudget?: number;
  totalSpent?: number;
  remainingAmount?: number;
  currencyPrefix?: string;
  categories?: CategoryBudgetItem[];
  transactions?: Transaction[];
  activeTab?: TabKey;
  onTabPress: (tab: TabKey) => void;
  onNotificationPress?: () => void;
  onSeeAllTransactions?: () => void;
  onPressTransaction?: (tx: Transaction) => void;
}

export default function HomeScreen({
  userName,
  totalBudget = 0,
  totalSpent = 0,
  remainingAmount = 0,
  currencyPrefix = "$",
  categories,
  transactions = [],
  activeTab = "home",
  onTabPress,
  onNotificationPress,
  onSeeAllTransactions,
  onPressTransaction,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const storedUserName = useOnboardingStore((state) => state.userName);
  const resolvedName = userName ?? storedUserName;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.darkNavy }}
      edges={["top"]}
    >
      {/* 1. Header Row: Logo & Brand + Notification Bell with Red Dot */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Header */}
        <View className="flex-row items-center flex-1">
          {/* Brand Logo Shield Icon */}
          <View className="w-[42px] h-[42px] mr-3 items-center justify-center">
            <Image
              source={IMAGES.appLogo}
              className="w-16"
              resizeMode="contain"
            />
          </View>

          <View className="justify-center">
            <Text className="text-white text-2xl font-bold font-inter-bold leading-[22px]">
              Student
            </Text>
            <Text className="text-bright-blue text-2xl font-bold font-inter-bold leading-[22px]">
              Budget Guardian
            </Text>
            <Text className="text-text-secondary text-[11px] font-inter-regular mt-0.5">
              Plan • Track • Stay on Budget
            </Text>
          </View>
        </View>

        {/* Notification Bell with Badge */}
        <Pressable
          onPress={onNotificationPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#111D35",
            borderColor: "#263754",
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Bell size={18} color="#FFFFFF" />
          {/* Red Notification Indicator */}
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.danger,
              position: "absolute",
              top: 8,
              right: 8,
              borderColor: colors.darkNavy,
              borderWidth: 1.5,
            }}
          />
        </Pressable>
      </View>

      {/* 2. Main Scrollable Content (Explicit flex: 1 to ensure full height) */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Personalized Greeting with Graduation Cap Watermark */}
        <View
          style={{
            position: "relative",
            paddingTop: 8,
            paddingBottom: 14,
            overflow: "hidden",
          }}
        >
          {/* Subtle Graduation Cap in Background */}
          <View
            style={{
              position: "absolute",
              right: -10,
              top: -6,
              opacity: 0.25,
            }}
            pointerEvents="none"
          >
            <GraduationCap size={100} color={colors.brightBlue} />
          </View>

          <View className="pr-20">
            <Text className="text-white text-[22px] leading-7 font-inter-regular font-bold">
              {formatGreetingTitle(resolvedName)}
            </Text>
            <Text className="text-text-secondary text-xs mt-1 font-inter-regular font-medium">
              {DEFAULT_GREETING_SUBTITLE}
            </Text>
          </View>
        </View>

        {/* 3. Monthly Budget Overview Card with Circular Progress Ring */}
        <BudgetOverviewCard
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          remainingAmount={remainingAmount}
          currencyPrefix={currencyPrefix}
        />

        {/* 4. 2x2 Category Budget Cards */}
        <CategoryBudgetGrid
          categories={categories}
          currencyPrefix={currencyPrefix}
        />

        {/* 5. Recent Transactions List */}
        <RecentTransactionsList
          transactions={transactions}
          currencyPrefix={currencyPrefix}
          onSeeAll={onSeeAllTransactions}
          onPressTransaction={onPressTransaction}
        />
      </ScrollView>

      {/* 6. Bottom Tab Navigation (Pinned at the bottom) */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={onTabPress}
        bottomInset={insets.bottom}
      />
    </SafeAreaView>
  );
}
