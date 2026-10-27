export interface Person {
  name: string;
  id: string;
  expenses: string[];
}

export interface Item {
  id: string;
  name: string;
  amount: number;
  sharedBy: string[];
  paidBy: string;
}

export interface Expense {
  id: string;
  name: string;
  date: string;
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
