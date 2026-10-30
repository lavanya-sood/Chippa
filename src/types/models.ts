import type { PersonAvatarColor } from "@/foundation/colors";

export interface Person {
  name: string;
  id: string;
  expenses: string[];
  notes?: string;
  avatarColor?: PersonAvatarColor;
  logo?: string | null;
}

export interface Item {
  id: string;
  name: string;
  amount: number;
  quantity: number;
  sharedBy: string[];
  paidBy?: string | null;
}

export interface Expense {
  id: string;
  name: string;
  date: string;
  total: number;
  people: string[];
  paidBy?: string;
  items: Item[];
}

export interface PersonBalance {
  personId: string;
  personName: string;
  paid: number;
  owes: number;
  balance: number;
}

export interface PersonDebt {
  debtorId: string;
  creditorId: string;
  amount: number;
}
