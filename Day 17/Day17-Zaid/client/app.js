const socket = io("http://localhost:3000");

const authContainer = document.getElementById("auth-container");
const chatContainer = document.getElementById("chat-container");
const authForm = document.getElementById("auth-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const userList = document.getElementById("user-list");
const messages = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

let currentUserId = null;

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    // Try to login first
    let res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      // If login fails, try to register
      res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    }

    const { token } = await res.json();
    localStorage.setItem("token", token);

    // Decode token to get user ID
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    currentUserId = decodedToken.user.id;

    authContainer.style.display = "none";
    chatContainer.style.display = "flex";

    socket.emit("join", currentUserId);
  } catch (err) {
    console.error("Authentication failed", err);
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = messageInput.value;
  if (content) {
    const msg = { senderId: currentUserId, content, timestamp: new Date() };
    socket.emit("sendMessage", msg);
    messageInput.value = "";
  }
});

socket.on("receiveMessage", (msg) => {
  displayMessage(msg);
});

socket.on("userStatus", (status) => {
  updateUserStatus(status);
});

function displayMessage(msg) {
  const div = document.createElement("div");
  div.textContent = `${new Date(msg.timestamp).toLocaleTimeString()} - ${
    msg.content
  }`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function updateUserStatus({ userId, status }) {
  let userItem = document.getElementById(`user-${userId}`);
  if (!userItem) {
    userItem = document.createElement("li");
    userItem.id = `user-${userId}`;
    userList.appendChild(userItem);
  }
  userItem.innerHTML = `<span class="user-status ${status}"></span> ${userId}`;
}
