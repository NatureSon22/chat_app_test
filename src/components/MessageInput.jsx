import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import GifPicker from "gif-picker-react";
import { useState, useRef } from "react";

const MessageInput = ({ slideEnd, wsRef, userId, userAvatar }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGIF, setShowGIF] = useState(false);
  const [gif, setGif] = useState("");
  const textareaRef = useRef(null);

  const sendTypingStatus = (isTyping) => {
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          eventType: "typing",
          userId: userId,
          remove: !isTyping,
          userAvatar: userAvatar,
        }),
      );
    }
  };

  const handleSetMessage = (input) => {
    setMessage(input);
    sendTypingStatus(!!input.length);
  };

  const handleSendMessage = (imgUrl = "") => {
    const trimmedMessage = imgUrl || message.trim();
    if (!trimmedMessage) return;

    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          eventType: "message",
          message: trimmedMessage,
          userId: userId,
          userAvatar: userAvatar,
        }),
      );
      sendTypingStatus(false);
    }

    setMessage("");
    setGif("");
    slideEnd();
  };

  const appendEmoji = (emoji) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const newMessage =
      message.slice(0, cursorPosition) +
      emoji.native +
      message.slice(cursorPosition);
    setMessage(newMessage);
    sendTypingStatus(!!newMessage.length);
  };

  const onGifSelect = (gif) => {
    console.log(gif);
    setGif(gif.url);
    handleSendMessage(gif.url);
    setShowGIF(false);
  };

  return (
    <div className="absolute bottom-0 left-0 flex w-full items-center gap-5 border-t-2 border-primary-clr bg-secondary-clr p-4">
      <div className="relative">
        <button
          className="cursor-pointer rounded-md bg-primary-clr/50 p-3"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowGIF(false);
          }}
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute -top-[29em] z-10">
            <Picker
              data={data}
              onEmojiSelect={(e) => {
                appendEmoji(e);
                setShowEmojiPicker(false);
                setShowGIF(false);
              }}
            />
          </div>
        )}
      </div>

      <div className="relative">
        <button
          className="cursor-pointer rounded-md bg-primary-clr/50 p-3 font-bold text-white"
          onClick={() => {
            setShowGIF(!showGIF);
            setShowEmojiPicker(false);
          }}
        >
          GIF
        </button>

        {showGIF && (
          <div className="absolute -top-[30em]">
            <GifPicker
              onGifClick={onGifSelect}
              tenorApiKey={import.meta.env.VITE_TENOR_API_KEY}
            />
          </div>
        )}
      </div>

      {gif && <img src={gif} alt="Selected GIF" width="50" height="50" />}

      <textarea
        ref={textareaRef}
        className="flex-1 resize-none bg-primary-clr p-2 text-white"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => handleSetMessage(e.target.value)}
      ></textarea>
      <button
        className="cursor-pointer rounded-md bg-accent-clr px-7 py-4 text-white"
        onClick={() => handleSendMessage()}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
