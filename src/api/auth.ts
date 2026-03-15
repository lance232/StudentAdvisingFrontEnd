import { apiClient, setToken, clearToken } from './apiClient';
import type { LoginResponse, UserRole } from './types';

export interface LoginCredentials {
  userId: string;
  password: string;
}

export interface LoginData {
  role: UserRole;
  name: string;
  userId: string;
  expiresIn: number;
}

export interface RegisterPayload {
  userId: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginData> {
  const result = await apiClient.post<LoginResponse>('/Account/Login', {
    userId: credentials.userId,
    password: credentials.password,
  });

  const loginResponse = result.response;

  if (!loginResponse || loginResponse.loginResult !== 0) {
    throw new Error(result.message ?? 'Authentication failed.');
  }

  setToken(loginResponse.access_token);

  return {
    role: loginResponse.userData.role as UserRole,
    name: loginResponse.userData.username,
    userId: loginResponse.userData.username,
    expiresIn: loginResponse.expires_in,
  };
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  await apiClient.post('/Account/Register', {
    userId: payload.userId,
    name: payload.name,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
  });
}

export async function logoutUser(): Promise<void> {
  try {
    await apiClient.post('/Account/Logout', {});
  } finally {
    clearToken();
  }
}

