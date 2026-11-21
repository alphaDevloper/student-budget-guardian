import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Home, BarChart2, PlusCircle, Settings } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export type TabKey = 'home' | 'analytics' | 'add' | 'settings';

interface BottomTabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  bottomInset?: number;
}

export default function BottomTabBar({
  activeTab = 'home',
  onTabPress,
  bottomInset = 0,
}: BottomTabBarProps) {
  const tabs = [
    {
      key: 'home' as TabKey,
      label: 'Home',
      icon: Home,
    },
    {
      key: 'analytics' as TabKey,
      label: 'Analytics',
      icon: BarChart2,
    },
    {
      key: 'add' as TabKey,
      label: 'Add Expense',
      icon: PlusCircle,
    },
    {
      key: 'settings' as TabKey,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <View
      className="border-t border-[#192743] bg-[#071329] pt-2"
      style={{
        paddingBottom: Math.max(bottomInset, Platform.OS === 'ios' ? 16 : 8),
      }}
    >
      <View className="flex-row items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComponent = tab.icon;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              className="items-center justify-center py-1 px-3 active:opacity-70"
            >
              {/* Active Tab Glow/Pill */}
              <View
                className={`items-center justify-center rounded-2xl ${
                  isActive ? 'bg-[#0D2A54] px-4 py-1.5' : 'py-1.5'
                }`}
              >
                <IconComponent
                  size={20}
                  color={isActive ? colors.brightBlue : colors.text.secondary}
                />
              </View>

              <Text
                className={`text-[10px] mt-1 font-medium ${
                  isActive ? 'text-bright-blue font-semibold' : 'text-text-secondary'
                }`}
                style={{
                  fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_500Medium',
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
