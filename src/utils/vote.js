export function getVote(item, userId) {
  if (!userId) return 'none';
  if (item.upVotesBy.includes(userId)) return 'up';
  if (item.downVotesBy.includes(userId)) return 'down';
  return 'none';
}

export function applyVote(item, userId, vote) {
  const upVotesBy = item.upVotesBy.filter((id) => id !== userId);
  const downVotesBy = item.downVotesBy.filter((id) => id !== userId);
  if (vote === 'up') upVotesBy.push(userId);
  if (vote === 'down') downVotesBy.push(userId);
  return { upVotesBy, downVotesBy };
}
