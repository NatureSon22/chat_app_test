import Avatar from "./Avatar";

const urlPattern = /^http.*\.gif$/i;
const MessageList = ({ messages, messageListRef, userId, userTyping }) => {
  const checkUrl = (message) => {
    return urlPattern.test(message);
  };

  return (
    <div
      className="max-h-[95vh] flex-grow overflow-y-auto px-5 py-7 pb-32"
      ref={messageListRef}
    >
      <ul className="flex flex-col gap-10 overflow-auto text-white">
        {messages.map((item, index) => {
          return item.userId != userId ? (
            <li
              className="flex w-fit max-w-[70%] flex-row-reverse items-start gap-5"
              key={index}
            >
              <div className="space-y-2">
                <p className="text-xs text-white/50">{item.userId}</p>
                {checkUrl(item.message) ? (
                  <img className="rounded-md" src={item.message} alt="" />
                ) : (
                  <p className="rounded-md bg-primary-clr p-4">
                    {item.message}
                  </p>
                )}
              </div>
              <Avatar avatarUrl={item.userAvatar}></Avatar>
            </li>
          ) : (
            <li
              className="ml-auto flex w-fit max-w-[70%] items-start gap-5"
              key={index}
            >
              <div className="space-y-2">
                <p className="text-xs text-white/50">You</p>
                {checkUrl(item.message) ? (
                  <img className="rounded-md" src={item.message} alt="" />
                ) : (
                  <p className="rounded-md bg-accent-clr p-4">{item.message}</p>
                )}
              </div>
              <Avatar avatarUrl={item.userAvatar}></Avatar>
            </li>
          );
        })}

        {userTyping.filter((user) => user.userId != userId).length > 0 &&
          userTyping
            .filter((user) => user.userId != userId)
            .map((user) => {
              return (
                <div key={user.userId} className="flex items-center gap-14">
                  <Avatar avatarUrl={user.userAvatar}></Avatar>
                  <div className="relative h-10">
                    <span className="loader absolute"></span>
                  </div>
                </div>
              );
            })}
      </ul>
    </div>
  );
};

export default MessageList;
