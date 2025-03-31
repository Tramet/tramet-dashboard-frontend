import { create } from "zustand";

interface User {
  id: number;
  name: string;
  email: string;
  // Agrega más campos según tu modelo de usuario
}

interface UserStore {
  users: User[];
  addUser: (user: User) => void;
  removeUser: (id: number) => void;
  filterUsers: (query: string) => User[];
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
  filterUsers: (query) => get().users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase())),
}));
