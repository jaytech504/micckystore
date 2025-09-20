import { useState, useEffect, useCallback } from 'react';
import { internalMessagingApi, Chat, Message, ChatQueryParams, MessageQueryParams, SearchChatsParams, SearchMessagesParams, GetAttachmentsParams, UnreadCountResponse } from '../../../../api/internalMessagingApi';



// Get all chats
export const useChats = (params?: ChatQueryParams) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.getChats(params);
      
      if (response.success) {
        setChats(response.data.chats);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch chats');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const refetch = useCallback(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, loading, error, pagination, refetch };
};

// Create group chat
export const useCreateGroupChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGroupChat = useCallback(async (data: { name: string; description?: string; participants: string[] }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.createGroupChat(data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create group chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createGroupChat, loading, error };
};

// Create direct chat
export const useCreateDirectChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDirectChat = useCallback(async (participantId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.createDirectChat({ participantId });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create direct chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createDirectChat, loading, error };
};

// Chat operations
export const useChatOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addParticipants = useCallback(async (chatId: string, participants: string[]) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.addParticipants(chatId, { participants });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add participants');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeParticipant = useCallback(async (chatId: string, participantId: string) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.removeParticipant(chatId, participantId);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to remove participant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateChat = useCallback(async (chatId: string, data: { name?: string; description?: string; avatar?: string }) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.updateChat(chatId, data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.deleteChat(chatId);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const makeAdmin = useCallback(async (chatId: string, participantId: string) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.makeAdmin(chatId, { participantId });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to make admin');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeAdmin = useCallback(async (chatId: string, participantId: string) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.removeAdmin(chatId, { participantId });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to remove admin');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveChat = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.leaveChat(chatId);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to leave chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const archiveChat = useCallback(async (chatId: string, isArchived: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.archiveChat(chatId, { isArchived });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to archive chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateChatSettings = useCallback(async (chatId: string, settings: {
    allowMembersToAddOthers?: boolean;
    allowMembersToLeave?: boolean;
    muteNotifications?: boolean;
    onlyAdminsCanMessage?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.updateChatSettings(chatId, settings);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update chat settings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const muteChat = useCallback(async (chatId: string, isMuted: boolean, muteDuration?: number) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.muteChat(chatId, { isMuted, muteDuration });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to mute chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addParticipants,
    removeParticipant,
    updateChat,
    deleteChat,
    makeAdmin,
    removeAdmin,
    leaveChat,
    archiveChat,
    updateChatSettings,
    muteChat,
    loading,
    error
  };
};

// Get chat participants
export const useChatParticipants = (chatId: string, params?: { page?: number; limit?: number }) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchParticipants = useCallback(async () => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.getChatParticipants(chatId, params);
      
      if (response.success) {
        setParticipants(response.data.participants);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch participants');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  }, [chatId, params]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return { participants, loading, error, pagination, refetch: fetchParticipants };
};

// Search chats
export const useSearchChats = (params: SearchChatsParams) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchChats = useCallback(async () => {
    if (!params.query.trim()) {
      setChats([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.searchChats(params);
      
      if (response.success) {
        setChats(response.data.chats);
      } else {
        setError('Failed to search chats');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to search chats');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    searchChats();
  }, [searchChats]);

  return { chats, loading, error, searchChats };
};

// ==================== MESSAGING HOOKS ====================

// Get messages for a chat
export const useChatMessages = (chatId: string, params?: MessageQueryParams) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.getChatMessages(chatId, params);
      
      if (response.success) {
        setMessages(response.data.messages);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [chatId, params]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const refetch = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, pagination, refetch };
};

// Send message
export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (data: {
    chatId: string;
    content?: string;
    messageType?: 'text' | 'file' | 'image' | 'document';
    replyTo?: string;
    files?: File[];
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.sendMessage(data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendMessage, loading, error };
};

// Message operations
export const useMessageOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editMessage = useCallback(async (messageId: string, content: string) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.editMessage(messageId, { content });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to edit message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.deleteMessage(messageId);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markMessagesAsRead = useCallback(async (messageIds: string[]) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.markMessagesAsRead({ messageIds });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to mark messages as read');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { editMessage, deleteMessage, markMessagesAsRead, loading, error };
};

// Search messages
export const useSearchMessages = (params: SearchMessagesParams) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMessages = useCallback(async () => {
    if (!params.query.trim()) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.searchMessages(params);
      
      if (response.success) {
        setMessages(response.data.messages);
      } else {
        setError('Failed to search messages');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to search messages');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    searchMessages();
  }, [searchMessages]);

  return { messages, loading, error, searchMessages };
};

// Get chat attachments
export const useChatAttachments = (chatId: string, params?: GetAttachmentsParams) => {
  const [attachments, setAttachments] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchAttachments = useCallback(async () => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.getChatAttachments(chatId, params);
      
      if (response.success) {
        setAttachments(response.data.messages);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch attachments');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch attachments');
    } finally {
      setLoading(false);
    }
  }, [chatId, params]);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  return { attachments, loading, error, pagination, refetch: fetchAttachments };
};

// Get unread count
export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState<UnreadCountResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await internalMessagingApi.getUnreadCount();
      
      if (response.success) {
        setUnreadCount(response.data);
      } else {
        setError('Failed to fetch unread count');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch unread count');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const refetch = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return { unreadCount, loading, error, refetch };
};

// Update last seen
export const useUpdateLastSeen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLastSeen = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      setError(null);
      await internalMessagingApi.updateLastSeen(chatId);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update last seen');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateLastSeen, loading, error };
};
