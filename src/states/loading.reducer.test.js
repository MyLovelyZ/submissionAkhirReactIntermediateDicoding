import { describe, expect, it } from 'vitest';
import reducer from './loading';

/**
 * Skenario pengujian reducer loading:
 * - initial state 0.
 * - action '/pending' menambah penghitung; '/fulfilled' dan '/rejected' menguranginya.
 * - penghitung tidak pernah negatif.
 * - action vote (optimistic update) tidak dihitung.
 * - action biasa diabaikan.
 */
describe('loading reducer', () => {
  it('initial state 0', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toBe(0);
  });

  it('pending menambah, fulfilled/rejected mengurangi', () => {
    let state = reducer(0, { type: 'threads/populate/pending' });
    state = reducer(state, { type: 'auth/login/pending' });
    expect(state).toBe(2);
    state = reducer(state, { type: 'threads/populate/fulfilled' });
    state = reducer(state, { type: 'auth/login/rejected' });
    expect(state).toBe(0);
  });

  it('tidak turun di bawah 0', () => {
    expect(reducer(0, { type: 'threads/populate/fulfilled' })).toBe(0);
  });

  it('mengabaikan action vote', () => {
    expect(reducer(0, { type: 'vote/thread/pending' })).toBe(0);
    expect(reducer(1, { type: 'vote/comment/fulfilled' })).toBe(1);
  });

  it('mengabaikan action biasa', () => {
    expect(reducer(1, { type: 'notice/clearNotice' })).toBe(1);
  });
});
