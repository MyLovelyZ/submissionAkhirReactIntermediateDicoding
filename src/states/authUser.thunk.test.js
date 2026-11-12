import { configureStore } from '@reduxjs/toolkit';
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import {
  forumApi, getAccessToken, putAccessToken, removeAccessToken,
} from '../api/forumApi';
import authUser, {
  asyncLogin, asyncLogout, asyncPreloadAuth, asyncRegister,
} from './authUser';
import notice from './notice';

vi.mock('../api/forumApi', () => ({
  forumApi: {
    login: vi.fn(), register: vi.fn(), getOwnProfile: vi.fn(),
  },
  getAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}));

/**
 * Skenario pengujian thunk auth:
 * - asyncLogin
 *   - sukses: menyimpan token, mengambil profil, mengisi authUser.user, mengembalikan true.
 *   - gagal: tidak menyimpan token, menampilkan notice error, mengembalikan false.
 * - asyncRegister
 *   - sukses: menampilkan notice success dan mengembalikan true.
 *   - gagal: menampilkan notice error dan mengembalikan false.
 * - asyncPreloadAuth
 *   - ada token: profil dimuat dan isPreloading menjadi false.
 *   - tanpa token: API tidak dipanggil, isPreloading tetap menjadi false.
 *   - token tidak valid: token dihapus dan isPreloading menjadi false.
 * - asyncLogout: menghapus token dan mengosongkan user.
 */
describe('authUser thunks', () => {
  const profile = { id: 'u1', name: 'Budi', email: 'budi@mail.com' };
  const makeStore = (user = null) => configureStore({
    reducer: { authUser, notice },
    preloadedState: { authUser: { user, isPreloading: true }, notice: null },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asyncLogin sukses menyimpan token dan profil', async () => {
    forumApi.login.mockResolvedValue('token-123');
    forumApi.getOwnProfile.mockResolvedValue(profile);
    const store = makeStore();

    const result = await store.dispatch(asyncLogin({ email: 'budi@mail.com', password: 'rahasia' })).unwrap();

    expect(result).toBe(true);
    expect(putAccessToken).toHaveBeenCalledWith('token-123');
    expect(store.getState().authUser.user).toEqual(profile);
    expect(store.getState().notice).toBeNull();
  });

  it('asyncLogin gagal menampilkan notice error', async () => {
    forumApi.login.mockRejectedValue(new Error('email or password is wrong'));
    const store = makeStore();

    const result = await store.dispatch(asyncLogin({ email: 'x@mail.com', password: 'salah' })).unwrap();

    expect(result).toBe(false);
    expect(putAccessToken).not.toHaveBeenCalled();
    expect(store.getState().authUser.user).toBeNull();
    expect(store.getState().notice).toMatchObject({ message: 'email or password is wrong', type: 'error' });
  });

  it('asyncRegister sukses menampilkan notice success', async () => {
    forumApi.register.mockResolvedValue({});
    const store = makeStore();

    const result = await store.dispatch(asyncRegister({ name: 'Budi', email: 'b@mail.com', password: 'abcdef' })).unwrap();

    expect(result).toBe(true);
    expect(store.getState().notice).toMatchObject({ type: 'success' });
  });

  it('asyncRegister gagal menampilkan notice error', async () => {
    forumApi.register.mockRejectedValue(new Error('email is already taken'));
    const store = makeStore();

    const result = await store.dispatch(asyncRegister({ name: 'Budi', email: 'b@mail.com', password: 'abcdef' })).unwrap();

    expect(result).toBe(false);
    expect(store.getState().notice).toMatchObject({ message: 'email is already taken', type: 'error' });
  });

  it('asyncPreloadAuth memuat profil bila token ada', async () => {
    getAccessToken.mockReturnValue('token-123');
    forumApi.getOwnProfile.mockResolvedValue(profile);
    const store = makeStore();

    await store.dispatch(asyncPreloadAuth());

    expect(store.getState().authUser).toEqual({ user: profile, isPreloading: false });
  });

  it('asyncPreloadAuth tanpa token tidak memanggil API', async () => {
    getAccessToken.mockReturnValue(null);
    const store = makeStore();

    await store.dispatch(asyncPreloadAuth());

    expect(forumApi.getOwnProfile).not.toHaveBeenCalled();
    expect(store.getState().authUser).toEqual({ user: null, isPreloading: false });
  });

  it('asyncPreloadAuth menghapus token yang tidak valid', async () => {
    getAccessToken.mockReturnValue('token-kadaluarsa');
    forumApi.getOwnProfile.mockRejectedValue(new Error('invalid token'));
    const store = makeStore();

    await store.dispatch(asyncPreloadAuth());

    expect(removeAccessToken).toHaveBeenCalled();
    expect(store.getState().authUser).toEqual({ user: null, isPreloading: false });
  });

  it('asyncLogout menghapus token dan user', async () => {
    const store = makeStore(profile);

    await store.dispatch(asyncLogout());

    expect(removeAccessToken).toHaveBeenCalled();
    expect(store.getState().authUser.user).toBeNull();
  });
});
