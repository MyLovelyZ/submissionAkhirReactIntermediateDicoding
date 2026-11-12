/**
 * Skenario pengujian E2E alur login:
 * - membuka halaman login dari tombol Masuk di header dan menampilkan form login.
 * - login dengan kredensial salah: tetap di halaman login dan menampilkan pesan error.
 * - login dengan kredensial benar: diarahkan ke beranda, nama user dan tombol Keluar tampil.
 * - setelah login, sesi bertahan saat halaman dimuat ulang.
 * - logout mengembalikan header ke tombol Masuk dan Daftar.
 */
const API = 'https://forum-api.dicoding.dev/v1';

describe('alur login', () => {
  beforeEach(() => {
    cy.stubForumApi();
    cy.visit('/');
  });

  it('menampilkan halaman login', () => {
    cy.contains('a', 'Masuk').click();
    cy.url().should('include', '/login');
    cy.get('#login-email').should('be.visible');
    cy.get('#login-password').should('be.visible');
  });

  it('menampilkan error bila kredensial salah', () => {
    cy.intercept('POST', `${API}/login`, {
      statusCode: 400,
      body: { status: 'fail', message: 'email or password is wrong' },
    }).as('login');

    cy.visit('/login');
    cy.get('#login-email').type('budi@mail.com');
    cy.get('#login-password').type('salah');
    cy.get('form button[type="submit"]').click();

    cy.wait('@login');
    cy.contains('email or password is wrong').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('berhasil login, bertahan setelah reload, dan bisa logout', () => {
    cy.intercept('POST', `${API}/login`, {
      body: { status: 'success', message: 'ok', data: { token: 'token-e2e' } },
    }).as('login');

    cy.visit('/login');
    cy.get('#login-email').type('budi@mail.com');
    cy.get('#login-password').type('rahasia');
    cy.get('form button[type="submit"]').click();

    cy.wait('@login');
    cy.location('pathname').should('eq', '/');
    cy.get('.header__name').should('have.text', 'Budi');
    cy.contains('button', 'Keluar').should('be.visible');
    cy.contains('Thread E2E').should('be.visible');

    cy.reload();
    cy.get('.header__name').should('have.text', 'Budi');

    cy.contains('button', 'Keluar').click();
    cy.contains('a', 'Masuk').should('be.visible');
    cy.contains('a', 'Daftar').should('be.visible');
  });
});
