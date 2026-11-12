// Stub API forum agar E2E deterministik dan tidak bergantung pada server eksternal.
const API = 'https://forum-api.dicoding.dev/v1';

Cypress.Commands.add('stubForumApi', () => {
  cy.intercept('GET', `${API}/users`, {
    body: { status: 'success', message: 'ok', data: { users: [{ id: 'user-1', name: 'Budi', avatar: '' }] } },
  });
  cy.intercept('GET', `${API}/threads`, {
    body: {
      status: 'success',
      message: 'ok',
      data: {
        threads: [{
          id: 'thread-1',
          title: 'Thread E2E',
          body: '<p>Isi thread</p>',
          category: 'umum',
          createdAt: '2024-01-01T00:00:00.000Z',
          ownerId: 'user-1',
          owner: { id: 'user-1', name: 'Budi', avatar: '' },
          totalComments: 0,
          upVotesBy: [],
          downVotesBy: [],
        }],
      },
    },
  });
  cy.intercept('GET', `${API}/users/me`, (req) => {
    if (req.headers.authorization === 'Bearer token-e2e') {
      req.reply({
        body: {
          status: 'success',
          message: 'ok',
          data: {
            user: {
              id: 'user-1', name: 'Budi', email: 'budi@mail.com', avatar: '',
            },
          },
        },
      });
    } else {
      req.reply({ statusCode: 401, body: { status: 'fail', message: 'Missing authentication' } });
    }
  });
});
