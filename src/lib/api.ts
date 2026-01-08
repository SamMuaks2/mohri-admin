import { getAuthHeaders } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiClient = {
  async get(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`,  {
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    
    return res.json();
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    
    return res.json();
  },

  async put(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    
    return res.json();
  },

  async delete(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    
    return res.json();
  },
};


// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// export const apiClient = {
//   async get(endpoint: string) {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       credentials: "include", // 🔑 THIS sends cookies
//     });

//     if (!res.ok) {
//       throw new Error("API Error: Unauthorized");
//     }

//     return res.json();
//   },

//   async post(endpoint: string, data: any) {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!res.ok) {
//       throw new Error("API Error: Unauthorized");
//     }

//     return res.json();
//   },

//   async put(endpoint: string, data: any) {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method: "PUT",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!res.ok) {
//       throw new Error("API Error: Unauthorized");
//     }

//     return res.json();
//   },

//   async delete(endpoint: string) {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method: "DELETE",
//       credentials: "include",
//     });

//     if (!res.ok) {
//       throw new Error("API Error: Unauthorized");
//     }

//     return res.json();
//   },
// };
