import func2url from '../func2url.json';

const AUTH_URL = func2url['auth'];
const MESSAGES_URL = func2url['messages'];
const AVATAR_URL = func2url['avatar'];
const USERS_URL = func2url['users'];

function getToken(): string {
  return localStorage.getItem('nm_token') || '';
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() };
}

export const api = {
  auth: {
    register: (data: { username: string; display_name: string; email: string; password: string }) =>
      fetch(AUTH_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'register', ...data }) }).then((r) => r.json()),

    login: (email: string, password: string) =>
      fetch(AUTH_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', email, password }) }).then((r) => r.json()),
  },

  messages: {
    getChats: () =>
      fetch(`${MESSAGES_URL}?action=chats`, { headers: authHeaders() }).then((r) => r.json()),

    getHistory: (withUserId: string) =>
      fetch(`${MESSAGES_URL}?action=history&with_user_id=${withUserId}`, { headers: authHeaders() }).then((r) => r.json()),

    send: (recipientId: string, text: string) =>
      fetch(MESSAGES_URL, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ action: 'send', recipient_id: recipientId, text }) }).then((r) => r.json()),

    markRead: (fromUserId: string) =>
      fetch(MESSAGES_URL, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ action: 'read', from_user_id: fromUserId }) }).then((r) => r.json()),
  },

  avatar: {
    upload: (imageBase64: string, contentType: string) =>
      fetch(AVATAR_URL, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ image: imageBase64, content_type: contentType }) }).then((r) => r.json()),
  },

  users: {
    search: (q: string) =>
      fetch(`${USERS_URL}?q=${encodeURIComponent(q)}`, { headers: authHeaders() }).then((r) => r.json()),
  },
};

export type User = {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url?: string;
};

export function saveSession(token: string, user: User) {
  localStorage.setItem('nm_token', token);
  localStorage.setItem('nm_user', JSON.stringify(user));
}

export function loadSession(): { token: string; user: User } | null {
  const token = localStorage.getItem('nm_token');
  const raw = localStorage.getItem('nm_user');
  if (!token || !raw) return null;
  return { token, user: JSON.parse(raw) };
}

export function clearSession() {
  localStorage.removeItem('nm_token');
  localStorage.removeItem('nm_user');
}