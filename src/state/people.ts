import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Person } from "@/types/index";
import { reportHydrationError } from "./persistence";

interface PeopleStore {
  people: Person[];
  addPerson: (person: Person) => void;
  clearPeople: () => void;
  removePerson: (personId: string) => void;
  findPerson: (personId: string) => Person | undefined;
}

const usePeopleStore = create<PeopleStore>()(
  persist(
    (set, get) => ({
      people: [],

      addPerson: (newPerson) =>
        set((state) => ({
          people: [...state.people, newPerson],
        })),

      clearPeople: () => set({ people: [] }),

      removePerson: (personId: string) =>
        set((state) => ({
          people: state.people.filter((person) => person.id !== personId),
        })),

      findPerson: (personId: string) =>
        get().people.find((person) => person.id === personId),
    }),
    {
      name: "chippa-people",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ people: state.people }),
      skipHydration: true,
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          reportHydrationError(error);
        }
      },
    },
  ),
);

export default usePeopleStore;
