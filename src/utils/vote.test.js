import { describe, expect, it } from 'vitest';
import { applyVote, getVote } from './vote';

/**
 * Skenario pengujian util vote:
 * - getVote
 *   - mengembalikan 'none' bila tidak ada user.
 *   - mengembalikan 'up' / 'down' / 'none' sesuai daftar voter.
 * - applyVote
 *   - 'up' menambah user ke upVotesBy dan menghapusnya dari downVotesBy.
 *   - 'down' menambah user ke downVotesBy dan menghapusnya dari upVotesBy.
 *   - 'none' menghapus user dari kedua daftar tanpa memutasi objek asal.
 */
describe('vote utils', () => {
  const item = { upVotesBy: ['u1', 'u2'], downVotesBy: ['u3'] };

  it('getVote mengembalikan none bila user tidak ada', () => {
    expect(getVote(item, undefined)).toBe('none');
  });

  it('getVote membaca status vote user', () => {
    expect(getVote(item, 'u1')).toBe('up');
    expect(getVote(item, 'u3')).toBe('down');
    expect(getVote(item, 'u9')).toBe('none');
  });

  it('applyVote up memindahkan user dari downvote ke upvote', () => {
    expect(applyVote(item, 'u3', 'up')).toEqual({ upVotesBy: ['u1', 'u2', 'u3'], downVotesBy: [] });
  });

  it('applyVote down memindahkan user dari upvote ke downvote', () => {
    expect(applyVote(item, 'u1', 'down')).toEqual({ upVotesBy: ['u2'], downVotesBy: ['u3', 'u1'] });
  });

  it('applyVote none menghapus vote tanpa memutasi objek asal', () => {
    expect(applyVote(item, 'u2', 'none')).toEqual({ upVotesBy: ['u1'], downVotesBy: ['u3'] });
    expect(item).toEqual({ upVotesBy: ['u1', 'u2'], downVotesBy: ['u3'] });
  });
});
