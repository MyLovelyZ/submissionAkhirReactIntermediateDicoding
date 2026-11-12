import VoteButtons from '../components/VoteButtons';

export default {
  title: 'Components/VoteButtons',
  component: VoteButtons,
  args: {
    upVotesBy: ['u1', 'u2'],
    downVotesBy: ['u3'],
    authUserId: 'u9',
  },
};

export const Default = {};

export const UpVoted = { args: { authUserId: 'u1' } };

export const DownVoted = { args: { authUserId: 'u3' } };

export const LoggedOut = { args: { authUserId: undefined } };
