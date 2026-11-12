const BASE_URL = 'https://forum-api.dicoding.dev/v1';
const TOKEN_KEY = 'accessToken';

const VOTE_PATH = { up: 'up-vote', down: 'down-vote', none: 'neutral-vote' };

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function putAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  const token = getAccessToken();
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json();

  if (json.status !== 'success') {
    throw new Error(json.message);
  }
  return json.data;
}

export const forumApi = {
  register: ({ name, email, password }) => request('/register', {
    method: 'POST',
    body: { name, email, password },
  }),
  login: async ({ email, password }) => {
    const data = await request('/login', { method: 'POST', body: { email, password } });
    return data.token;
  },
  getOwnProfile: async () => (await request('/users/me')).user,
  getAllUsers: async () => (await request('/users')).users,
  getAllThreads: async () => (await request('/threads')).threads,
  getThreadDetail: async (id) => (await request(`/threads/${id}`)).detailThread,
  createThread: async ({ title, body, category }) => (
    await request('/threads', { method: 'POST', body: { title, body, category } })
  ).thread,
  createComment: async ({ threadId, content }) => (
    await request(`/threads/${threadId}/comments`, { method: 'POST', body: { content } })
  ).comment,
  voteThread: (threadId, vote) => request(`/threads/${threadId}/${VOTE_PATH[vote]}`, {
    method: 'POST',
  }),
  voteComment: (threadId, commentId, vote) => request(
    `/threads/${threadId}/comments/${commentId}/${VOTE_PATH[vote]}`,
    { method: 'POST' },
  ),
  getLeaderboards: async () => (await request('/leaderboards')).leaderboards,
};
