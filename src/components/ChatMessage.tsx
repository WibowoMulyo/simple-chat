"use client";

import { useState } from "react";

type ChatMessageProps = {
  sender: string;
  message: string;
  type: "text" | "image" | "video" | "pdf";
  isCurrentUser?: boolean;
  senderName?: string;
  timestamp?: string;
};

const ChatMessage = ({
  sender,
  message,
  type,
  isCurrentUser = false,
  senderName,
  timestamp,
}: ChatMessageProps) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const youtubeRegex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  const isYouTubeUrl = (url: string) => {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  };

  return (
    <div
      className={`flex gap-2 mb-4 ${
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isCurrentUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {getInitials(senderName || sender)}
          </div>
        </div>
      )}

      <div
        className={`flex flex-col max-w-[70%] sm:max-w-[60%] ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        {!isCurrentUser && (
          <p className="text-xs text-gray-600 mb-1 px-1 font-medium">
            {senderName || sender}
          </p>
        )}

        <div
          className={`rounded-2xl px-4 py-2 shadow-sm ${
            isCurrentUser
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
          }`}
        >
          {type === "text" && (
            <p className="text-sm leading-relaxed break-words">{message}</p>
          )}

          {type === "image" && (
            <div className="rounded-lg overflow-hidden">
              {!imageError ? (
                <img
                  src={message || "/placeholder.svg"}
                  alt="Shared image"
                  className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onError={() => setImageError(true)}
                  onClick={() => window.open(message, "_blank")}
                />
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="text-gray-400 mb-2">🖼️</div>
                  <p className="text-xs text-gray-500">Image unavailable</p>
                </div>
              )}
            </div>
          )}

          {type === "video" && (
            <div className="rounded-lg overflow-hidden">
              {isYouTubeUrl(message) ? (
                <iframe
                  src={getYouTubeEmbedUrl(message) || message}
                  className="w-full h-48 rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video"
                ></iframe>
              ) : (
                <video
                  controls
                  className="max-w-full h-auto rounded-lg"
                  preload="metadata"
                >
                  <source src={message} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {type === "pdf" && (
            <a
              href={message}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                isCurrentUser
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="text-red-500 text-lg">📄</div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isCurrentUser ? "text-white" : "text-gray-800"
                  }`}
                >
                  PDF Document
                </p>
                <p
                  className={`text-xs ${
                    isCurrentUser ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  Click to view
                </p>
              </div>
            </a>
          )}
        </div>

        <p
          className={`text-xs text-gray-400 mt-1 px-1 ${
            isCurrentUser ? "text-right" : "text-left"
          }`}
        >
          {timestamp || formatTime()}
        </p>
      </div>

      {isCurrentUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {getInitials(senderName || "You")}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
