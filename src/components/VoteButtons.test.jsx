import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  describe, expect, it, vi,
} from 'vitest';
import VoteButtons from './VoteButtons';

/**
 * Skenario pengujian VoteButtons:
 * - menampilkan jumlah upvote dan downvote.
 * - menandai tombol upvote aktif (aria-pressed) bila user sudah upvote.
 * - menandai tombol downvote aktif bila user sudah downvote.
 * - tidak ada tombol aktif bila user belum vote atau belum login.
 * - memanggil onVote('up') dan onVote('down') saat tombol diklik.
 */
describe('VoteButtons', () => {
  const setup = ({ authUserId = 'u9' } = {}) => {
    const onVote = vi.fn();
    render(
      <VoteButtons
        upVotesBy={['u1', 'u2']}
        downVotesBy={['u3']}
        onVote={onVote}
        authUserId={authUserId}
      />,
    );
    return {
      onVote,
      up: screen.getByRole('button', { name: /upvote/i }),
      down: screen.getByRole('button', { name: /downvote/i }),
    };
  };

  it('menampilkan jumlah suara', () => {
    const { up, down } = setup();
    expect(up).toHaveTextContent('2');
    expect(down).toHaveTextContent('1');
  });

  it('menandai upvote aktif bila user sudah upvote', () => {
    const { up, down } = setup({ authUserId: 'u1' });
    expect(up).toHaveAttribute('aria-pressed', 'true');
    expect(down).toHaveAttribute('aria-pressed', 'false');
  });

  it('menandai downvote aktif bila user sudah downvote', () => {
    const { up, down } = setup({ authUserId: 'u3' });
    expect(down).toHaveAttribute('aria-pressed', 'true');
    expect(up).toHaveAttribute('aria-pressed', 'false');
  });

  it('tidak ada tombol aktif untuk user yang belum login', () => {
    const { up, down } = setup({ authUserId: undefined });
    expect(up).toHaveAttribute('aria-pressed', 'false');
    expect(down).toHaveAttribute('aria-pressed', 'false');
  });

  it('memanggil onVote sesuai tombol yang diklik', async () => {
    const { onVote, up, down } = setup();
    await userEvent.click(up);
    await userEvent.click(down);
    expect(onVote).toHaveBeenNthCalledWith(1, 'up');
    expect(onVote).toHaveBeenNthCalledWith(2, 'down');
  });
});
