import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Check, X } from 'lucide-react-native';

export type MonthPeriod = 'this_month' | 'last_month' | 'last_3_months' | 'all_time';

interface MonthSelectorModalProps {
  visible: boolean;
  selectedPeriod: MonthPeriod;
  onSelectPeriod: (period: MonthPeriod) => void;
  onClose: () => void;
}

export const PERIOD_LABELS: Record<MonthPeriod, string> = {
  this_month: 'This Month',
  last_month: 'Last Month',
  last_3_months: 'Last 3 Months',
  all_time: 'All Time',
};

export default function MonthSelectorModal({
  visible,
  selectedPeriod,
  onSelectPeriod,
  onClose,
}: MonthSelectorModalProps) {
  const options: { id: MonthPeriod; label: string; description: string }[] = [
    {
      id: 'this_month',
      label: 'This Month',
      description: 'Current active month transactions and budget',
    },
    {
      id: 'last_month',
      label: 'Last Month',
      description: 'Previous month spending summary',
    },
    {
      id: 'last_3_months',
      label: 'Last 3 Months',
      description: 'Quarterly financial overview',
    },
    {
      id: 'all_time',
      label: 'All Time',
      description: 'Cumulative spending and budget records',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/60 items-center justify-center px-6"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full card-surface p-5 rounded-3xl border border-[#263754] shadow-2xl"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-[#192743] mb-3">
            <Text className="text-white text-base font-bold font-inter-bold">
              Select Time Period
            </Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#192743] items-center justify-center active:opacity-70"
            >
              <X size={16} color="#8FA0C0" />
            </Pressable>
          </View>

          {/* Options */}
          <View className="space-y-2">
            {options.map((option) => {
              const isSelected = selectedPeriod === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    onSelectPeriod(option.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl flex-row items-center justify-between border ${
                    isSelected
                      ? 'bg-[#168CFF]/15 border-[#168CFF]'
                      : 'bg-[#192743]/50 border-transparent active:bg-[#192743]'
                  }`}
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className={`text-sm font-bold font-inter-bold ${
                        isSelected ? 'text-[#168CFF]' : 'text-white'
                      }`}
                    >
                      {option.label}
                    </Text>
                    <Text className="text-text-secondary text-xs font-inter-regular mt-0.5">
                      {option.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View className="w-6 h-6 rounded-full bg-[#168CFF] items-center justify-center">
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
