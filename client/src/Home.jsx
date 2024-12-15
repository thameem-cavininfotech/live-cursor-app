import React, { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Cursor } from "./components/Cursor.jsx";

const renderCursor = (users) => {
  return Object.keys(users).map((userId) => {
    const user = users[userId];
    console.log("[user.state.x, user.state.y]", [user.state.x, user.state.y]);
    return <Cursor key={userId} point={[user.state.x, user.state.y]} />;
  });
};
const renderUserList = (users) => {
  return (
    <ul>
      {Object.keys(users).map((userId) => {
        return <li key={userId}>{JSON.stringify(users[userId])}</li>;
      })}
    </ul>
  );
};
export default function Home({ username }) {
  const WS_URL = "ws://127.0.0.1:8000";

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });
  const THROTTLE = 50;
  const sendJsonMessageThrottle = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    sendJsonMessage({
      x: 0,
      y: 0,
    });
    window.addEventListener("mousemove", (e) => {
      sendJsonMessageThrottle.current({
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, []);
  // console.log("sendJsonMessage",sendJsonMessage);
  if (lastJsonMessage) {
    return (
      <>
        {renderCursor(lastJsonMessage)}
        {renderUserList(lastJsonMessage)}
      </>
    );
  }
  return <div>{` Hello, ${username}`}</div>;
}
