export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  // Optional fields that might be in the response
  token?: string;
  user?: User;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}
