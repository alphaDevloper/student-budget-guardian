/**
 * Student Budget Guardian - Currency Utilities
 * Default Currency: PKR (Pakistani Rupee)
 * Conforms to AGENTS.md:
 * - Uses numbers for calculations, formatted strings only for display
 * - Handles negative/zero amounts safely
 */

export interface CurrencyFormatOptions {
  prefix?: string; // Defaults to "Rs. "
  showDecimals?: boolean; // Defaults to false for whole PKR
  compact?: boolean; // Formats 25000 as 25k
  signDisplay?: 'auto' | 'always' | 'never';
}

/**
 * Format a numeric amount into Pakistani Rupee string (e.g. Rs. 25,000)
 */
export const formatCurrency = (
  amount: number,
  options: CurrencyFormatOptions = {}
): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Rs. 0';
  }

  const {
    prefix = 'Rs. ',
    showDecimals = false,
    compact = false,
    signDisplay = 'auto',
  } = options;

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Compact display (e.g. 25.5k)
  if (compact && absAmount >= 1000) {
    let formattedCompact = '';
    if (absAmount >= 100000) {
      formattedCompact = (absAmount / 100000).toFixed(1).replace(/\.0$/, '') + ' Lakh';
    } else {
      formattedCompact = (absAmount / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    const sign = isNegative ? '-' : signDisplay === 'always' ? '+' : '';
    return `${sign}${prefix}${formattedCompact}`;
  }

  // Standard integer locale formatting (comma separated)
  const integerPart = Math.floor(absAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let result = integerPart;
  if (showDecimals) {
    const decimalPart = (absAmount % 1).toFixed(2).substring(2);
    result = `${integerPart}.${decimalPart}`;
  }

  const sign = isNegative ? '-' : signDisplay === 'always' ? '+' : '';
  return `${sign}${prefix}${result}`;
};

/**
 * Convenience helper for standard PKR display (e.g. Rs. 1,500)
 */
export const formatPKR = (amount: number): string => {
  return formatCurrency(amount, { prefix: 'Rs. ' });
};

/**
 * Format transaction amount with explicit +/- sign and PKR prefix
 */
export const formatTransactionAmount = (
  amount: number,
  type: 'expense' | 'income'
): string => {
  const formatted = formatCurrency(Math.abs(amount), { prefix: 'Rs. ' });
  return type === 'expense' ? `-${formatted}` : `+${formatted}`;
};

/**
 * Clean and parse user currency input string to a valid numeric amount
 */
export const parseCurrencyInput = (input: string): number => {
  if (!input) return 0;
  // Remove currency prefixes, commas, and whitespace
  const sanitized = input.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
};
