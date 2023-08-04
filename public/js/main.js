const socket = io();

const chatForm = document.getElementById("chat-form");

const chatContainer = document.querySelector(".chat-messages");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// JOIN CHATROOM

socket.emit("joinRoom", { username, room });

// MESSAGE FORM SERVER
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
});

socket.on("roomInfo", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = " ";
});

const outputMessage = (message) => {
  const html = `<div class="message">
  <p class="meta">${message.user} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>
</div>`;
  chatContainer.insertAdjacentHTML("beforeend", html);
  chatContainer.scrollTop = chatContainer.scrollHeight;
};

const outputRoomName = (room) => {
  const roomName = document.getElementById("room-name");
  roomName.innerText = room;
};
const outputUsers = (users) => {
  const userList = document.getElementById("users");
  const html = users.map((user) => `<li>${user.username}</li>`).join(" ");
  console.log("111", html);
  userList.innerHTML = `${html}`;
};
