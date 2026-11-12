import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  describe, expect, it, vi,
} from 'vitest';
import ThreadItem from './ThreadItem';

/**
 * Skenario pengujian ThreadItem:
 * - menampilkan judul (tautan ke detail), kategori, cuplikan teks tanpa HTML, dan jumlah komentar.
 * - memanggil onSelectCategory dengan kategori thread saat label kategori diklik.
 * - memanggil onVote dengan id thread dan jenis vote saat tombol vote diklik.
 */
describe('ThreadItem', () => {
  const thread = {
    id: 'thread-1',
    title: 'Belajar Redux Toolkit',
    body: '<p>Isi <b>thread</b> pertama</p>',
    category: 'redux',
    createdAt: '2024-01-01T00:00:00.000Z',
    totalComments: 3,
    upVotesBy: ['u1'],
    downVotesBy: [],
    owner: { id: 'u2', name: 'Siti', avatar: 'https://example.com/a.png' },
  };

  const setup = () => {
    const onVote = vi.fn();
    const onSelectCategory = vi.fn();
    render(
      <MemoryRouter>
        <ThreadItem
          thread={thread}
          authUserId="u1"
          onVote={onVote}
          onSelectCategory={onSelectCategory}
        />
      </MemoryRouter>,
    );
    return { onVote, onSelectCategory };
  };

  it('menampilkan informasi thread', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Belajar Redux Toolkit' })).toHaveAttribute('href', '/threads/thread-1');
    expect(screen.getByRole('button', { name: '#redux' })).toBeInTheDocument();
    expect(screen.getByText('Isi thread pertama')).toBeInTheDocument();
    expect(screen.getByText(/3 komentar/)).toBeInTheDocument();
    expect(screen.getByText('Siti')).toBeInTheDocument();
  });

  it('memilih kategori saat label diklik', async () => {
    const { onSelectCategory } = setup();
    await userEvent.click(screen.getByRole('button', { name: '#redux' }));
    expect(onSelectCategory).toHaveBeenCalledWith('redux');
  });

  it('memanggil onVote dengan id thread', async () => {
    const { onVote } = setup();
    await userEvent.click(screen.getByRole('button', { name: /downvote/i }));
    expect(onVote).toHaveBeenCalledWith('thread-1', 'down');
  });
});
