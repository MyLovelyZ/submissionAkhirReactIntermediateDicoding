import ThreadItem from '../components/ThreadItem';

export default {
  title: 'Components/ThreadItem',
  component: ThreadItem,
  args: {
    authUserId: 'u1',
    thread: {
      id: 'thread-1',
      title: 'Bagaimana cara memakai Redux Toolkit dengan benar?',
      body: '<p>Saya baru belajar <b>Redux Toolkit</b> dan bingung memisahkan slice.</p>',
      category: 'redux',
      createdAt: '2024-05-01T08:00:00.000Z',
      totalComments: 4,
      upVotesBy: ['u1', 'u2'],
      downVotesBy: [],
      owner: { id: 'u2', name: 'Siti Aminah', avatar: '' },
    },
  },
};

export const Default = {};

export const NoComments = {
  args: {
    thread: {
      id: 'thread-2',
      title: 'Thread tanpa komentar',
      body: '<p>Belum ada yang membalas.</p>',
      category: 'umum',
      createdAt: '2024-05-02T08:00:00.000Z',
      totalComments: 0,
      upVotesBy: [],
      downVotesBy: ['u1'],
      owner: { id: 'u3', name: 'Budi', avatar: '' },
    },
  },
};
