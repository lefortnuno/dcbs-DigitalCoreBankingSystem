import type { Account, Transaction, User } from "../types";

class ApiService {
  private baseUrl = import.meta.env.VITE_MICRO_GATEWAY_URL;
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    let data: any = null;

    // On essaie de parser le JSON proprement
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    // 🔥 Gestion propre des erreurs backend
    if (!response.ok) {
      const backendMessage =
        data?.message || data?.error || `Erreur ${response.status}`;

      throw new Error(backendMessage);
    }

    return data as T;
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/user-service/users");
  }

  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>("/account-service/accounts");
  }

  async getMyAccounts(uID: any): Promise<Account[]> {
    return this.request<Account[]>(
      `/account-service/accounts/myAccount?u1=${uID}`,
    );
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>("/transaction-service/transactions");
  }

  async getAllMyTransactions(accountIds: number[]): Promise<Transaction[]> {
    const query = accountIds.join(",");

    return this.request<Transaction[]>(
      `/transaction-service/transactions/AllMyTrans?ids=${query}`,
    );
  }
  
  async getAllMyTransactionsToDelete(accountIds: number[]): Promise<Transaction[]> {
    const query = accountIds.join(",");

    return this.request<Transaction[]>(
      `/transaction-service/transactions/AllMyTransToDelete?ids=${query}`,
    );
  }

  async ensureUser(user: Pick<User, "idUser" | "username">): Promise<User> {
    return this.request<User>("/user-service/users/ensure", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async deleteUser(userId: string | undefined): Promise<User> {
    return this.request<User>(`/user-service/users/${userId}`, {
      method: "DELETE",
    });
  }

  async deleteAccount(accountId: number): Promise<Account> {
    return this.request<Account>(`/account-service/accounts/${accountId}`, {
      method: "DELETE",
    });
  }

  async getTransactionsWith(
    accountId: number,
    accountId2: number,
  ): Promise<Transaction[]> {
    return this.request<Transaction[]>(
      `/transaction-service/transactions/trans?u1=${accountId}&u2=${accountId2}`,
    );
  }

  async doTransaction(
    senderAccountId: number,
    receiverAccountId: number,
    amount: number,
    typeV: string,
  ): Promise<Transaction> {
    return this.request<Transaction>("/transaction-service/transactions", {
      method: "POST",
      body: JSON.stringify({
        senderAccountId,
        receiverAccountId,
        amount,
        typeV,
        created_at: new Date().toISOString(),
      }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
