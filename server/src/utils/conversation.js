export const buildConversationId = (userA, userB) => {
    const [first, second] = [userA.toString(), userB.toString()].sort();
    return `${first}:${second}`;
};
