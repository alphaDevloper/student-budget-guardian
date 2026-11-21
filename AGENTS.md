# AGENTS.md

You are an expert React Native + Expo engineer helping build a production-quality Student Budget Guardian mobile application.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction because this project is also intended to teach developers how to build a real-world mobile application feature by feature.

Think like a senior mobile developer, but explain and implement like someone building a practical learning project.

---

## Project Overview

We are building a modern personal finance and expense-tracking mobile application called **Student Budget Guardian** using Expo and React Native.

The application helps students manage their monthly budgets, track expenses, understand their spending habits, and develop better financial management skills.

The application includes features such as:

- Monthly budget overview.
- Total budget and remaining balance.
- Expense tracking.
- Income tracking.
- Category-based budgets (Food, Transport, Education, Shopping, Entertainment, etc.).
- Add, edit, and delete expenses.
- Spending history.
- Monthly expense analytics.
- Category-wise spending breakdown.
- Budget progress indicators.
- Financial summaries and insights.
- User settings and preferences.

The goal is to build a practical, modern, and easy-to-use budgeting application with a beautiful mobile-first interface.

This is primarily a learning project. Build features incrementally while keeping the code understandable, maintainable, and suitable for future improvements.

---

## Tech Stack

Use the following technology stack:

- **Expo** – React Native development environment.
- **React Native** – Mobile application framework.
- **TypeScript** – Type safety and maintainable code.
- **NativeWind** – Tailwind CSS-style styling for React Native.
- **Zustand** – Global application state management.
- **AsyncStorage** – Local data persistence.
- **Lucide React Native** – Icons and interface elements.
- **Expo Vector Icons** – Only when an existing project dependency requires them.

Do not introduce new major libraries unless there is a strong reason.

Before adding a new dependency, inspect the existing project and check whether the feature can be implemented using the installed libraries.

---

## Development Philosophy

Build the application feature by feature.

For every feature:

1. Understand the user's requirements.
2. Read this AGENTS.md file before making changes.
3. Inspect the existing project structure and related components.
4. Reuse existing components and utilities whenever possible.
5. Keep the implementation simple.
6. Avoid unnecessary abstractions and overengineering.
7. Prefer readable code over clever code.
8. Build the smallest useful implementation first.
9. Refactor only when repetition or complexity makes it necessary.
10. Preserve existing functionality when implementing new features.

This project should feel like a real production application while remaining approachable for developers who are learning React Native.

---

## Decision Making & Clarifications

If something is unclear or could be improved:

- Proactively suggest better approaches.
- Explain important technical decisions.
- Prefer existing dependencies over installing new ones.
- If a new library would significantly simplify or improve implementation:
  - Recommend the library.
  - Explain why it is useful.
  - Ask for permission before installing or using it.

Do not install new dependencies without user approval.

Do not make major architectural decisions without considering their impact on the existing application.

---

## Architecture Guidelines

Follow the existing project structure whenever possible.

Do not restructure the entire project unless explicitly requested or technically necessary.

Use the following structure as a guideline when creating new files:

```text
app/
  (tabs)/
    index.tsx
    analytics.tsx
    history.tsx
    settings.tsx
  _layout.tsx

components/
  ui/
  dashboard/
  expenses/
  analytics/
  budget/

store/
  budget-store.ts
  expense-store.ts

types/
  index.ts

constants/
  categories.ts
  colors.ts

utils/
  currency.ts
  date.ts
  calculations.ts

assets/
  images/
  icons/
```

Important:

- Adapt this structure to the existing project.
- Do not create duplicate folders or files.
- Keep components organized by feature.
- Keep reusable UI components inside `components/ui`.
- Keep Zustand stores inside `store`.
- Keep TypeScript interfaces and types inside `types`.
- Keep reusable calculations and formatting functions inside `utils`.
- Keep static configuration and category definitions inside `constants`.

---

## React Native & Expo Guidelines

- Use functional components.
- Use React hooks appropriately.
- Use TypeScript for components, functions, and data models.
- Prefer React Native components such as `View`, `Text`, `ScrollView`, `Pressable`, `TextInput`, and `FlatList`.
- Use `SafeAreaView` or the project's existing safe-area implementation where appropriate.
- Use `FlatList` for long lists instead of rendering large arrays inside `ScrollView`.
- Avoid unnecessary nested components.
- Keep components small and focused.
- Avoid unnecessary `useEffect`, `useMemo`, and `useCallback`.
- Do not use browser-specific HTML elements.
- Do not use CSS files for styling.

---

## Styling Guidelines

Use NativeWind and Tailwind utility classes for styling.

Examples:

```tsx
<View className="flex-1 bg-white px-5">
  <Text className="text-2xl font-bold text-gray-900">Monthly Budget</Text>
</View>
```

Rules:

- Prefer NativeWind classes over inline styles.
- Use inline styles only when dynamic styling requires them or NativeWind cannot reasonably handle the requirement.
- Maintain consistent spacing, typography, and border radius.
- Reuse existing design tokens and colors.
- Make layouts responsive across different mobile screen sizes.
- Ensure content does not overflow horizontally.
- Respect device safe areas.
- Keep touch targets comfortable for mobile users.
- Maintain visual consistency across all screens.

Do not introduce a new design system or change existing styling conventions without permission.

---

## State Management

Use Zustand for global application state.

