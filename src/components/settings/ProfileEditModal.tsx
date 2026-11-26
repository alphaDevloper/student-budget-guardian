import { useSettingsStore } from '@/store';
import { colors } from '@/theme/colors';
import { Check, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

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