import React from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { Check, X, Utensils, BookOpen, Bus, Wifi, Film, HeartPulse, User, ShoppingBag, MoreHorizontal } from 'lucide-react-native';
import { EXPENSE_CATEGORIES } from '@/data/categories';
import { Category } from '@/types/budget';

interface CategoryPickerModalProps {
  visible: boolean;
  selectedCategoryId: string;
  onSelectCategory: (category: Category) => void;
  onClose: () => void;
}

function getCategoryIcon(iconName: string, color: string) {
  const size = 18;
  switch (iconName) {
    case 'utensils':
      return <Utensils size={size} color={color} />;
    case 'book-open':
      return <BookOpen size={size} color={color} />;
    case 'bus':
      return <Bus size={size} color={color} />;
    case 'wifi':
      return <Wifi size={size} color={color} />;
    case 'film':
      return <Film size={size} color={color} />;
    case 'heart-pulse':
      return <HeartPulse size={size} color={color} />;
    case 'user':
      return <User size={size} color={color} />;
    case 'shopping-bag':
      return <ShoppingBag size={size} color={color} />;
    default:
      return <MoreHorizontal size={size} color={color} />;
  }
}

export default function CategoryPickerModal({
  visible,
  selectedCategoryId,
  onSelectCategory,
  onClose,
}: CategoryPickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/60 items-center justify-center px-5"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full max-h-[80%] card-surface p-5 rounded-3xl border border-[#263754] shadow-2xl"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-[#192743] mb-3">
            <Text className="text-white text-base font-bold font-inter-bold">
              Select Category
            </Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#192743] items-center justify-center active:opacity-70"
            >
              <X size={16} color="#8FA0C0" />
            </Pressable>
          </View>

          {/* Categories List */}
          <ScrollView showsVerticalScrollIndicator={false} className="space-y-2">
            {EXPENSE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl flex-row items-center justify-between border mb-2 ${
                    isSelected
                      ? 'bg-[#168CFF]/15 border-[#168CFF]'
                      : 'bg-[#192743]/50 border-transparent active:bg-[#192743]'
                  }`}
                >
                  <View className="flex-row items-center flex-1 mr-2">
                    <View
                      className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: `${cat.color}20`, borderColor: `${cat.color}40`, borderWidth: 1 }}
                    >
                      {getCategoryIcon(cat.icon, cat.color)}
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`text-sm font-semibold font-inter-semibold ${
                          isSelected ? 'text-[#168CFF]' : 'text-white'
                        }`}
                      >
                        {cat.name}
                      </Text>
                      {cat.description ? (
                        <Text
                          numberOfLines={1}
                          className="text-text-secondary text-[11px] font-inter-regular mt-0.5"
                        >
                          {cat.description}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {isSelected && (
                    <View className="w-6 h-6 rounded-full bg-[#168CFF] items-center justify-center">
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
