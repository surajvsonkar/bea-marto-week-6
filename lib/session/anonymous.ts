const SESSION_KEY = 'cardvault_session_id';

/** Generate a random session ID for anonymous users */
function generateSessionId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Get or create a persistent anonymous session ID.
 * Stored in localStorage so it persists across page refreshes
 * but is unique per browser/device.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();

  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}
