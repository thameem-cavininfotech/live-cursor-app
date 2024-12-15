import http from "http";
import { WebSocketServer } from "ws";
import url from "url";
import { v4 as uuidv4 } from "uuid";

const server = http.createServer();
const wsSever = new WebSocketServer({ server });

const PORT = 8000;

const connections = {};
const users = {};
console.warn("users", users);
console.warn("connections", connections);

const broadcast = () => {
  Object.keys(connections).forEach((userId) => {
    const connection = connections[userId];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessage = (bytes, userId) => {
  // message = {"x":0,"y":100}
  //user
  //user.state.x = message.x;
  //user.state.y = message.y;
  //user.username
  //user.state = message;
  //  BASICALLY UPDATE ON THE USERS STATE VALUE
  const message = JSON.parse(bytes.toString());
  console.log("bytes", bytes); //bytes <Buffer 7b 22 78 22 3a 30 2c 22 79 22 3a 31 30 30 7d>
  const user = users[userId];
  user.state = message;
  console.log("message", message);
  console.log("user", user);
  console.log(
    `${user.username} updated their state: ${JSON.stringify(user.state)}`
  );
  broadcast();
};
const handleClose = (userId) => {
  delete users[userId];
  delete connections[userId];
  console.log(`${users[userId].username} disconnected.`);
  broadcast();
};
wsSever.on("connection", (connection, request) => {
  //ws://localhost:8000?username=Alex //ws://127.0.0.1:8000?username=Alex
  const { username } = url.parse(request.url, true).query;
  const userId = uuidv4();
  console.log("username", username);
  console.log("userId", userId);

  connections[userId] = connection;
  users[userId] = {
    username,
    state: {},
  };

  connection.on("message", (message) => handleMessage(message, userId));
  connection.on("close", () => handleClose(userId));
});
server.listen(PORT, () => {
  console.log(`Websocket server is running on ${PORT}`);
});
