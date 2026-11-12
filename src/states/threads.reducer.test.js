import { describe, expect, it } from 'vitest';
import reducer, { receiveThreads, setCategory, setThreadVote } from './threads';

/**
 * Skenario pengujian reducer threads:
 * - mengembalikan initial state saat action tidak dikenal.
 * - receiveThreads mengganti daftar thread.
 * - setCategory memilih kategori, menggantinya, lalu membatalkan saat dipilih lagi.
 * - setThreadVote 'up' mengubah downvote user menjadi upvote.
 * - setThreadVote 'down' mengubah upvote user menjadi downvote.
 * - setThreadVote 'none' membatalkan vote user.
 * - setThreadVote pada thread yang tidak ada tidak mengubah state.
 */
describe('threads reducer', () => {
  const thread = (id, up = [], down = []) => ({ id, upVotesBy: up, downVotesBy: down });
  const initial = { items: [thread('t1', [], ['u1']), thread('t2', ['u1'])], category: '' };

  it('mengembalikan initial state untuk action tidak dikenal', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({ items: [], category: '' });
  });

  it('receiveThreads mengganti daftar thread', () => {
    const next = reducer(initial, receiveThreads([thread('t9')]));
    expect(next.items).toEqual([thread('t9')]);
  });

  it('setCategory memilih, mengganti, lalu membatalkan kategori', () => {
    let state = reducer(initial, setCategory('react'));
    expect(state.category).toBe('react');
    state = reducer(state, setCategory('redux'));
    expect(state.category).toBe('redux');
    state = reducer(state, setCategory('redux'));
    expect(state.category).toBe('');
  });

  it('setThreadVote up mengubah downvote menjadi upvote', () => {
    const next = reducer(initial, setThreadVote({ threadId: 't1', userId: 'u1', vote: 'up' }));
    expect(next.items[0]).toEqual(thread('t1', ['u1'], []));
  });

  it('setThreadVote down mengubah upvote menjadi downvote', () => {
    const next = reducer(initial, setThreadVote({ threadId: 't2', userId: 'u1', vote: 'down' }));
    expect(next.items[1]).toEqual(thread('t2', [], ['u1']));
  });

  it('setThreadVote none membatalkan vote', () => {
    const next = reducer(initial, setThreadVote({ threadId: 't2', userId: 'u1', vote: 'none' }));
    expect(next.items[1]).toEqual(thread('t2', [], []));
  });

  it('setThreadVote pada thread yang tidak ada tidak mengubah state', () => {
    const next = reducer(initial, setThreadVote({ threadId: 'x', userId: 'u1', vote: 'up' }));
    expect(next).toEqual(initial);
  });
});
