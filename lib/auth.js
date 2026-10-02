// Green Fibre B2B Authentication Service & Client API Helpers
// Handles B2B login, registration, token persistence, and session refresh

const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    // In browser, use same-origin relative paths to avoid CORS and port connection failures
    return "";
  }
  return process.env.B2B_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.greenfibre.org";
};

export const TOKEN_KEY = "b2b_token";
export const USER_KEY = "b2b_user";

// Safe localStorage access
export const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY) || getCookie(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = (token, user, rememberMe = true) => {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setCookie(TOKEN_KEY, token, rememberMe ? 30 : 7);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error("[B2B Auth] Failed to save auth session:", err);
  }
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    deleteCookie(TOKEN_KEY);
  } catch (err) {
    console.error("[B2B Auth] Failed to clear auth session:", err);
  }
};

// Cookie helpers
function setCookie(name, value, days = 7) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {}
}

function getCookie(name) {
  try {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  } catch {
    return null;
  }
}

function deleteCookie(name) {
  try {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  } catch {}
}

export function sanitizeEmail(val) {
  if (!val) return "";
  let clean = String(val).trim().toLowerCase();
  // Auto-correct comma before domain extension (e.g. @gmail,com -> @gmail.com)
  clean = clean.replace(/,([a-zA-Z0-9-]+)/g, ".$1");
  // Replace any remaining accidental commas with dots
  clean = clean.replace(/,/g, ".");
  return clean;
}

/**
 * 1. Register B2B Enterprise Account
 */
export async function registerB2B(userData) {
  const baseUrl = getApiBaseUrl();
  const email = sanitizeEmail(userData.email);
  const payload = {
    fullName: (userData.fullName || userData.full_name || "").trim(),
    full_name: (userData.fullName || userData.full_name || "").trim(),
    companyName: (userData.companyName || "").trim(),
    email: email,
    phone: (userData.phone || "").trim(),
    businessType: userData.businessType || "Corporate Gifting & HR",
    gstin: (userData.gstin || "").trim().toUpperCase(),
    password: userData.password,
    otp: (userData.otp || "").trim(),
    rememberMe: Boolean(userData.rememberMe ?? true)
  };

  const url = `${baseUrl}/api/b2b/register`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success !== false) {
      const token = data.token;
      const user = data.user || data.data || payload;
      setAuthSession(token, user, payload.rememberMe);
      return { success: true, token, user, message: data.message || "Account registered successfully" };
    }

    throw new Error(data.message || data.error || `Registration returned error code ${res.status}`);
  } catch (err) {
    console.error("[B2B Auth] Registration error:", err);
    throw err;
  }
}

/**
 * 2. Send 6-Digit OTP Email
 * @param {Object} params
 * @param {string} params.email
 * @param {"registration" | "forgot_password"} params.type
 * @param {string} [params.fullName]
 */
export async function sendOtp({ email, type = "registration", fullName = "" }) {
  const baseUrl = getApiBaseUrl();
  const cleanEmail = sanitizeEmail(email);
  const url = `${baseUrl}/api/b2b/otp/send`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, type, fullName })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success !== false) {
      return {
        success: true,
        message: data.message || "Verification code sent to your email",
        devMode: Boolean(data.devMode)
      };
    }

    throw new Error(data.message || data.error || "Failed to send verification code");
  } catch (err) {
    console.error("[B2B Auth] sendOtp error:", err);
    throw err;
  }
}

/**
 * 3. Verify OTP
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.otp
 * @param {"registration" | "forgot_password"} params.type
 */
export async function verifyOtp({ email, otp, type = "registration" }) {
  const baseUrl = getApiBaseUrl();
  const cleanEmail = sanitizeEmail(email);
  const url = `${baseUrl}/api/b2b/otp/verify`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, otp: String(otp).trim(), type })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success !== false) {
      return { success: true, message: data.message || "Code verified successfully" };
    }

    throw new Error(data.message || data.error || "Invalid verification code");
  } catch (err) {
    console.error("[B2B Auth] verifyOtp error:", err);
    throw err;
  }
}

/**
 * 4. Reset Password with OTP
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.otp
 * @param {string} params.newPassword
 */
export async function resetPassword({ email, otp, newPassword }) {
  const baseUrl = getApiBaseUrl();
  const cleanEmail = sanitizeEmail(email);
  const url = `${baseUrl}/api/b2b/reset-password`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        otp: String(otp).trim(),
        newPassword
      })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success !== false) {
      return { success: true, message: data.message || "Password reset successfully" };
    }

    throw new Error(data.message || data.error || "Failed to reset password");
  } catch (err) {
    console.error("[B2B Auth] resetPassword error:", err);
    throw err;
  }
}

/**
 * 2. Sign In B2B Account
 */
export async function loginB2B(credentials) {
  const baseUrl = getApiBaseUrl();
  const email = sanitizeEmail(credentials.email);
  const payload = {
    email: email,
    password: credentials.password,
    rememberMe: Boolean(credentials.rememberMe ?? true)
  };

  const url = `${baseUrl}/api/b2b/login`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success !== false) {
      const token = data.token;
      const user = data.user || data.data;
      setAuthSession(token, user, payload.rememberMe);
      return { success: true, token, user, message: data.message || "Sign in successful" };
    }

    throw new Error(data.message || data.error || "Invalid work email or password");
  } catch (err) {
    console.error("[B2B Auth] Login error:", err);
    throw err;
  }
}

/**
 * 3. Fetch Authenticated User Profile
 */
export async function fetchB2BProfile(tokenOverride = null) {
  const token = tokenOverride || getStoredToken();
  if (!token) return null;

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/b2b/me`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      const user = data.user || data.data || data;
      if (user && (user.email || user.fullName)) {
        setAuthSession(token, user);
        return user;
      }
    }
  } catch (err) {
    console.warn("[B2B Auth] Profile fetch error:", err);
  }

  return getStoredUser();
}

/**
 * 4. Refresh B2B Token
 */
export async function refreshB2BToken(existingToken = null) {
  const token = existingToken || getStoredToken();
  if (!token) return null;

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/b2b/refresh-token`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        const user = data.user || getStoredUser();
        setAuthSession(data.token, user);
        return data.token;
      }
    }
  } catch {}

  return null;
}
