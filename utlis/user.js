const users = [];

//join user to chat

const userJoin = (Id, username, room) => {
  const user = { Id, username, room };
  users.push(user);
  return user;
};

const getCurrentUser = (id) => {
  console.log(users);
  const userm = users.find((user) => user.Id === id);
  console.log(userm);
  return userm;
};
const userLeave = (id) => {
  const index = users.findIndex((user) => user.Id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getRoomUsers = (room) => {
  const user = users.filter((user) => (room = user.room));
  console.log(users);
  return user;
};
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
