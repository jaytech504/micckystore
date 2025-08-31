'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Paperclip, Send, Mic, MoreHorizontal, ShoppingCart, Camera, Zap, CreditCard, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
// Type definitions
interface Conversation {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
  isVerified?: boolean;
  unread?: number;
  status: 'pending' | 'unread' | 'read';
}

interface Message {
  id: number;
  type: 'sent' | 'received';
  content: string;
  time: string;
  avatar?: string;
  isImageMessage?: boolean;
  image?: string;
}

interface TeamMember {
  name: string;
  email: string;
  avatar: string;
}

// Dummy data
const conversations: Conversation[] = [
  {
    id: 1,
    name: "Super Admin",
    message: "You have pending messages...",
    time: "19:48",
    avatar: "/logo.png",
    isVerified: true,
    unread: 1,
    status: "pending"
  },
  {
    id: 2,
    name: "Bright Friday",
    message: "Ok, see you later",
    time: "18:30",
    avatar: "/logo.png",
    unread: 2,
    status: "unread"
  },
  {
    id: 3,
    name: "Customer Name",
    message: "Text",
    time: "18:16",
    avatar: "/logo.png",
    status: "read"
  },
  {
    id: 4,
    name: "Emily Dorson",
    message: "Table for four, 5PM. Be there.",
    time: "17:42",
    avatar: "/logo.png",
    status: "read"
  },
  {
    id: 5,
    name: "Little Sister",
    message: "Tell mom i will be home for tea 💜",
    time: "Wed",
    avatar: "/logo.png",
    status: "read"
  },
  {
    id: 6,
    name: "Art Class",
    message: "Emily. 🔥 Editorial",
    time: "Tue",
    avatar: "/logo.png",
    status: "read"
  },
  {
    id: 7,
    name: "David Moore",
    message: "You: i don't remember anything 😂",
    time: "18:16",
    avatar: "/logo.png",
    status: "read"
  }
];

const messages: Message[] = [
  {
    id: 1,
    type: "received",
    content: "I had issues with my bank since morning. That's why I could not make the payment.",
    time: "6:38 pm",
    avatar: "/logo.png"
  },
  {
    id: 2,
    type: "received",
    content: "Don't worry about the payment will be done. So sorry for the delay, but I will pay tomorrow evening.",
    time: "6:38 pm",
    avatar: "/logo.png"
  },
  {
    id: 3,
    type: "sent",
    content: "No problem... Please, we will be expecting your payment in due time..",
    time: "19:16"
  },
  {
    id: 4,
    type: "sent",
    content: "Thank you 😊",
    time: "18:16"
  },
  {
    id: 5,
    type: "received",
    content: "4 Replies",
    time: "4:54 pm",
    isImageMessage: true,
    image: "/watch.jpg",
    avatar: "/logo.png"
  }
];

const teamMembers: TeamMember[] = [
  { name: "Josiah Onuche", email: "josiahonuche7@gmail.com", avatar: "/logo.png" },
  { name: "Chineye Deo", email: "chineyedeo7@gmail.com", avatar: "/logo.png" },
  { name: "Samuel Monday", email: "samuelmonday36@gmail.com", avatar: "/logo.png" }
];

type TabType = 'Closed' | 'Unreplied' | 'New';

