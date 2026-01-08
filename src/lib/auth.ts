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



export const logout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }

  window.location.href = "/login";
};
