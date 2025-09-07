import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import ChatContext from "../../context/ChatCreateContext";
import AuthContext from "../../context/AuthCreateContext";

const RightSidebar = () => {

  const {selectedUser , messages} = useContext(ChatContext);
  const {logout, onlineUsers} = useContext(AuthContext);
  const [msgImages,setMsgImages] =  useState([]);

  //Get all the images from the messages and set them to state
  useEffect(()=>{
    let ans = messages.filter(msg=>msg.image).map(msg=>msg.image);
    console.log(ans);
    setMsgImages(ans);
    console.log(msgImages);
  },[messages])

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="ProfilePhoto"
            className="w-20 aspect-[1/1] scale-125 border-white border-2 mb-3 rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUsers.includes(selectedUser._id) && <p className="w-2 h-2 rounded-full bg-green-500"></p>}
            {selectedUser?.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>
        <hr className="border-[#ffffff50] my-4" />
        <div className="px-5 text-xs">
          <p className="text-center">Media</p>
          <div className="mt-2 max-h-[215px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full rounded-md border-2 border-white"
                />
              </div>
            ))}
          </div>
        </div>

        <button onClick={()=>logout()} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm from-light py-2 px-20 rounded-full cursor-pointer">
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
