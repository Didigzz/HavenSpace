"use client";

import * as React from "react";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
} from "lucide-react";
import { Button } from "@havenspace/ui";
import { Input } from "@havenspace/ui";
import { Badge } from "@havenspace/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@havenspace/ui";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  boarder: {
    id: string;
    name: string;
    avatar?: string;
    property: string;
    room: string;
    status: "active" | "pending" | "former";
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isFromBoarder: boolean;
  };
  unreadCount: number;
  messages: Message[];
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    boarder: {
      id: "b1",
      name: "Maria Santos",
      property: "Sunrise Residences",
      room: "Room 205",
      status: "active",
    },
    lastMessage: {
      content: "Hi! Is it possible to have the Wi-Fi password changed?",
      timestamp: "2024-01-15T10:30:00",
      isFromBoarder: true,
    },
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "b1", content: "Good morning! I have a question about the utilities.", timestamp: "2024-01-15T10:00:00", read: true },
      { id: "m2", senderId: "landlord", content: "Good morning Maria! Sure, what would you like to know?", timestamp: "2024-01-15T10:15:00", read: true },
      { id: "m3", senderId: "b1", content: "Hi! Is it possible to have the Wi-Fi password changed?", timestamp: "2024-01-15T10:30:00", read: false },
      { id: "m4", senderId: "b1", content: "I think someone else might have access to it.", timestamp: "2024-01-15T10:31:00", read: false },
    ],
  },
  {
    id: "2",
    boarder: {
      id: "b2",
      name: "Juan Dela Cruz",
      property: "Sunrise Residences",
      room: "Room 102",
      status: "pending",
    },
    lastMessage: {
      content: "Thank you! I'll prepare the deposit.",
      timestamp: "2024-01-14T16:45:00",
      isFromBoarder: true,
    },
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "b2", content: "Hi, I saw your listing. Is the room still available?", timestamp: "2024-01-14T14:00:00", read: true },
      { id: "m2", senderId: "landlord", content: "Hello Juan! Yes, Room 102 is still available. Would you like to schedule a viewing?", timestamp: "2024-01-14T14:30:00", read: true },
      { id: "m3", senderId: "b2", content: "That would be great! Can I come tomorrow afternoon?", timestamp: "2024-01-14T15:00:00", read: true },
      { id: "m4", senderId: "landlord", content: "Sure! 2 PM works for me. The deposit is ₱4,500.", timestamp: "2024-01-14T16:00:00", read: true },
      { id: "m5", senderId: "b2", content: "Thank you! I'll prepare the deposit.", timestamp: "2024-01-14T16:45:00", read: true },
    ],
  },
  {
    id: "3",
    boarder: {
      id: "b3",
      name: "Carlos Reyes",
      property: "Metro Living Spaces",
      room: "Room 401",
      status: "active",
    },
    lastMessage: {
      content: "The maintenance team will come by tomorrow at 10 AM.",
      timestamp: "2024-01-13T09:00:00",
      isFromBoarder: false,
    },
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "b3", content: "Hi, the faucet in the bathroom is leaking.", timestamp: "2024-01-12T18:00:00", read: true },
      { id: "m2", senderId: "landlord", content: "Thanks for letting me know, Carlos. I'll arrange for someone to fix it.", timestamp: "2024-01-12T19:00:00", read: true },
      { id: "m3", senderId: "landlord", content: "The maintenance team will come by tomorrow at 10 AM.", timestamp: "2024-01-13T09:00:00", read: true },
    ],
  },
  {
    id: "4",
    boarder: {
      id: "b4",
      name: "Lisa Chen",
      property: "Sunrise Residences",
      room: "Room 108",
      status: "former",
    },
    lastMessage: {
      content: "Take care and good luck with your studies!",
      timestamp: "2024-01-10T14:00:00",
      isFromBoarder: false,
    },
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "b4", content: "Hi, I wanted to thank you for everything during my stay.", timestamp: "2024-01-10T12:00:00", read: true },
      { id: "m2", senderId: "landlord", content: "Thank you Lisa! It was a pleasure having you. Your deposit will be refunded within 3 days.", timestamp: "2024-01-10T13:00:00", read: true },
      { id: "m3", senderId: "b4", content: "That's great! I really enjoyed my time here.", timestamp: "2024-01-10T13:30:00", read: true },
      { id: "m4", senderId: "landlord", content: "Take care and good luck with your studies!", timestamp: "2024-01-10T14:00:00", read: true },
    ],
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  former: "bg-gray-100 text-gray-800",
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(
    mockConversations[0] ?? null
  );
  const [newMessage, setNewMessage] = React.useState("");

  const filteredConversations = mockConversations.filter((conv) =>
    conv.boarder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.boarder.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    console.log(`Sending message to ${selectedConversation.boarder.name}: ${newMessage}`);
    setNewMessage("");
    // TODO: Implement API call to send message
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversations List */}
      <Card className="w-80 flex-shrink-0 flex flex-col">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            {totalUnread > 0 && (
              <Badge variant="destructive">{totalUnread}</Badge>
            )}
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                className={cn(
                  "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                  selectedConversation?.id === conversation.id && "bg-muted"
                )}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-semibold text-primary">
                        {conversation.boarder.name.charAt(0)}
                      </span>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{conversation.boarder.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conversation.boarder.property} • {conversation.boarder.room}
                    </p>
                    <p className={cn(
                      "text-sm truncate mt-1",
                      conversation.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {!conversation.lastMessage.isFromBoarder && "You: "}
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      {selectedConversation ? (
        <Card className="flex-1 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">
                    {selectedConversation.boarder.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{selectedConversation.boarder.name}</h3>
                    <Badge className={cn("text-xs", statusColors[selectedConversation.boarder.status])}>
                      {selectedConversation.boarder.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.boarder.property} • {selectedConversation.boarder.room}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedConversation.messages.map((message) => {
              const isFromLandlord = message.senderId === "landlord";
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isFromLandlord ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2",
                      isFromLandlord
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={cn(
                      "flex items-center justify-end gap-1 mt-1",
                      isFromLandlord ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      <span className="text-[10px]">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isFromLandlord && (
                        message.read ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="mt-4 text-lg font-semibold">No conversation selected</h3>
            <p className="text-sm text-muted-foreground">
              Select a conversation from the list to start messaging
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
