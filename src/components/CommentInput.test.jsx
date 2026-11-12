import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  describe, expect, it, vi,
} from 'vitest';
import CommentInput from './CommentInput';

/**
 * Skenario pengujian CommentInput:
 * - user belum login: menampilkan ajakan masuk dan tidak ada form.
 * - user login: tombol kirim nonaktif saat teks kosong atau hanya spasi.
 * - mengirim komentar yang sudah di-trim lewat onSubmit.
 * - mengosongkan textarea bila onSubmit berhasil (true).
 * - mempertahankan teks bila onSubmit gagal (false).
 */
describe('CommentInput', () => {
  const setup = ({ isLoggedIn = true, onSubmit = vi.fn().mockResolvedValue(true) } = {}) => {
    render(
      <MemoryRouter>
        <CommentInput isLoggedIn={isLoggedIn} onSubmit={onSubmit} />
      </MemoryRouter>,
    );
    return { onSubmit };
  };

  it('mengajak masuk bila belum login', () => {
    setup({ isLoggedIn: false });
    expect(screen.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('menonaktifkan tombol kirim untuk teks kosong', async () => {
    setup();
    const button = screen.getByRole('button', { name: 'Kirim komentar' });
    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Tulis komentar'), '   ');
    expect(button).toBeDisabled();
  });

  it('mengirim komentar yang di-trim lalu mengosongkan input', async () => {
    const { onSubmit } = setup();
    const textarea = screen.getByLabelText('Tulis komentar');
    await userEvent.type(textarea, '  Mantap!  ');
    await userEvent.click(screen.getByRole('button', { name: 'Kirim komentar' }));
    expect(onSubmit).toHaveBeenCalledWith('Mantap!');
    expect(textarea).toHaveValue('');
  });

  it('mempertahankan teks bila pengiriman gagal', async () => {
    setup({ onSubmit: vi.fn().mockResolvedValue(false) });
    const textarea = screen.getByLabelText('Tulis komentar');
    await userEvent.type(textarea, 'Halo');
    await userEvent.click(screen.getByRole('button', { name: 'Kirim komentar' }));
    expect(textarea).toHaveValue('Halo');
  });
});
