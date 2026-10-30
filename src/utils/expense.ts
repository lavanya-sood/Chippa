import type { Expense, PersonDebt } from "@/types/models";

export const getExpenseDebts = (expense: Expense): PersonDebt[] => {
  const debtCentsByPerson = new Map<string, Map<string, number>>();

  for (const item of expense.items) {
    const payerId = item.paidBy === undefined ? expense.paidBy : item.paidBy;
    const sharedBy = [...new Set(item.sharedBy)];
    if (!payerId || sharedBy.length === 0) continue;

    const itemTotalCents = Math.round(item.amount * item.quantity * 100);
    const shareCents = Math.floor(itemTotalCents / sharedBy.length);
    const remainingCents = itemTotalCents % sharedBy.length;

    sharedBy.forEach((debtorId, index) => {
      if (debtorId === payerId) return;

      const amountCents = shareCents + (index < remainingCents ? 1 : 0);
      if (amountCents === 0) return;

      const debtsByCreditor = debtCentsByPerson.get(debtorId) ?? new Map();
      debtsByCreditor.set(
        payerId,
        (debtsByCreditor.get(payerId) ?? 0) + amountCents,
      );
      debtCentsByPerson.set(debtorId, debtsByCreditor);
    });
  }

  return [...debtCentsByPerson].flatMap(([debtorId, debtsByCreditor]) =>
    [...debtsByCreditor].map(([creditorId, amountCents]) => ({
      debtorId,
      creditorId,
      amount: amountCents / 100,
    })),
  );
};

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
