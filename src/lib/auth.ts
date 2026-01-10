// Hybrid approach: Storing token in localStorage AND making backend set HTTP-only cookie
const TOKEN_KEY = '__app_auth_token__';

export const setToken = (token: string) => {
  console.log("💾 Storing token...");
  try {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_KEY, token);
    console.log("✅ Token stored successfully");
  } catch (error) {
    console.error('❌ Failed to store token:', error);
  }
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear token:', error);
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!getToken();
};

export const logout = async () => {
  console.log("🚪 Logging out...");
  
  try {
    // Calling backend logout to clear cookie
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout request failed:', error);
  }
  
  // Clearing local token
  clearToken();
  
  // Redirecting to login
  window.location.href = "/login";
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const isAuthError = (error: any): boolean => {
  return error?.message?.includes('401') || 
         error?.message?.includes('Unauthorized') ||
         error?.message?.includes('unauthorized');
};

export default {
  setToken,
  getToken,
  clearToken,
  isAuthenticated,
  logout,
  getAuthHeaders,
  isAuthError,
};