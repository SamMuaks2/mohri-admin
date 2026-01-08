export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  // Get token from cookie
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
  
  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }
  
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = () => {
  document.cookie = "token=; path=/; max-age=0";
  window.location.href = "/login";
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};


// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// /**
//  * Checks auth status by asking the backend
//  */
// export const isAuthenticated = async (): Promise<boolean> => {
//   try {
//     const res = await fetch(`${API_URL}/auth/me`, {
//       credentials: "include",
//     });

//     return res.ok;
//   } catch {
//     return false;
//   }
// };

// /**
//  * Logout MUST be handled by backend
//  */
// export const logout = async () => {
//   await fetch(`${API_URL}/auth/logout`, {
//     method: "POST",
//     credentials: "include",
//   });

//   window.location.href = "/login";
// };
