import React, { useRef } from "react";

const Avatar = ({ avatarUrl }) => {
  return (
    <div className="grid min-w-fit mt-5 place-items-center rounded-full border border-white/50">
      <img
        src={avatarUrl}
        alt="Avatar"
        width="50"
        height="50"
        className="rounded-full"
      />
    </div>
  );
};

export default Avatar;
