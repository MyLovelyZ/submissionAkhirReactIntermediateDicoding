# Warung Diskusi

Aplikasi forum diskusi berbasis React + Redux yang memakai [Dicoding Forum API](https://forum-api.dicoding.dev/v1/).

## Menjalankan

```bash
npm install
npm run dev      # development
npm run lint     # ESLint (Airbnb), tanpa error
npm run build    # build produksi
```

## Catatan untuk Reviewer

**Kriteria utama**
- **Fungsionalitas:** register, login, daftar thread, detail thread + komentar, buat thread, buat komentar, dan loading indicator (progress bar di atas halaman + spinner).
- **Otorisasi:** thread dapat dilihat tanpa login. Membuat thread/komentar dan vote mewajibkan login. Halaman `/new` hanya bisa diakses setelah login.
- **ESLint:** konfigurasi di `.eslintrc.cjs` dengan Airbnb JavaScript Style Guide (`airbnb`, `airbnb/hooks`). `npm run lint` tidak menampilkan error.
- **Strict Mode:** `<StrictMode>` dipasang di `src/main.jsx`.
- **Arsitektur:**
  - `src/states/` : seluruh Redux state, reducer, dan thunk (kode state terpisah dari UI).
  - `src/api/` : satu-satunya tempat pemanggilan REST API.
  - `src/components/` : komponen presentasional yang reusable (mis. `VoteButtons`, `UserBadge`, `Avatar`).
  - `src/pages/` : container yang menghubungkan komponen dengan store.
  - Tidak ada pemanggilan REST API di dalam efek komponen. Efek hanya men-dispatch thunk.
  - State dari API disimpan di Redux. Hanya input form (controlled component) yang mengelola state sendiri.

**Saran tambahan yang diterapkan**
1. **Vote** pada thread dan komentar (up/down, klik ulang untuk membatalkan). Tombol berwarna saat sudah di-vote, jumlah suara tampil, dan memakai *optimistic update* (dikembalikan otomatis bila request gagal).
2. **Leaderboard** di `/leaderboards`: nama, avatar, dan skor.
3. **Filter kategori** di beranda (chip kategori atau klik label kategori pada thread), murni di sisi front-end.

**Hal lain**
- Body thread/komentar dari API berupa HTML, sehingga disanitasi dengan DOMPurify sebelum dirender (satu-satunya penggunaan `dangerouslySetInnerHTML`, di `HtmlContent.jsx`, dengan komentar `eslint-disable` yang dijelaskan alasannya).
- Token disimpan di `localStorage`; sesi dipulihkan saat aplikasi dimuat.
- Mendukung tema terang/gelap otomatis dan tampilan ponsel.

## Testing, CI/CD, dan Ecosystem (Submission Akhir)

| Perintah | Fungsi |
| --- | --- |
| `npm test` | Unit & component test (Vitest + React Testing Library), 73 tes |
| `npm run e2e` | Build, jalankan `vite preview`, lalu E2E Cypress (alur login) |
| `npm run storybook` | Katalog komponen (Storybook) |

- **Reducer** (`src/states/*.reducer.test.js`): threads, threadDetail, authUser, loading, + util vote.
- **Thunk** (`src/states/*.thunk.test.js`): auth (login/register/preload/logout), threads (populate/create/vote optimistic + rollback), threadDetail (get/komentar/vote komentar). API dimock, state diverifikasi lewat store nyata.
- **Component** (`src/components/*.test.jsx`): VoteButtons, LoginInput, CategoryFilter, CommentInput, ThreadItem.
- **E2E** (`cypress/e2e/login.cy.js`): alur login. Response API di-stub (`cy.intercept`) agar deterministik.
- **React Ecosystem**: Storybook (`src/stories/`, 3 komponen, 8 story).
- **CI**: `.github/workflows/ci.yml` (GitHub Actions) menjalankan lint, `npm test`, dan `npm run e2e` pada push/PR ke `main`.
- **CD**: Vercel terhubung ke repository GitHub; `vercel.json` menangani SPA rewrite.
- Tiap berkas tes memuat daftar skenario pengujian di komentar bagian atas.

### Catatan manual (dilakukan di GitHub/Vercel)
URL Vercel: https://submission-akhir-react-intermediate.vercel.app/. Screenshot bukti ada di folder `screenshots/`
(`1_ci_check_error`, `2_ci_check_pass`, `3_branch_protection`).