export default function ChatMainSection(): React.JSX.Element {
  const [selectedTab, setSelectedTab] = useState<TabType>('New');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[1]);
  const [message, setMessage] = useState<string>('');
  const [showTeamDropdown, setShowTeamDropdown] = useState<boolean>(false);
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false); // For mobile chat view
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const teamDropdownRef = useRef<HTMLDivElement>(null);
  const attachmentDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
        setShowTeamDropdown(false);
      }
      if (attachmentDropdownRef.current && !attachmentDropdownRef.current.contains(event.target as Node)) {
        setShowAttachmentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, []);

  const handleSendMessage = (): void => {
    if (message.trim()) {
      // Here you would typically send to API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTabChange = (tab: TabType): void => {
    setSelectedTab(tab);
  };

  const handleConversationSelect = (conv: Conversation): void => {
    setSelectedConversation(conv);
    setShowChat(true); // Show chat on mobile when conversation is selected
  };

  const handleBackToList = (): void => {
    setShowChat(false);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
  };

  const toggleTeamDropdown = (): void => {
    setShowTeamDropdown(!showTeamDropdown);
  };

  const toggleAttachmentDropdown = (): void => {
    setShowAttachmentDropdown(!showAttachmentDropdown);
  };

  return (
    <div className="m-0 p-0 flex h-full bg-gray-50 overflow-hidden">
      {/* Left Sidebar - Conversations (Hidden on mobile when chat is open) */}
      <div className={`${showChat ? 'hidden' : 'flex'} md:flex w-full md:w-80 bg-white border-r border-gray-200 flex-col h-full m-0`}>
        {/* Search Header */}
        <div className="p-3 md:p-4 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 text-gray-600 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7]"
            />
          </div>
        </div>

        {/* Tab Filter */}
        <div className="px-3 md:px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex space-x-1 md:space-x-2">
            {(['Closed', 'Unreplied', 'New'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-2 md:px-3 py-1.5 rounded-lg border border-gray-300 font-medium text-xs md:text-sm transition-colors ${
                  selectedTab === tab
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
                {tab === 'New' && <Plus className="inline ml-1 w-3 h-3 md:w-4 md:h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleConversationSelect(conv)}
              className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={conv.avatar}
                    alt={conv.name}
                    width={10}
                    height={10}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
                  {conv.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm md:text-sm text-gray-900 truncate">{conv.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{conv.time}</span>
                      {conv.unread && conv.unread > 0 && (
                        <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 truncate mt-1">{conv.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area (Hidden on mobile when chat is not open) */}
  <div className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full m-0 bg-[#E866B7]/10`}>
        {/* Chat Header */}
        <div className=" px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Back button for mobile */}
              <button 
                onClick={handleBackToList}
                className="md:hidden p-1 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Image
                src={selectedConversation?.avatar || "https://ui-avatars.com/api/?name=User&background=6b7280&color=fff"}
                alt={selectedConversation?.name || "User"}
                width={10}
                    height={10}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-sm md:text-base text-gray-900">{selectedConversation?.name || "Select a conversation"}</h2>
                  <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">Unpaid</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              {/* Team Members Dropdown */}
              <div className="relative" ref={teamDropdownRef}>
                <button
                  onClick={toggleTeamDropdown}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#FBB906]" />
                </button>
                {showTeamDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Type issue</h3>
                      </div>
                      <div className="space-y-3">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Image
                              src={member.avatar}
                              alt={member.name}
                              width={10}
                              height={10}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-900">{member.name}</p>
                              <p className="text-xs text-gray-600">{member.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 bg-pink-100">
          <div className="flex justify-center">
            <span className="bg-[#E866B7] text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm">Today</span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[280px] md:max-w-xs lg:max-w-md ${msg.type === 'sent' ? 'order-2' : ''}`}>
                {msg.isImageMessage && (
                  <div className="mb-2">
                    <Image
                      src={msg.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop"}
                      alt="Shared image"
                      width={40}
                    height={32}
                      className="w-40 h-28 md:w-48 md:h-32 object-cover rounded-lg"

                    />
                    <div className="flex items-center mt-2 text-xs md:text-sm text-gray-600">
                      <span>😊</span>
                      <span className="ml-2">{msg.content}</span>
                    </div>
                  </div>
                )}
                {!msg.isImageMessage && (
                  <div
                    className={`px-3 md:px-4 py-2 rounded-2xl ${
                      msg.type === 'sent'
                        ? 'bg-[#E866B7] text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-xs md:text-sm">{msg.content}</p>
                  </div>
                )}
                <div className={`text-xs text-gray-500 mt-1 flex items-center ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                  <span>{msg.time}</span>
                  {msg.type === 'sent' && (
                    <>
                      <div className="ml-2 flex space-x-1">
                        <div className="w-3 h-3 text-gray-400">✓</div>
                      </div>
                      <MoreHorizontal className="w-3 h-3 ml-1 text-gray-400" />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="bg-white border-t border-gray-200 p-3 md:p-3 flex-shrink-0">
          <div className="flex items-end space-x-2 md:space-x-3">
            <div className="flex w-full items-center gap-2 md:gap-3">
              <div className="relative flex-shrink-0" ref={attachmentDropdownRef}>
                <button
                  onClick={toggleAttachmentDropdown}
                  className="text-[#FBB906] hover:text-gray-600 p-1 md:p-2"
                >
                  <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {showAttachmentDropdown && (
                  <div className="absolute bottom-full left-0 mb-2 w-44 md:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-xs md:text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <Camera className="w-4 h-4" />
                        <span>Photos & Videos</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-xs md:text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Send Product</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-xs md:text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Create Order</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-xs md:text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <Zap className="w-4 h-4" />
                        <span>Transfer Chat</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={handleMessageChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Write Message"
                  className="w-full px-3 md:px-3 py-1 md:py-1 text-gray-700 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#E866B7] min-h-[36px] md:min-h-[44px] max-h-32"
                  rows={1}
                />
              </div>
              <button className="text-[#E866B7] hover:text-[#E866B7]/80 p-1 md:p-2 flex-shrink-0">
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                className="text-[#E866B7] p-2 md:p-3 rounded-lg hover:text-[#E866B7]/80 transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}