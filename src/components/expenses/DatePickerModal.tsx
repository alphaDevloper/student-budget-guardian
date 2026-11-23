import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Check, X, Calendar } from 'lucide-react-native';

interface DatePickerModalProps {
  visible: boolean;
  selectedDate: string;
  onSelectDate: (displayDate: string, isoDate: string) => void;
  onClose: () => void;
}

export function formatExpenseDisplayDate(dateObj: Date = new Date()): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
}

export default function DatePickerModal({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}: DatePickerModalProps) {
  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const dateOptions = [
    {
      label: `Today, ${formatExpenseDisplayDate(today)}`,
      isoDate: today.toISOString(),
      displayDate: `Today, ${formatExpenseDisplayDate(today)}`,
    },
    {
      label: `Yesterday, ${formatExpenseDisplayDate(yesterday)}`,
      isoDate: yesterday.toISOString(),
      displayDate: `Yesterday, ${formatExpenseDisplayDate(yesterday)}`,
    },
    {
      label: formatExpenseDisplayDate(twoDaysAgo),
      isoDate: twoDaysAgo.toISOString(),
      displayDate: formatExpenseDisplayDate(twoDaysAgo),
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
            <View className="flex-row items-center">
              <Calendar size={18} color="#168CFF" />
              <Text className="text-white text-base font-bold font-inter-bold ml-2">
                Select Date
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#192743] items-center justify-center active:opacity-70"
            >
              <X size={16} color="#8FA0C0" />
            </Pressable>
          </View>

          {/* Date Options */}
          <View className="space-y-2">
            {dateOptions.map((opt) => {
              const isSelected = selectedDate === opt.displayDate;
              return (
                <Pressable
                  key={opt.isoDate}
                  onPress={() => {
                    onSelectDate(opt.displayDate, opt.isoDate);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl flex-row items-center justify-between border mb-2 ${
                    isSelected
                      ? 'bg-[#168CFF]/15 border-[#168CFF]'
                      : 'bg-[#192743]/50 border-transparent active:bg-[#192743]'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold font-inter-semibold ${
                      isSelected ? 'text-[#168CFF]' : 'text-white'
                    }`}
                  >
                    {opt.label}
                  </Text>
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
