import React, { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from 'lodash.throttle';
export default function Home({ username }) {
  const WS_URL = "ws://127.0.0.1:8000"

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });
  const THROTTLE = 50;
  const sendJsonMessageThrottle = useRef(throttle(sendJsonMessage,THROTTLE))
  useEffect(()=>{
   window.addEventListener("mousemove",e=>{
    sendJsonMessageThrottle.current({
      x:e.clientX,
      y:e.clientY
    })
   })
  },[])
  // console.log("sendJsonMessage",sendJsonMessage);
  return <div>{` Hello, ${username}`}</div>;
}

