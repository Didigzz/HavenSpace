"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  Image,
  Smile,
  ChevronLeft,
  MessageSquare,
  Circle,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import { Button } from "@havenspace/shared/ui";
import { Input } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import { Separator } from "@havenspace/shared/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials, formatDateTime } from "@/lib/utils";

// Mock conversations data
const mockConversations = [
  {
    id: "1",
    name: "John Santos",
    property: "Sunrise Dormitory",
    avatar: "/avatars/john.jpg",
    lastMessage: "Your payment has been received. Thank you!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Maria Garcia",
    property: "Green Valley Boarding House",
    avatar: "/avatars/maria.jpg",
    lastMessage: "The room is ready for your viewing tomorrow at 2 PM.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unread: 1,
    online: true,
  },
  {
    id: "3",
    name: "Haven Space Support",
    property: "Customer Support",
    avatar: "/avatars/support.jpg",
    lastMessage: "Welcome to Haven Space! Let us know if you need any help.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "Pedro Reyes",
    property: "Metro Boarding House",
    avatar: "/avatars/pedro.jpg",
    lastMessage: "Sure, I can arrange a visit next week.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Ana Cruz",
    property: "University Residence",
    avatar: "/avatars/ana.jpg",
    lastMessage: "The wifi password has been updated.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    unread: 0,
    online: true,
  },
];

// Mock messages data
const mockMessages: Record<
  string,
  Array<{
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    status: "sent" | "delivered" | "read";
  }>
> = {
  "1": [
    {
      id: "m1",
      senderId: "landlord",
      content: "Hello! Welcome to Sunrise Dormitory. How can I help you?",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      status: "read",
    },
    {
      id: "m2",
      senderId: "me",
      content: "Hi! I'd like to inquire about the available rooms.",
      timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000),
      status: "read",
    },
    {
      id: "m3",
      senderId: "landlord",
      content:
        "We have a few rooms available starting next month. Would you like to schedule a visit?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "read",
    },
    {
      id: "m4",
      senderId: "me",
      content:
        "Yes, that would be great! I've already made the booking payment.",
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
      status: "read",
    },
    {
      id: "m5",
      senderId: "landlord",
      content: "Your payment has been received. Thank you!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "read",
    },
  ],
  "2": [
    {
      id: "m1",
      senderId: "landlord",
      content: "Good day! Thank you for your interest in Green Valley.",
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
      status: "read",
    },
    {
      id: "m2",
      senderId: "me",
      content: "Hi! I saw your listing and I'm interested in viewing the room.",
      timestamp: new Date(Date.now() - 70 * 60 * 60 * 1000),
      status: "read",
    },
    {
      id: "m3",
      senderId: "landlord",
      content: "The room is ready for your viewing tomorrow at 2 PM.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: "read",
    },
  ],
  "3": [
    {
      id: "m1",
      senderId: "landlord",
      content: "Welcome to Haven Space! Let us know if you need any help.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "read",
    },
  ],
};

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = mockConversations.find(
    (c) => c.id === selectedConversation
  );
  const messages = selectedConversation
    ? mockMessages[selectedConversation] || []
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In a real app, this would send the message to the backend
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    setShowMobileList(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getStatusIcon = (status: "sent" | "delivered" | "read") => {
    switch (status) {
      case "sent":
        return <Check className="text-muted-foreground h-3 w-3" />;
      case "delivered":
        return <CheckCheck className="text-muted-foreground h-3 w-3" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full">
        <div className="flex h-full">
          {/* Conversations List */}
          <div
            className={cn(
              "flex w-full flex-col border-r md:w-80 lg:w-96",
              !showMobileList && "hidden md:flex"
            )}
          >
            <div className="border-b p-4">
              <h2 className="mb-3 text-lg font-semibold">Messages</h2>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredConversations.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center">
                  No conversations found
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={cn(
                        "hover:bg-accent w-full p-4 text-left transition-colors",
                        selectedConversation === conv.id && "bg-accent"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conv.avatar} />
                            <AvatarFallback>
                              {getInitials(conv.name)}
                            </AvatarFallback>
                          </Avatar>
                          {conv.online && (
                            <Circle className="absolute right-0 bottom-0 h-3 w-3 fill-green-500 text-green-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="truncate font-medium">
                              {conv.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {formatTime(conv.timestamp)}
                            </span>
                          </div>
                          <p className="text-muted-foreground truncate text-xs">
                            {conv.property}
                          </p>
                          <p className="text-muted-foreground mt-1 truncate text-sm">
                            {conv.lastMessage}
                          </p>
                        </div>
                        {conv.unread > 0 && (
                          <Badge className="ml-2 flex h-5 min-w-5 items-center justify-center">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              "flex flex-1 flex-col",
              showMobileList && "hidden md:flex"
            )}
          >
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setShowMobileList(true)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConv.avatar} />
                      <AvatarFallback>
                        {getInitials(selectedConv.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedConv.name}</h3>
                      <p className="text-muted-foreground flex items-center gap-1 text-xs">
                        {selectedConv.online ? (
                          <>
                            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                            Online
                          </>
                        ) : (
                          "Offline"
                        )}
                        <span className="mx-1">•</span>
                        {selectedConv.property}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Info className="mr-2 h-4 w-4" />
                          View Property
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Search className="mr-2 h-4 w-4" />
                          Search in Chat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Delete Conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isMe = message.senderId === "me";
                      const prevMessage = messages[index - 1];
                      const showDate =
                        index === 0 ||
                        !prevMessage ||
                        new Date(message.timestamp).toDateString() !==
                          new Date(prevMessage.timestamp).toDateString();

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="my-4 flex justify-center">
                              <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-xs">
                                {new Date(message.timestamp).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                          <div
                            className={cn(
                              "flex items-end gap-2",
                              isMe && "flex-row-reverse"
                            )}
                          >
                            {!isMe && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedConv.avatar} />
                                <AvatarFallback>
                                  {getInitials(selectedConv.name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-2",
                                isMe
                                  ? "bg-primary text-primary-foreground rounded-br-sm"
                                  : "bg-muted rounded-bl-sm"
                              )}
                            >
                              <p className="text-sm">{message.content}</p>
                              <div
                                className={cn(
                                  "mt-1 flex items-center gap-1",
                                  isMe ? "justify-end" : "justify-start"
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-xs",
                                    isMe
                                      ? "text-primary-foreground/70"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {formatTime(message.timestamp)}
                                </span>
                                {isMe && getStatusIcon(message.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Button type="button" variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon">
                      <Image className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!messageInput.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center">
                <MessageSquare className="mb-4 h-12 w-12" />
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-sm">Choose a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
