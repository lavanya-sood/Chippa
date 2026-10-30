import type { Expense } from "@/types/models";

export const getExpensesForPerson = (
  expenses: Expense[],
  personId: string,
): Expense[] =>
  expenses
    .filter(
      (expense) =>
        expense.people.includes(personId) ||
        expense.items.some((item) => item.sharedBy.includes(personId)),
    )
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime(),
    );

export const getPersonExpenseShare = (
  expense: Expense,
  personId: string,
): number => {
  let shareCents = 0;

  for (const item of expense.items) {
    const sharedBy = [...new Set(item.sharedBy)];
    const personIndex = sharedBy.indexOf(personId);
    if (personIndex === -1) continue;

    const itemTotalCents = Math.round(item.amount * item.quantity * 100);
    const individualShareCents = Math.floor(itemTotalCents / sharedBy.length);
    const remainingCents = itemTotalCents % sharedBy.length;
    shareCents +=
      individualShareCents + (personIndex < remainingCents ? 1 : 0);
  }

  return shareCents / 100;
};
