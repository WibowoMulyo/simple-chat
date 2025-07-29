"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import chatData from "../data/chat.json";
import type { ChatMessage as ChatMessageType } from "../types/chat";

const ChatRoom = () => {
  const room = chatData.results[0].room;

  const loadMessages = () => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : chatData.results[0].comments;
  };

  const [messages, setMessages] = useState<ChatMessageType[]>(loadMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");

  const getParticipantInfo = (senderId: string) => {
    return room.participant.find((p) => p.id === senderId);
  };

  const isCurrentUser = (senderId: string) => {
    const participant = getParticipantInfo(senderId);
    return participant?.role === 2;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getOnlineStatus = () => {
    const onlineCount = room.participant.length;
    return `${onlineCount} participants`;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const customerParticipant = room.participant.find((p) => p.role === 2);
      const newMsg: ChatMessageType = {
        id: Date.now(),
        sender: customerParticipant?.id || "customer@mail.com",
        message: newMessage.trim(),
        type: "text" as const,
      };

      setMessages((prevMessages: ChatMessageType[]) => {
        const updatedMessages = [...prevMessages, newMsg];

        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

        const updatedChatData = {
          ...chatData,
          results: [
            {
              ...chatData.results[0],
              comments: updatedMessages,
            },
          ],
        };

        console.log(
          "Updated chat data (saved to localStorage):",
          updatedChatData
        );

        return updatedMessages;
      });

      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={room.image_url || "/placeholder.svg"}
              alt={room.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 text-lg">{room.name}</h2>
            <p className="text-sm text-gray-500">{getOnlineStatus()}</p>
          </div>

          <div className="flex gap-2">
            <button className="p-2 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button className="p-2 bg-green-50 hover:bg-green-100 rounded-full transition-colors">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((msg: ChatMessageType) => {
          const allowedTypes = ["text", "image", "video", "pdf"] as const;
          type AllowedType = (typeof allowedTypes)[number];
          const type: AllowedType = allowedTypes.includes(
            msg.type as AllowedType
          )
            ? (msg.type as AllowedType)
            : "text";

          const participantInfo = getParticipantInfo(msg.sender);

          return (
            <ChatMessage
              key={msg.id}
              sender={msg.sender}
              message={msg.message}
              type={type}
              isCurrentUser={isCurrentUser(msg.sender)}
              senderName={participantInfo?.name}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2 border border-gray-200">
          <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-white rounded-full border-2 border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 text-gray-900 font-medium"
              onKeyPress={(e) => {
                if (e.key === "Enter" && newMessage.trim()) {
                  sendMessage();
                }
              }}
            />
          </div>

          <button
            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            disabled={!newMessage.trim()}
            onClick={() => {
              sendMessage();
            }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
