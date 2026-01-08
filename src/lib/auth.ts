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



// Auth helper with HMR-resistant storage

// Use a special key that survives HMR
const TOKEN_KEY = '__app_auth_token__';

export const getToken = (): string | null => {
  if (typeof window === "undefined") {
    console.log("getToken: window is undefined (SSR)");
    return null;
  }
  
  console.log("getToken: checking for token...");
  
  // Try localStorage with our special key
  try {
    const lsToken = localStorage.getItem(TOKEN_KEY);
    if (lsToken) {
      console.log("getToken: Found in localStorage ✅");
      return lsToken;
    }
  } catch (e) {
    console.error("getToken: localStorage error:", e);
  }
  
  // Try sessionStorage as backup (survives HMR better)
  try {
    const ssToken = sessionStorage.getItem(TOKEN_KEY);
    if (ssToken) {
      console.log("getToken: Found in sessionStorage ✅");
      // Copy to localStorage for next time
      localStorage.setItem(TOKEN_KEY, ssToken);
      return ssToken;
    }
  } catch (e) {
    console.error("getToken: sessionStorage error:", e);
  }
  
  // Try cookie as last resort
  const cookies = document.cookie.split(';');
  console.log("getToken: All cookies:", document.cookie);
  const tokenCookie = cookies.find(c => c.trim().startsWith(`${TOKEN_KEY}=`));
  
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    console.log("getToken: Found in cookie ✅");
    // Restore to storage
    try {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error("Could not restore token to storage:", e);
    }
    return token;
  }
  
  console.log("getToken: No token found anywhere ❌");
  return null;
};

export const setToken = (token: string) => {
  console.log("setToken: Storing token in multiple locations...");
  
  // Store in ALL available locations for redundancy
  try {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("setToken: localStorage ✅");
  } catch (error) {
    console.error('setToken: localStorage failed:', error);
  }
  
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    console.log("setToken: sessionStorage ✅");
  } catch (error) {
    console.error('setToken: sessionStorage failed:', error);
  }
  
  // Set cookie with HttpOnly-safe name and long expiry
  try {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days
    document.cookie = `${TOKEN_KEY}=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    console.log("setToken: cookie ✅");
  } catch (error) {
    console.error('setToken: cookie failed:', error);
  }
  
  // Verify immediately
  const lsCheck = localStorage.getItem(TOKEN_KEY);
  const ssCheck = sessionStorage.getItem(TOKEN_KEY);
  console.log("setToken: Verification - localStorage:", lsCheck ? "✅" : "❌");
  console.log("setToken: Verification - sessionStorage:", ssCheck ? "✅" : "❌");
  
  // Additional: Store in window for same-session access (survives HMR)
  if (typeof window !== 'undefined') {
    (window as any).__auth_token__ = token;
    console.log("setToken: window property ✅");
  }
};

export const isAuthenticated = (): boolean => {
  // Also check window property first (fastest, survives HMR)
  if (typeof window !== 'undefined' && (window as any).__auth_token__) {
    console.log('🔐 isAuthenticated check: true (from window)');
    return true;
  }
  
  const token = getToken();
  const result = !!token;
  console.log('🔐 isAuthenticated check:', result);
  if (result) {
    console.log('   Token exists (first 20 chars):', token!.substring(0, 20) + '...');
    // Store in window for next check
    if (typeof window !== 'undefined') {
      (window as any).__auth_token__ = token;
    }
  }
  return result;
};

export const logout = () => {
  console.log("logout: Clearing authentication...");
  
  // Clear from all locations
  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log("logout: localStorage cleared ✅");
  } catch (error) {
    console.error('logout: localStorage clear failed:', error);
  }
  
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    console.log("logout: sessionStorage cleared ✅");
  } catch (error) {
    console.error('logout: sessionStorage clear failed:', error);
  }
  
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  console.log("logout: cookie cleared ✅");
  
  // Clear window property
  if (typeof window !== 'undefined') {
    delete (window as any).__auth_token__;
    console.log("logout: window property cleared ✅");
  }
  
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