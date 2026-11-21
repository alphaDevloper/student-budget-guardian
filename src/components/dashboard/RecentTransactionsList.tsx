import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ArrowRight, Utensils, BookOpen, Bus, MoreHorizontal } from 'lucide-react-native';
import { Transaction } from '@/types/budget';
import { colors } from '@/theme/colors';
import { formatTransactionDate } from '@/utils/date';

interface RecentTransactionsListProps {
  transactions?: Transaction[];
  currencyPrefix?: string;
  onSeeAll?: () => void;
  onPressTransaction?: (tx: Transaction) => void;
}

const DEFAULT_TRANSACTIONS: Partial<Transaction>[] = [
  {
    id: 'tx-burger-king',
    title: 'Burger King',
    amount: 8.99,
    type: 'expense',
    categoryId: 'food',
    date: new Date().toISOString(),
    note: 'Food & Dining • Today, 7:30 PM',
  },
  {
    id: 'tx-book-store',
    title: 'Book Store',
    amount: 24.50,
    type: 'expense',
    categoryId: 'study',
    date: new Date(Date.now() - 86400000).toISOString(),
    note: 'Books & Study • Yesterday, 5:20 PM',
  },
  {
    id: 'tx-bus-fare',
    title: 'Bus Fare',
    amount: 1.50,
    type: 'expense',
    categoryId: 'transport',
    date: new Date(Date.now() - 90000000).toISOString(),
    note: 'Transport • Yesterday, 3:15 PM',
  },
];

export default function RecentTransactionsList({
  transactions,
  currencyPrefix = '$',
  onSeeAll,
  onPressTransaction,
}: RecentTransactionsListProps) {
  const displayList =
    transactions && transactions.length > 0 ? transactions : DEFAULT_TRANSACTIONS;

  const renderTransactionIcon = (title: string, categoryId?: string) => {
    const t = title.toLowerCase();
    if (t.includes('burger') || t.includes('king') || t.includes('food') || categoryId === 'food') {
      return (
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-[#FF9F43]/20 border border-[#FF9F43]/30">
          <Utensils size={18} color="#FF9F43" />
        </View>
      );
    }
    if (t.includes('book') || t.includes('study') || categoryId === 'study') {
      return (
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-[#168CFF]/20 border border-[#168CFF]/30">
          <BookOpen size={18} color="#168CFF" />
        </View>
      );
    }
    if (t.includes('bus') || t.includes('fare') || t.includes('transport') || categoryId === 'transport') {
      return (
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-[#20D997]/20 border border-[#20D997]/30">
          <Bus size={18} color="#20D997" />
        </View>
      );
    }
    return (
      <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-[#965BFF]/20 border border-[#965BFF]/30">
        <MoreHorizontal size={18} color="#965BFF" />
      </View>
    );
  };

  return (
    <View className="my-2">
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text
          className="text-white text-base font-bold"
          style={{ fontFamily: 'Inter_700Bold' }}
        >
          Recent Transactions
        </Text>

        <Pressable
          onPress={onSeeAll}
          className="flex-row items-center active:opacity-70"
          hitSlop={8}
        >
          <Text
            className="text-bright-blue text-xs font-semibold mr-1"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            See All
          </Text>
          <ArrowRight size={13} color={colors.brightBlue} />
        </Pressable>
      </View>

      {/* Transaction Items Container */}
      <View
        style={{
          backgroundColor: '#111D35',
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderColor: '#263754',
          borderWidth: 1,
          marginBottom: 16,
        }}
      >
        {displayList.slice(0, 5).map((tx, index) => {
          const isExpense = tx.type !== 'income';
          const subtitle =
            tx.note && tx.note.includes('•')
              ? tx.note
              : `${tx.categoryId || 'General'} • ${formatTransactionDate(tx.date || '')}`;

          return (
            <Pressable
              key={tx.id || index}
              onPress={() => onPressTransaction?.(tx as Transaction)}
              className="flex-row items-center justify-between py-3 border-b border-border/40 last:border-0 active:opacity-80"
            >
              {/* Left Side: Icon & Title/Subtitle */}
              <View className="flex-row items-center flex-1 mr-3">
                {renderTransactionIcon(tx.title || '', tx.categoryId)}

                <View className="flex-1">
                  <Text
                    className="text-white text-sm font-semibold leading-5"
                    style={{ fontFamily: 'Inter_600SemiBold' }}
                    numberOfLines={1}
                  >
                    {tx.title}
                  </Text>
                  <Text
                    className="text-text-secondary text-[11px] mt-0.5"
                    style={{ fontFamily: 'Inter_400Regular' }}
                    numberOfLines={1}
                  >
                    {subtitle}
                  </Text>
                </View>
              </View>

              {/* Right Side: Amount */}
              <Text
                className={`text-sm font-bold ${
                  isExpense ? 'text-danger' : 'text-success'
                }`}
                style={{ fontFamily: 'Inter_700Bold' }}
              >
                {isExpense ? '-' : '+'}
                {currencyPrefix}
                {Number(tx.amount || 0).toFixed(2)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
