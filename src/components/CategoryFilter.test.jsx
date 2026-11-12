import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  describe, expect, it, vi,
} from 'vitest';
import CategoryFilter from './CategoryFilter';

/**
 * Skenario pengujian CategoryFilter:
 * - tidak merender apa pun bila tidak ada kategori.
 * - merender satu chip per kategori.
 * - hanya chip kategori terpilih yang aria-pressed.
 * - memanggil onSelect dengan nama kategori saat chip diklik.
 */
describe('CategoryFilter', () => {
  it('tidak merender apa pun tanpa kategori', () => {
    const { container } = render(<CategoryFilter categories={[]} selected="" onSelect={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('merender chip untuk setiap kategori', () => {
    render(<CategoryFilter categories={['react', 'redux']} selected="" onSelect={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '#react' })).toBeInTheDocument();
  });

  it('menandai kategori terpilih', () => {
    render(<CategoryFilter categories={['react', 'redux']} selected="redux" onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: '#redux' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '#react' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('memanggil onSelect saat chip diklik', async () => {
    const onSelect = vi.fn();
    render(<CategoryFilter categories={['react']} selected="" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: '#react' }));
    expect(onSelect).toHaveBeenCalledWith('react');
  });
});
