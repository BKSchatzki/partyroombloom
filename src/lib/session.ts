export interface ClientUser {
  chatTokens: number;
}

export interface SessionPayload {
  user: ClientUser | null;
}

const isClientUser = (value: unknown): value is ClientUser => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;
  return Number.isSafeInteger(user.chatTokens);
};

export const parseSessionPayload = (value: unknown): SessionPayload | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const payload = value as Record<string, unknown>;
  if (payload.user === null) {
    return { user: null };
  }

  if (!isClientUser(payload.user)) {
    return null;
  }

  return { user: payload.user };
};
