import { useEffect, useRef, useState } from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";

const App = () => {
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef(null);
  const wsRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [userTyping, setUserTyping] = useState([]);
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    const randomId = Math.random().toString(36).slice(2);
    setUserId(randomId);

    const seedRef = Math.random().toString(36).substring(2, 15);
    const avatarUrl = `https://api.dicebear.com/8.x/lorelei/svg?seed=${seedRef}`;
    setUserAvatar(avatarUrl);
  }, []);

  useEffect(() => {
    // Initialize WebSocket connection
    wsRef.current = new WebSocket("ws://localhost:3000");

    // Handle incoming WebSocket messages
    wsRef.current.onmessage = async (event) => {
      // Convert Blob data to text
      const data = await event.data.text();
      const parsedData = JSON.parse(data);
      if (parsedData?.eventType === "message") {
        setMessages((prevMessages) => [...prevMessages, parsedData]);
      } else if (parsedData?.eventType === "typing") {
        setUserTyping((prevUsers) => {
          // Create a copy of prevUsers to avoid mutation
          let userExists = false;
          const updatedUsers = prevUsers.map((user) => {
            if (user.userId === parsedData.userId) {
              userExists = true;
              return { ...user, remove: parsedData.remove };
            }
            return user;
          });

          // If user does not exist, add the new user
          if (!userExists) {
            updatedUsers.push(parsedData);
          }

          // Filter users based on the updated "remove" field
          return updatedUsers.filter((user) => !user.remove);
        });
      }
    };

    return () => {
      wsRef.current.close();
    };
  }, []);

  useEffect(() => {
    slideEnd();
  }, [messages, userTyping]);

  const slideEnd = () => {
    // Scroll to the bottom of the message list for the latest message
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col place-items-center overflow-hidden bg-primary-clr p-5">
      <div className="relative flex w-full max-w-[60em] flex-1 flex-col justify-between rounded-md bg-secondary-clr font-inter">
        <MessageList
          messages={messages}
          messageListRef={messageListRef}
          userId={userId}
          userTyping={userTyping}
        />
        <MessageInput
          slideEnd={slideEnd}
          wsRef={wsRef}
          userId={userId}
          userAvatar={userAvatar}
        />
      </div>
    </div>
  );
};

export default App;
