export interface Person {
  name: string;
  id: string;
}

export interface Item {
  id: string;
  name: string;
  amount: number;
  sharedBy: Person[];
  paidBy: string;
}

export interface Expense {
  id: string;
  name: string;
  date: string;
  people: Person[];
  paidBy?: string;
  items: Item[];
}
