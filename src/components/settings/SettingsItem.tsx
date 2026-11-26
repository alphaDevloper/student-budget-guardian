import { colors } from '@/theme/colors';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

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