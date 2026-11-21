import { FinancialTip } from '@/types/budget';

/**
 * Practical, beginner-friendly financial tips specifically tailored for college/university students
 */
export const FINANCIAL_TIPS: FinancialTip[] = [
  {
    id: 'tip-50-30-20',
    title: 'The Student 50/30/20 Rule',
    summary: 'Balance essentials, lifestyle, and a small savings cushion without feeling deprived.',
    content:
      'Divide your monthly income or allowance into three buckets: 50% for fixed essentials (hostel mess, transport, books), 30% for social life and personal outings, and 20% directly into emergency savings or tech gear funds.',
    category: 'budgeting',
    readTimeMinutes: 2,
    icon: 'pie-chart',
    actionableStep: 'Calculate your 20% savings target right now: if your monthly income is PKR 35,000, set aside PKR 7,000 before spending.',
  },
  {
    id: 'tip-campus-mess',
    title: 'Cut 40% on Food by Meal-Pooling',
    summary: 'Eating daily at fast food outlets drains 40% of student pocket money.',
    content:
      'Fast food and restaurant takeout cost 3-4x more than hostel mess or campus meal plans. Pool grocery staples with roommates or keep healthy oats and fruits in your room to prevent expensive late-night takeout orders.',
    category: 'saving',
    readTimeMinutes: 2,
    icon: 'utensils',
    actionableStep: 'Limit fast-food takeout to once a week as a reward for completing study targets.',
  },
  {
    id: 'tip-student-discounts',
    title: 'Unlock Free Student Tech Perks',
    summary: 'Your university .edu.pk email is worth thousands of rupees in discounts.',
    content:
      'Signing up with your official student email gives you free GitHub Student Developer Pack (including free domains, Copilot, Canva Pro, JetBrains IDEs) and 50% off streaming and productivity subscriptions.',
    category: 'smart-spending',
    readTimeMinutes: 3,
    icon: 'badge-percent',
    actionableStep: 'Register your .edu email on GitHub Student Developer Pack and claim free dev tools today.',
  },
  {
    id: 'tip-cash-tracking',
    title: 'Track Small Cash Leaks Immediately',
    summary: 'Chai, biscuits, and photocopies feel cheap, but add up to PKR 5,000+ monthly.',
    content:
      'Because paper cash is spent in small increments (PKR 50-200), students underestimate their cash outflow. Logging your expense on Student Budget Guardian the moment you pay ensures zero mystery missing cash at month-end.',
    category: 'student-life',
    readTimeMinutes: 2,
    icon: 'smartphone',
    actionableStep: 'Open the app right after buying your campus chai and log it in 5 seconds.',
  },
  {
    id: 'tip-used-books',
    title: 'Never Buy First-Hand Semester Books',
    summary: 'Senior students and digital libraries save you thousands of rupees per semester.',
    content:
      'Most university courses only require specific textbook chapters. Buy used copies from previous semester seniors at 60-70% discount, borrow library copies, or use open-source lecture references.',
    category: 'smart-spending',
    readTimeMinutes: 2,
    icon: 'book-open',
    actionableStep: 'Ask a senior batch student for their past semester books and course notes.',
  },
  {
    id: 'tip-emergency-buffer',
    title: 'Build a PKR 10,000 Emergency Buffer',
    summary: 'A small cushion prevents borrowing money when unexpected student expenses strike.',
    content:
      'Whether your phone screen cracks, a laptop charger fails before midterms, or you need emergency travel home, having an untouchable buffer in a digital account (like Sadapay or Nayapay) gives complete peace of mind.',
    category: 'saving',
    readTimeMinutes: 3,
    icon: 'shield-check',
    actionableStep: 'Save PKR 1,000 to 2,000 from each tuition or freelance payout into your emergency goal.',
  },
];
