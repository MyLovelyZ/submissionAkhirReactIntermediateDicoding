import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  describe, expect, it, vi,
} from 'vitest';
import LoginInput from './LoginInput';

/**
 * Skenario pengujian LoginInput:
 * - menampilkan field email, password, tombol Masuk, dan tautan ke halaman daftar.
 * - mengubah nilai input saat user mengetik.
 * - memanggil onLogin dengan email dan password yang diketik saat form dikirim.
 * - tidak memanggil onLogin bila field masih kosong (validasi required).
 */
describe('LoginInput', () => {
  const setup = () => {
    const onLogin = vi.fn();
    render(
      <MemoryRouter>
        <LoginInput onLogin={onLogin} />
      </MemoryRouter>,
    );
    return { onLogin };
  };

  it('menampilkan form login', () => {
    setup();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Daftar' })).toHaveAttribute('href', '/register');
  });

  it('menangani pengetikan email dan password', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Email'), 'budi@mail.com');
    await userEvent.type(screen.getByLabelText('Password'), 'rahasia');
    expect(screen.getByLabelText('Email')).toHaveValue('budi@mail.com');
    expect(screen.getByLabelText('Password')).toHaveValue('rahasia');
  });

  it('memanggil onLogin dengan kredensial saat form dikirim', async () => {
    const { onLogin } = setup();
    await userEvent.type(screen.getByLabelText('Email'), 'budi@mail.com');
    await userEvent.type(screen.getByLabelText('Password'), 'rahasia');
    await userEvent.click(screen.getByRole('button', { name: 'Masuk' }));
    expect(onLogin).toHaveBeenCalledWith({ email: 'budi@mail.com', password: 'rahasia' });
  });

  it('tidak mengirim form kosong', async () => {
    const { onLogin } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Masuk' }));
    expect(onLogin).not.toHaveBeenCalled();
  });
});
