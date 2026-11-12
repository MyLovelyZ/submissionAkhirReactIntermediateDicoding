import { describe, expect, it } from 'vitest';
import reducer, { finishPreload, setAuthUser } from './authUser';

/**
 * Skenario pengujian reducer authUser:
 * - initial state: user null dan isPreloading true.
 * - setAuthUser menyimpan user, dan null saat logout.
 * - finishPreload mematikan isPreloading tanpa menghapus user.
 */
describe('authUser reducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({ user: null, isPreloading: true });
  });

  it('setAuthUser menyimpan lalu menghapus user', () => {
    const user = { id: 'u1', name: 'Budi' };
    const loggedIn = reducer(undefined, setAuthUser(user));
    expect(loggedIn.user).toEqual(user);
    expect(reducer(loggedIn, setAuthUser(null)).user).toBeNull();
  });

  it('finishPreload hanya mematikan isPreloading', () => {
    const state = reducer({ user: { id: 'u1' }, isPreloading: true }, finishPreload());
    expect(state).toEqual({ user: { id: 'u1' }, isPreloading: false });
  });
});
