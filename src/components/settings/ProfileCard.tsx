import { colors } from '@/theme/colors';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

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