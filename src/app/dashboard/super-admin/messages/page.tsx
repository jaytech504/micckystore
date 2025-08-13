'use client';

import { useState } from 'react';
import { Search, Plus, ChevronDown, Paperclip, Smile, Send, MoreVertical, Menu, X, Users } from 'lucide-react';
import Image from 'next/image';

const DeliveryChatApp = () => {
  const [selectedChat, setSelectedChat] = useState('delivery-group');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const conversations = [
    {
      id: 'bright-friday',
      name: 'Bright Friday',
      status: 'Typing...',
      time: '4:30 PM',
      hasNotification: true
    },
    {
      id: 'delivery-group',
      name: 'Delivery group',
      lastMessage: 'Hello! Everyone',
      time: '9:36 AM',
      hasCheck: true
    },
    {
      id: 'nifemi',
      name: 'Nifemi',
      lastMessage: 'Yes sir',
      time: '1:15 AM'
    },
    {
      id: 'semiu',
      name: 'Semiu',
      status: 'Typing...',
      time: '4:30 PM'
    },
    {
      id: 'chineye',
      name: 'Chineye',
      lastMessage: 'the man has paid',
      time: '4:30 PM',
      hasNotification: true
    },
    {
      id: 'dennis',
      name: 'Dennis',
      lastMessage: 'It has been delivered',
      time: '8:20 PM',
      hasNotification: true
    },
    {
      id: 'samad',
      name: 'Samad',
      lastMessage: '🎤 Voice message',
      time: 'yesterday'
    },
    {
      id: 'samuel',
      name: 'Samuel',
      lastMessage: 'Design done',
      time: 'yesterday',
      hasCheck: true
    },
    {
      id: 'isaiah',
      name: 'Isaiah',
      lastMessage: 'Sent',
      time: '1:15 AM'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Ijebu Rider',
      time: '10:12 PM',
      text: 'I still dey Lekki ooo, Customer never pay'
    },
    {
      id: 2,
      sender: 'Ijebu Rider',
      time: '10:12 PM',
      text: 'Accountant no go see this one now, na reports she go dey find'
    },
    {
      id: 3,
      sender: 'Nifemi',
      time: '10:30 AM',
      text: 'Hey, the customer said he has not received his package ooo. Please, who is working on it?',
      isToday: true
    },
    {
      id: 4,
      sender: 'Nifemi',
      time: '10:30 AM',
      text: 'This is the screenshot of our conversation',
      hasImages: true,
      images: [
        '/logo.png',
        '/logo.png'
      ]
    },
    {
      id: 5,
      sender: 'Michael',
      time: '10:30 AM',
      text: 'Who is working on this package?'
    },
    {
      id: 6,
      sender: 'Tina',
      time: '8:20 PM',
      text: 'Cooking'
    }
  ];

  const members = [
    { name: 'Ijebu Rider' },
    { name: 'Nifemi' },
    { name: 'Tina' },
    { name: 'Accountant' }
  ];

  const attachments = [
    { name: 'Document', size: '7.5 MB', time: '3.22.22, 1:15 AM' },
    { name: 'Document', size: '7.5 MB', time: '3.22.22, 1:13 AM' },
    { name: 'Document', size: '7.5 MB', time: '3.22.22, 1:11 AM' },
    { name: 'Document', size: '7.5 MB', time: '3.22.22, 1:09 AM' }
  ];

  return (
    <div className="flex h-full bg-gray-50 relative">
      {/* Mobile Overlay */}
      {(showSidebar || showRightPanel) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {
            setShowSidebar(false);
            setShowRightPanel(false);
          }}
        />
      )}

      {/* Left Sidebar - Conversations */}
      <div className={`
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative
        fixed left-0 top-0 h-full w-80 sm:w-80 md:w-80 lg:w-80 
        bg-white border-r border-gray-200 flex flex-col z-50
        transition-transform duration-300 ease-in-out
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowSidebar(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                selectedChat === conv.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                setSelectedChat(conv.id);
                setShowSidebar(false);
              }}
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                <Image
                  src={`/logo.png`}
                  alt={conv.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{conv.name}</h3>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {conv.status || conv.lastMessage}
                  </p>
                  {conv.hasNotification && (
                    <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                  )}
                  {conv.hasCheck && (
                    <div className="text-green-500 ml-2">✓</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button className="text-sm text-gray-600 hover:text-gray-800">
            All Messages
          </button>
        </div>
      </div>

      {/* Middle Section - Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <button 
              className="lg:hidden p-2 mr-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
              <Image
                src={`/logo.png`}
                alt="Delivery group"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 truncate">Delivery group</h3>
              <p className="text-sm text-gray-600">20 members, 10 online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowRightPanel(true)}
            >
              <Users className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
          {messages.map((message, index) => (
            <div key={message.id}>
              {message.isToday && index > 0 && (
                <div className="text-center text-xs text-gray-500 my-4">
                  Today, March 24
                </div>
              )}
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src={`/logo.png`}
                    alt={message.sender}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900 truncate">{message.sender}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0">{message.time}</span>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-2 sm:p-3 max-w-full sm:max-w-md">
                    <p className="text-sm text-gray-800">{message.text}</p>
                    {message.hasImages && (
                      <div className="flex space-x-2 mt-2 overflow-x-auto">
                        {message.images.map((img, idx) => (
                          <div key={idx} className="w-20 sm:w-24 h-24 sm:h-32 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                            <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs">
                              Screenshot
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1">
                  <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-2 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className="text-yellow-500 flex-shrink-0 p-1">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-full text-sm pr-16 sm:pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button className="text-blue-500 p-1">
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Member Info */}
      <div className={`
        ${showRightPanel ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0 lg:relative
        fixed right-0 top-0 h-full w-80 sm:w-80 md:w-80 lg:w-80
        bg-white border-l border-gray-200 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        hidden lg:flex
        ${showRightPanel ? 'flex' : ''}
      `}>
        <div className="p-4 lg:p-6 text-center">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h3 className="font-medium text-gray-900">Member Info</h3>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowRightPanel(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <Image 
              src={`/logo.png`}
              alt="Michael Oyelola"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold text-gray-900">Michael Oyelola</h3>
          <p className="text-sm text-gray-600">Mickystore1@gmail.com</p>
        </div>

        <div className="px-4 lg:px-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Attachments</h4>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                  <p className="text-xs text-gray-500 truncate">{attachment.size} {attachment.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="text-sm text-blue-500 hover:text-blue-600 mt-2">
            View all
          </button>
        </div>

        <div className="px-4 lg:px-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Members</h4>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <button className="flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-600 mb-4">
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
          <div className="space-y-3">
            {members.map((member, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs flex-shrink-0">
                  <Image
                    src={`/logo.png`}
                    alt={member.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
              </div>
              <span className="text-sm text-gray-900 truncate">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryChatApp;