// import { getAuthHeaders } from "./auth";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// export const apiClient = {
//   async get(endpoint: string) {
//     const res = await fetch(`${API_URL}${endpoint}`,  {
//       headers: getAuthHeaders(),
//     });
    
//     if (!res.ok) {
//       throw new Error(`API Error: ${res.statusText}`);
//     }
    
//     return res.json();
//   },

//   async post(endpoint: string, data: any) {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(data),
//     });
    
//     if (!res.ok) {
//       throw new Error(`API Error: ${res.statusText}`);
//     }
    
//     return res.json();
//   },

//   async put(endpoint: string, data: any) {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method: "PUT",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(data),
//     });
    
//     if (!res.ok) {
//       throw new Error(`API Error: ${res.statusText}`);
//     }
    
//     return res.json();
//   },

//   async delete(endpoint: string) {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     });
    
//     if (!res.ok) {
//       throw new Error(`API Error: ${res.statusText}`);
//     }
    
//     return res.json();
//   },
// };


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const handleAuthError = (res: Response) => {
  if (res.status === 401) {
    throw new Error("Unauthorized");
  }
};

export const apiClient = {
  async get(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
    });

    handleAuthError(res);

    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    handleAuthError(res);

    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
};
