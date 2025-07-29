export interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  type: "text" | "image" | "video" | "pdf";
  isCurrentUser?: boolean;
  timestamp?: Date;
}

export interface ChatRoom {
  name: string;
  participants: number;
  status: "active" | "inactive";
}

export interface ChatData {
  room: ChatRoom;
  comments: ChatMessage[];
}
