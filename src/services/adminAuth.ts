export interface AdminUser {
  id: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AdminUser;
  error?: string;
  message?: string;
}

/**
 * Login via Secure Backend Authentication
 */
export async function loginAdmin(username: string, password: string): Promise<LoginResponse> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send and receive HttpOnly session cookie
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Invalid Admin ID or Password. Please try again.',
      };
    }

    // Save session token in sessionStorage as secondary bearer header backup
    if (data.token) {
      sessionStorage.setItem('amarked_admin_token', data.token);
      sessionStorage.setItem('amarked_admin_user', JSON.stringify(data.user));
    }

    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch (err) {
    return {
      success: false,
      error: 'Unable to connect to security server. Please ensure the backend is running.',
    };
  }
}

/**
 * Logout from Backend
 */
export async function logoutAdmin(): Promise<boolean> {
  try {
    const token = sessionStorage.getItem('amarked_admin_token');
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });
  } catch (err) {
    console.warn('Backend logout call failed', err);
  } finally {
    sessionStorage.removeItem('amarked_admin_token');
    sessionStorage.removeItem('amarked_admin_user');
  }
  return true;
}

/**
 * Verify current session with Backend
 */
export async function checkAdminSession(): Promise<AdminUser | null> {
  try {
    const token = sessionStorage.getItem('amarked_admin_token');
    const res = await fetch('/api/admin/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });

    if (!res.ok) {
      sessionStorage.removeItem('amarked_admin_token');
      sessionStorage.removeItem('amarked_admin_user');
      return null;
    }

    const data = await res.json();
    if (data.success && data.user) {
      sessionStorage.setItem('amarked_admin_user', JSON.stringify(data.user));
      return data.user;
    }
    return null;
  } catch (err) {
    // If backend is unreachable, invalidate
    return null;
  }
}

/**
 * Helper to get authorization headers for admin requests
 */
export function getAdminAuthHeaders(): Record<string, string> {
  const token = sessionStorage.getItem('amarked_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