Separate application state logically based on features.

For example:

- Budget store: Monthly budget and budget settings.
- Expense store: Expense records and expense operations.
- Income store: Income records when needed.

Rules:

- Keep stores simple and understandable.
- Avoid putting unrelated application logic inside one store.
- Use actions for adding, updating, and deleting records.
- Avoid unnecessary global state.
- Use local component state for temporary UI interactions such as modal visibility, form inputs, and selected filters.
- Keep calculations reusable and outside UI components whenever possible.

Do not introduce another state management library.

---

## Data Persistence

Use AsyncStorage for local data persistence.

The application should preserve user data when the application is closed and reopened.

Rules:

- Persist important budget, income, and expense information.
- Keep storage operations organized and reusable.
- Handle missing or invalid stored data safely.
- Use appropriate default values when no data exists.
- Avoid repeatedly reading and writing the same data unnecessarily.
- Keep storage logic separate from UI components.
- Ensure data updates remain consistent between Zustand stores and AsyncStorage.

Do not assume that data exists in storage.

Use TypeScript types to maintain consistent data structures.

---

## Financial Data & Calculations

Financial calculations are an important part of this application.

Keep calculations accurate, reusable, and independent of UI components.

Examples:

- Total monthly income.
- Total monthly expenses.
- Remaining budget.
- Category-wise spending.
- Budget utilization percentage.
- Daily average spending.
- Monthly spending comparisons.

Important rules:

1. Use numbers for financial calculations, not formatted currency strings.
2. Format currency only when displaying values.
3. Avoid floating-point precision issues when performing financial calculations.
4. Prefer storing monetary values as integer minor units (for example, paisa) when practical.
5. Never calculate financial summaries separately in multiple components.
6. Use reusable functions inside `utils/calculations.ts`.
7. Handle zero values and empty expense lists safely.
8. Validate financial inputs before saving them.
9. Avoid negative or invalid amounts unless the feature explicitly supports them.

Example:

```ts
export const calculateRemainingBudget = (budget: number, expenses: number) => {
  return budget - expenses;
};
```

Keep financial calculations easy to test and understand.

---

## Expense Management

Every expense should follow a consistent data structure.

Example:

```ts
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  createdAt: string;
}
```

Rules:

- Generate unique IDs for expenses.
- Validate expense amounts.
- Require a valid title, amount, category, and date.
- Support adding, editing, and deleting expenses.
- Keep expense operations inside the appropriate Zustand store.
- Do not duplicate expense records.
- Preserve existing expense data when updating a record.
- Handle empty and loading states appropriately.

---

## Budget Categories

Use centralized category definitions.

Examples:

- Food
- Transport
- Education
- Shopping
- Entertainment
- Health
- Bills
- Other

Rules:

- Keep category definitions inside `constants/categories.ts`.
- Avoid hardcoding category names in multiple components.
- Reuse category information across expense forms, dashboard cards, and analytics.
- Make it easy to introduce new categories in the future.

---

## UI & User Experience

The application should provide a clean, modern, student-friendly experience.

Prioritize:

- Clear financial information.
- Easy expense entry.
- Readable budget summaries.
- Simple navigation.
- Useful spending insights.
- Consistent layouts.
- Accessible text and touch targets.
- Appropriate empty states.
- Clear validation and error messages.

Financial information should be easy to understand at a glance.

Do not sacrifice usability for unnecessary visual effects or animations.

---

## Code Quality

Follow these conventions:

- Use descriptive variable and function names.
- Use TypeScript interfaces or types for application data.
- Avoid `any` unless absolutely necessary.
- Avoid duplicated code.
- Keep business logic separate from UI.
- Prefer default exports for screen and component files.
- Use named exports for shared utility functions and constants.
- Keep imports organized.
- Remove unused imports and variables.
- Avoid unnecessary comments.
- Add comments only when logic is not immediately obvious.

Do not introduce complex patterns when a simple function or component is sufficient.

---

## Important Restrictions

- Do not install additional packages without permission.
- Do not replace the existing technology stack.
- Do not introduce a backend or cloud database unless explicitly requested.
- Do not introduce authentication unless requested.
- Do not change the existing navigation architecture without permission.
- Do not rewrite working components unnecessarily.
- Do not remove existing features while implementing new ones.
- Do not use mock data when actual persisted application data is expected.
- Do not put financial calculations directly inside complex JSX expressions.
- Do not use browser-specific APIs in React Native.
- Do not overengineer simple features.

---

## Development Workflow

Before implementing a feature:

1. Read AGENTS.md.
2. Inspect the existing files related to the feature.
3. Understand the current implementation.
4. Identify which components, stores, types, and utilities need changes.
5. Explain the implementation approach briefly when appropriate.
6. Implement the feature using the existing architecture.
7. Check TypeScript errors.
8. Verify that existing features still work.
9. Keep the implementation focused on the requested feature.

When fixing bugs:

- Identify the root cause first.
- Avoid unnecessary code changes.
- Fix the actual problem rather than adding workarounds.
- Preserve the existing UI and functionality unless changes are requested.

---

## Final Principle

Build Student Budget Guardian as a real, maintainable mobile application.

Prioritize simplicity, accuracy, readability, and a consistent user experience.

Every implementation should be understandable to a developer learning Expo and React Native.

**Think like a senior engineer. Build like a practical teacher. Keep the code simple.**
