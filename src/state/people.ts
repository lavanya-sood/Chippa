import { create } from "zustand";
import { Person } from "../types/index";

interface PeopleStore {
  people: Person[];
  addPerson: (person: Person) => void;
  removePerson: (personId: string) => void;
}

const usePeopleStore = create<PeopleStore>((set) => ({
  people: [],
  addPerson: (newPerson) =>
    set((state) => ({
      people: [...state.people, newPerson],
    })),
  removePerson: (personId: string) =>
    set((state) => ({
      people: state.people.filter((person) => person.id !== personId),
    })),
}));

export default usePeopleStore;
