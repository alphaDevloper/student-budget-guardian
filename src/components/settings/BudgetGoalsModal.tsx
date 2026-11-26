import { EXPENSE_CATEGORIES } from '@/data/categories';
import { useBudgetStore } from '@/store';
import { colors } from '@/theme/colors';
import { Check, Target, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

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