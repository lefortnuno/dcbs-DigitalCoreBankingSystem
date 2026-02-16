export interface User {
  idUser: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SyncUser {
  idUser: string;
  username: string;
  email?: string;
}

export interface Transaction {
  idTransaction: number;
  amount: number;
  senderAccountId: number;
  receiverAccountId: number;
  created_at: string;
  updated_at: string;
  etat: string;
  typeV: string;

  sender?: {
    idAccount: number;
    typeCompte: string;
    balance: number;
    created_at: string;
    updated_at: string;
    status: string;
    idUser: string;
    username: string;
    ucreated_at: string;
 
  };
  receiver?: {
    idAccount: number;
    typeCompte: string;
    balance: number;
    created_at: string;
    updated_at: string;
    status: string;
    idUser: string;
    username: string;
    ucreated_at: string;
 
  };
}

export interface Account {
  idAccount: number;
  typeCompte: string;
  balance: number;
  created_at: string;
  updated_at: string;
  status: string;

  owner?: {
    idUser: string;
    username: string;
    email: string;
    created_at: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}
