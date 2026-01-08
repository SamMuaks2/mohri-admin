// export const getToken = (): string | null => {
//   if (typeof window === "undefined") return null;
  
//   // Get token from cookie
//   const cookies = document.cookie.split(';');
//   const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
  
//   if (tokenCookie) {
//     return tokenCookie.split('=')[1];
//   }
  
//   return null;
// };

// export const isAuthenticated = (): boolean => {
//   return !!getToken();
// };

// export const logout = () => {
//   document.cookie = "token=; path=/; max-age=0";
//   window.location.href = "/login";
// };

// export const getAuthHeaders = () => {
//   const token = getToken();
//   return {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
// };

// ===================
// version 2
// ===================
// export const getToken = (): string | null => {
//   if (typeof window === "undefined") return null;
  
//   // Get token from cookie
//   const cookies = document.cookie.split(';');
//   const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
  
//   if (tokenCookie) {
//     return tokenCookie.split('=')[1];
//   }
  
//   return null;
// };

// export const isAuthenticated = (): boolean => {
//   return !!getToken();
// };

// export const logout = () => {
//   document.cookie = "token=; path=/; max-age=0";
//   window.location.href = "/login";
// };

// export const getAuthHeaders = () => {
//   const token = getToken();
//   return {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
// };

// // NEW: Helper to check if error is auth-related
// export const isAuthError = (error: any): boolean => {
//   return error?.message?.includes('401') || 
//          error?.message?.includes('Unauthorized') ||
//          error?.message?.includes('unauthorized');
// };



// Simplified auth that relies on HTTP-only cookies + localStorage backup
const TOKEN_KEY = '__app_auth_token__';

export const setToken = (token: string) => {
  // Store in localStorage only as a flag (real token is in HTTP-only cookie)
  try {
    localStorage.setItem(TOKEN_KEY, 'authenticated');
    sessionStorage.setItem(TOKEN_KEY, 'authenticated');
  } catch (error) {
    console.error('Failed to set auth flag:', error);
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear auth flag:', error);
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // Check if we have the auth flag
  try {
    const hasFlag = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    return !!hasFlag;
  } catch {
    return false;
  }
};

export const logout = async () => {
  try {
    // Call backend logout to clear cookie
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Important: send cookies
    });
  } catch (error) {
    console.error('Logout request failed:', error);
  }
  
  // Clear local flags
  clearToken();
  
  // Redirect to login
  window.location.href = "/login";
};

export const getAuthHeaders = () => {
  // The cookie is sent automatically with credentials: 'include'
  return {
    "Content-Type": "application/json",
  };
};

export const isAuthError = (error: any): boolean => {
  return error?.message?.includes('401') || 
         error?.message?.includes('Unauthorized') ||
         error?.message?.includes('unauthorized');
};