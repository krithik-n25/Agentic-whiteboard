// Free plan limits. Used on the server (checks) and in the UI (counters).
// A paid plan later only needs changes here.

// AI generations per month. Refilled on the 1st of every month (UTC).
export const FREE_AI_CREDITS = 10;

// Date when AI credits are refilled next: the 1st of next month (UTC)
export const getNextCreditReset = (from: Date = new Date()) =>
  new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1));
