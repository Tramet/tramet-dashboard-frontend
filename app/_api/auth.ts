// Authentication API service

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<string> {
  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to login");
    }

    const data: LoginResponse = await response.json();
    return data.token;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
