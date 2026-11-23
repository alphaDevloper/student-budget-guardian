Read AGENTS.md first and follow it strictly.

Implement the Add Expense screen UI exactly as shown in the attached design with spacing, structure, and layout neatly matched. Include the header with back navigation, expense illustration with a plus icon, title and subtitle, category selector, amount input, date picker, optional note field, and Add Expense button. Match the dark navy background, blue accents, typography, input cards, icons, border radius, and overall layout.

Connect the form to the existing Zustand expense store with AsyncStorage persistence. Use categories from `data/categories.ts`, validate the expense amount and required fields, and save the new expense with its category, amount, date, and optional note. After successfully adding an expense, update the budget summaries and recent transactions automatically.

Use existing assets from the assets folder via the centralized images import. Use Lucide React Native icons for interface elements where appropriate. If any image is missing, use a suitable placeholder from Unsplash or Picsum.
