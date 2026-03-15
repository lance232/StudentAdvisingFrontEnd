// Matches ASI.Basecode.WebApp.Models.ApiResult<T>
export interface ApiResult<T = unknown> {
  response: T | null;
  status: 'Success' | 'Error' | 'CustomErr';
  message: string;
}

// Matches actual DB schema: id, username, password, role
export interface AuthUser {
  id: number;
  username: string;
  password?: string | null;
  role: string;
}

// Matches ASI.Basecode.WebApp.Models.LoginUser
export interface LoginResponse {
  loginResult: 0 | 1; // 0 = Success, 1 = Failed
  access_token: string;
  expires_in: number;
  userData: AuthUser;
  message: string;
}

export type UserRole = 'adviser' | 'student' | 'chairman';
