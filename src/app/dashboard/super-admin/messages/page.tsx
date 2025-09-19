'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, ChevronDown, Paperclip, Smile, Send, MoreVertical, Menu, X, Users, Edit2, Trash2, Check, CheckCheck } from 'lucide-react';
import Image from 'next/image';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  useChats, 
  useCreateGroupChat, 
  useCreateDirectChat, 
  useChatOperations,
  useChatMessages,
  useSendMessage,
  useMessageOperations,
  useChatParticipants,
  useUnreadCount
} from '../hooks/useInternalMessaging';
import { useEmployees } from '../hooks/useEmployees';

const DeliveryChatApp = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedChat, setSelectedChat] = useState('delivery-group');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Message input state
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Chat management state
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [newChatDescription, setNewChatDescription] = useState('');
  
  // Message editing state
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
  
  // Employee selection state
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);
  const [addedMemberName, setAddedMemberName] = useState<string | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // API hooks
  const { chats: conversations, loading: chatsLoading, error: chatsError, refetch: refetchChats } = useChats();
  const { createGroupChat, loading: createChatLoading } = useCreateGroupChat();
  const { createDirectChat, loading: createDirectLoading } = useCreateDirectChat();
  const { addParticipants, removeParticipant, updateChat, deleteChat, loading: chatOpsLoading } = useChatOperations();

  // Messages API
  const { messages, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useChatMessages(selectedChat);
  const { sendMessage, loading: sendLoading } = useSendMessage();
  const { editMessage, deleteMessage, markMessagesAsRead, loading: messageOpsLoading } = useMessageOperations();

  // Members API
  const { participants: members, loading: membersLoading, error: membersError, refetch: refetchMembers } = useChatParticipants(selectedChat);
  
  // Unread count API
  const { unreadCount, loading: unreadLoading, refetch: refetchUnreadCount } = useUnreadCount();

  // Employees API for adding members
  const { employees: allEmployees, loading: employeesLoading, error: employeesError } = useEmployees({
    status: 'Active', // Only show active employees
    limit: 100 // Get more employees for selection
  });

  const [attachments, setAttachments] = useState([
    { id: '1', name: 'Document', size: '7.5 MB', time: '3.22.22, 1:15 AM', type: 'document' },
    { id: '2', name: 'Document', size: '7.5 MB', time: '3.22.22, 1:13 AM', type: 'document' },
    { id: '3', name: 'Document', size: '7.5 MB', time: '3.22.22, 1:11 AM', type: 'document' },
    { id: '4', name: 'Document', size: '7.5 MB', time: '3.22.22, 1:09 AM', type: 'document' }
  ]);

  // Get current chat info
  const currentChat = conversations.find(chat => chat._id === selectedChat);
  const currentMessages = messages || [];

  // API functions
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    try {
      await sendMessage({
        chatId: selectedChat,
        content: messageInput,
        messageType: 'text'
      });
      setMessageInput('');
      refetchMessages(); // Refresh messages
      refetchUnreadCount(); // Refresh unread count
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(msg => msg._id === messageId);
    if (message) {
      setEditingMessage(messageId);
      setEditMessageText(message.content);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMessage || !editMessageText.trim()) return;

    try {
      await editMessage(editingMessage, editMessageText);
      setEditingMessage(null);
      setEditMessageText('');
      refetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      refetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleCreateChat = async () => {
    if (!newChatName.trim()) return;

    try {
      const newChat = await createGroupChat({
        name: newChatName,
        description: newChatDescription,
        participants: [user?.id || ''] // Add current user as participant
      });
      
      setNewChatName('');
      setNewChatDescription('');
      setShowCreateChat(false);
      setSelectedChat(newChat._id);
      refetchChats(); // Refresh chats list
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleAddMember = async (memberId: string) => {
    if (!selectedChat) return;

    // Find the employee name for success message
    const employee = allEmployees.find(emp => emp._id === memberId);
    const employeeName = employee?.name || 'Member';

    setAddingMemberId(memberId); // Set loading state

    try {
      console.log('Adding member to chat:', { memberId, selectedChat });
      await addParticipants(selectedChat, [memberId]);
      console.log('Member added successfully');
      
      // Show success feedback
      setAddedMemberName(employeeName);
      setTimeout(() => setAddedMemberName(null), 3000); // Clear after 3 seconds
      
      // Close modal and refresh data
      setShowAddMembers(false);
      setEmployeeSearchQuery('');
      setFilteredEmployees([]);
      
      // Refresh members list and chats
      refetchMembers();
      refetchChats();
      
    } catch (error) {
      console.error('Failed to add member:', error);
      // You could add error toast notification here
    } finally {
      setAddingMemberId(null); // Clear loading state
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    // Simulate typing indicator
    if (!isTyping) {
      setIsTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = conversations.filter(chat => 
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        (chat.lastMessage && typeof chat.lastMessage === 'object' && chat.lastMessage.content && 
         chat.lastMessage.content.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations([]);
    }
  };

  const handleEmployeeSearch = (query: string) => {
    setEmployeeSearchQuery(query);
    if (query.trim()) {
      // Get current member IDs to exclude them
      const currentMemberIds = members.map(member => member.user._id);
      
      // Filter employees that are not already in the chat
      const filtered = allEmployees.filter(employee => 
        !currentMemberIds.includes(employee._id) &&
        (employee.name.toLowerCase().includes(query.toLowerCase()) ||
         employee.email.toLowerCase().includes(query.toLowerCase()) ||
         employee.staffId.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredEmployees(filtered);
    } else {
      // Show all employees not in current chat
      const currentMemberIds = members.map(member => member.user._id);
      const availableEmployees = allEmployees.filter(employee => 
        !currentMemberIds.includes(employee._id)
      );
      setFilteredEmployees(availableEmployees);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Initialize filtered employees when modal opens
  useEffect(() => {
    if (showAddMembers && allEmployees.length > 0) {
      const currentMemberIds = members.map(member => member.user._id);
      const availableEmployees = allEmployees.filter(employee => 
        !currentMemberIds.includes(employee._id)
      );
      setFilteredEmployees(availableEmployees);
    }
  }, [showAddMembers, allEmployees, members]);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex h-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

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
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {chatsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : chatsError ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-red-500 text-sm">Error loading chats: {chatsError}</p>
            </div>
          ) : (searchQuery ? filteredConversations : conversations).length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500 text-sm">No chats found</p>
            </div>
          ) : (
            (searchQuery ? filteredConversations : conversations).map((conv) => (
            <div
              key={conv._id}
              onClick={() => {
                setSelectedChat(conv._id);
                setShowSidebar(false);
              }}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                selectedChat === conv._id ? 'bg-blue-50' : ''
              }`}
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
                  <span className="text-xs text-gray-500">
                    {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage?.content || 'No messages yet'}
                  </p>
                  <div className="flex items-center space-x-1">
                    {conv.totalMessages > 0 && (
                      <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conv.totalMessages}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
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
              <h3 className="font-medium text-gray-900 truncate">{currentChat?.name || 'Select a chat'}</h3>
              <p className="text-sm text-gray-600">
                {currentChat?.chatType === 'group' 
                  ? `${currentChat.participants?.length || 0} members`
                  : 'Direct message'
                }
              </p>
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
          {messagesLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : messagesError ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-red-500 text-sm">Error loading messages: {messagesError}</p>
            </div>
          ) : currentMessages.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500 text-sm">No messages yet</p>
            </div>
          ) : (
            currentMessages.map((message, index) => (
            <div key={message._id}>
              {index > 0 && new Date(message.createdAt).toDateString() !== new Date(currentMessages[index - 1].createdAt).toDateString() && (
                <div className="text-center text-xs text-gray-500 my-4">
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
              )}
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                    {message.sender?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900 truncate">{message.sender?.name || 'Unknown'}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-2 sm:p-3 max-w-full sm:max-w-md">
                    <p className="text-sm text-gray-800">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex space-x-2 mt-2 overflow-x-auto">
                        {message.attachments.map((attachment: any, idx: number) => (
                          <div key={idx} className="w-20 sm:w-24 h-24 sm:h-32 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                            <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs">
                              {attachment.fileType}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative group">
                <button className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1">
                  <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleEditMessage(message._id)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message._id)}
                      className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
          
          {/* Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Typing"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{typingUsers.join(', ')} is typing...</p>
              </div>
            </div>
          )}
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-2 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              onClick={() => setShowCreateChat(true)}
              className="text-yellow-500 flex-shrink-0 p-1"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Add a comment..."
                value={messageInput}
                onChange={handleTyping}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-full text-sm pr-16 sm:pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendLoading}
                  className="text-blue-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-500"></div>
                  ) : (
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
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
        {/* Header - Fixed */}
        <div className="p-4 lg:p-6 text-center border-b border-gray-200 flex-shrink-0">
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
            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xl font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900">
            {authLoading ? 'Loading...' : user?.name || 'User'}
          </h3>
          <p className="text-sm text-gray-600">
            {authLoading ? 'Loading...' : user?.email || 'No email'}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {/* Attachments Section */}
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Attachments</h4>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
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

          {/* Members Section */}
          <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Members</h4>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
            <button 
              onClick={() => setShowAddMembers(true)}
              className="flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-600 mb-4"
            >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
          <div className="space-y-3">
              {members.map((member) => (
                <div key={member.user._id} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white text-xs flex-shrink-0">
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold rounded-full">
                        {member.user.name?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-gray-900 truncate">{member.user.name}</span>
                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

      {/* Create Chat Modal */}
      {showCreateChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Chat</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chat Name</label>
                <input
                  type="text"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder="Enter chat name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={newChatDescription}
                  onChange={(e) => setNewChatDescription(e.target.value)}
                  placeholder="Enter description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateChat(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChat}
                disabled={!newChatName.trim() || createChatLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createChatLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  'Create Chat'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Members from Staff</h3>
            
            {/* Search Input */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search staff by name, email, or staff ID..."
                  value={employeeSearchQuery}
                  onChange={(e) => handleEmployeeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Employee List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {employeesLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading staff...</span>
                </div>
              ) : employeesError ? (
                <div className="text-center p-4 text-red-500 text-sm">
                  Error loading staff: {employeesError}
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="text-center p-4 text-gray-500 text-sm">
                  {employeeSearchQuery ? 'No staff found matching your search' : 'No available staff to add'}
                </div>
              ) : (
                filteredEmployees.map((employee) => {
                  const isAdding = addingMemberId === employee._id;
                  return (
                    <div
                      key={employee._id}
                      onClick={() => !isAdding && handleAddMember(employee._id)}
                      className={`flex items-center space-x-3 p-3 rounded border border-gray-100 ${
                        isAdding 
                          ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                          : 'hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold rounded-full">
                          {employee.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.email}</p>
                        <p className="text-xs text-gray-400">ID: {employee.staffId} • {employee.role}</p>
                      </div>
                      <div className="text-blue-500">
                        {isAdding ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowAddMembers(false);
                  setEmployeeSearchQuery('');
                  setFilteredEmployees([]);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {addedMemberName && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span>{addedMemberName} added to chat successfully!</span>
        </div>
      )}

      {/* Edit Message Modal */}
      {editingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Message</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={editMessageText}
                  onChange={(e) => setEditMessageText(e.target.value)}
                  placeholder="Enter message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingMessage(null);
                  setEditMessageText('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editMessageText.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MessagesPage = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin']}>
      <DeliveryChatApp />
    </ProtectedRoute>
  );
};

export default MessagesPage;