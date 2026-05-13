import { Account, Role, Permission } from "../types/auth.type";
import { mockAccounts, mockRoles, mockPermissions } from "../mocks/auth.mock";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthService = {
  getAccounts: async (): Promise<Account[]> => {
    await delay(300);
    return mockAccounts;
  },
  
  getAccountById: async (id: number): Promise<Account | undefined> => {
    await delay(300);
    return mockAccounts.find(acc => acc.id === id);
  },

  getRoles: async (): Promise<Role[]> => {
    await delay(300);
    return mockRoles;
  },

  getPermissions: async (): Promise<Permission[]> => {
    await delay(300);
    return mockPermissions;
  }
};
