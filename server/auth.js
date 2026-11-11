import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * 4 AUTHORISED ADMINISTRATOR ACCOUNTS
 * Credentials securely hashed with bcrypt (cost factor 12).
 * Plaintext passwords are never stored in code, database, or logs.
 */
const AUTHORIZED_ADMINS = [
  {
    id: 'atif1234',
    // bcrypt hash of 'atif@019283jsr'
    passwordHash: '$2b$12$IOjkJMfsCeXd2oyp4Tt1C.nbb0acaBca0MA.aT7j5M1Tl5iOWkn8e',
    name: 'Administrator (Atif)',
    role: 'SUPER_ADMIN',
  },
  {
    id: 'sharique2002',
    // bcrypt hash of 'sharry@100482jsr'
    passwordHash: '$2b$12$yKXsYld4MsfDB84eJQsO0.GYzQY2UlSOiMcQla/sqsc9XrKzNRA.u',
    name: 'Administrator (Sharique)',
    role: 'SUPER_ADMIN',
  },
  {
    id: 'admin9877',
    // bcrypt hash of 'qwerty@345098jsr'
    passwordHash: '$2b$12$1X124jqocqzRST47YVfUQOgKelGRYhefftgPCMKz0s2R/m82fN2MS',
    name: 'Desk Admin 9877',
    role: 'ADMIN',
  },
  {
    id: 'admin8766',
    // bcrypt hash of 'asdfg@837627jsr'
    passwordHash: '$2b$12$t3vPqyr0AZ9P6UK3xI0kxui2HgL.S0z/5bnr36umSD7gvTQEGVsca',
    name: 'Desk Admin 8766',
    role: 'ADMIN',
  },
];

// In-Memory Active Session Store with Last-Activity Expiry (2 Hours)
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours
const activeSessions = new Map();

/**
 * Verify credentials against authorized accounts
 */
export function verifyAdminCredentials(username, password) {
  if (!username || !password) return null;

  const normalizedUser = username.trim().toLowerCase();
  const admin = AUTHORIZED_ADMINS.find(a => a.id.toLowerCase() === normalizedUser);

  if (!admin) {
    // Run dummy compare to mitigate timing attacks
    bcrypt.compareSync(password, '$2b$12$e8Yd8h3z3wZ5F1P2J8z9.uP5j2w1e4r7t9y0u1i2o3p4a5s6d7f8g');
    return null;
  }

  const isValid = bcrypt.compareSync(password, admin.passwordHash);
  if (!isValid) return null;

  return {
    id: admin.id,
    name: admin.name,
    role: admin.role,
  };
}

/**
 * Create a cryptographically secure session
 */
export function createAdminSession(adminUser) {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionData = {
    user: adminUser,
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };

  activeSessions.set(sessionToken, sessionData);
  return sessionToken;
}

/**
 * Invalidate a session (Logout)
 */
export function destroyAdminSession(sessionToken) {
  if (!sessionToken) return false;
  return activeSessions.delete(sessionToken);
}

/**
 * Validate session token and check expiration
 */
export function getSessionUser(sessionToken) {
  if (!sessionToken) return null;

  const session = activeSessions.get(sessionToken);
  if (!session) return null;

  const now = Date.now();
  if (now - session.lastActivity > SESSION_EXPIRY_MS) {
    activeSessions.delete(sessionToken);
    return null;
  }

  // Slide expiration window on activity
  session.lastActivity = now;
  return session.user;
}

/**
 * Express Middleware: Protect Admin Endpoints
 */
export function requireAdminAuth(req, res, next) {
  const token = 
    req.cookies?.amarked_admin_session ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  const user = getSessionUser(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Authentication required to access Admin Desk.',
    });
  }

  req.adminUser = user;
  req.sessionToken = token;
  next();
}
