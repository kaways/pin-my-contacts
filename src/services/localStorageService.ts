export const LocalStorageService = {
  getItem: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  setItem: (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },

  getCurrentUser: () => {
    return LocalStorageService.getItem("currentUser");
  },

  getContacts: (email: string) => {
    return LocalStorageService.getItem(`users-${email}`) || [];
  },

  saveContacts: (email: string, contacts: unknown) => {
    LocalStorageService.setItem(`users-${email}`, contacts);
  },

  deleteAccount: (email: string) => {
    const accounts = LocalStorageService.getItem("accounts") || [];
    const updatedAccounts = accounts.filter(
      (u: { email: string }) => u.email !== email
    );
    LocalStorageService.setItem("accounts", updatedAccounts);
    LocalStorageService.removeItem(`users-${email}`);
  },
};
