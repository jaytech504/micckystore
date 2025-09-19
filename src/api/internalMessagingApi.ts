import axios from 'axios';

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mickkystore.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') 
      : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== TYPES ====================

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ChatParticipant {
  user: User;
  role: 'admin' | 'member';
  joinedAt: string;
  unreadCount: number;
  lastSeen?: string;
}

export interface ChatSettings {
  allowMembersToAddOthers: boolean;
  allowMembersToLeave: boolean;
  muteNotifications: boolean;
  onlyAdminsCanMessage: boolean;
}

export interface MessageAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface Message {
  _id: string;
  chat: string;
  sender: User;
  content: string;
  messageType: 'text' | 'file' | 'image' | 'document';
  attachments?: MessageAttachment[];
  isEdited: boolean;
  replyTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  name: string;
  description?: string;
  chatType: 'direct' | 'group';
  participants: ChatParticipant[];
  admins: string[];
  createdBy: User;
  lastMessage?: Message;
  lastMessageAt?: string;
  totalMessages: number;
  settings: ChatSettings;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupChatRequest {
  name: string;
  description?: string;
  participants: string[];
}

export interface CreateDirectChatRequest {
  participantId: string;
}

export interface AddParticipantsRequest {
  participants: string[];
}

export interface UpdateChatRequest {
  name?: string;
  description?: string;
  avatar?: string;
}

export interface UpdateChatSettingsRequest {
  allowMembersToAddOthers?: boolean;
  allowMembersToLeave?: boolean;
  muteNotifications?: boolean;
  onlyAdminsCanMessage?: boolean;
}

export interface MakeAdminRequest {
  participantId: string;
}

export interface RemoveAdminRequest {
  participantId: string;
}

export interface ArchiveChatRequest {
  isArchived: boolean;
}

export interface MuteChatRequest {
  isMuted: boolean;
  muteDuration?: number;
}

export interface SendMessageRequest {
  chatId: string;
  content?: string;
  messageType?: 'text' | 'file' | 'image' | 'document';
  replyTo?: string;
  files?: File[];
}

export interface EditMessageRequest {
  content: string;
}

export interface MarkReadRequest {
  messageIds: string[];
}

export interface ChatQueryParams {
  chatType?: 'direct' | 'group';
  isArchived?: boolean;
  page?: number;
  limit?: number;
}

export interface MessageQueryParams {
  page?: number;
  limit?: number;
  before?: string;
  after?: string;
}

export interface SearchChatsParams {
  query: string;
  chatType?: 'direct' | 'group';
  limit?: number;
}

export interface SearchMessagesParams {
  chatId: string;
  query: string;
  messageType?: 'text' | 'file' | 'image' | 'document';
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

export interface GetAttachmentsParams {
  type?: 'file' | 'image' | 'document';
  page?: number;
  limit?: number;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data: Chat;
}

export interface ChatsResponse {
  success: boolean;
  data: {
    chats: Chat[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ParticipantsResponse {
  success: boolean;
  data: {
    participants: ChatParticipant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data: Message;
}

export interface MessagesResponse {
  success: boolean;
  data: {
    messages: Message[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    totalUnreadCount: number;
    chatUnreadCounts: {
      chatId: string;
      chatName: string;
      unreadCount: number;
    }[];
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// ==================== CHAT API ====================

export const internalMessagingApi = {
  // Create group chat
  createGroupChat: async (data: CreateGroupChatRequest): Promise<ChatResponse> => {
    const response = await api.post('/chats/group', data);
    return response.data;
  },

  // Create or get direct chat
  createDirectChat: async (data: CreateDirectChatRequest): Promise<ChatResponse> => {
    const response = await api.post('/chats/direct', data);
    return response.data;
  },

  // Get user's chats
  getChats: async (params?: ChatQueryParams): Promise<ChatsResponse> => {
    const response = await api.get('/chats', { params });
    return response.data;
  },

  // Add participants to group chat
  addParticipants: async (chatId: string, data: AddParticipantsRequest): Promise<ApiResponse> => {
    const response = await api.post(`/chats/${chatId}/participants`, data);
    return response.data;
  },

  // Get chat participants
  getChatParticipants: async (chatId: string, params?: { page?: number; limit?: number }): Promise<ParticipantsResponse> => {
    const response = await api.get(`/chats/${chatId}/participants`, { params });
    return response.data;
  },

  // Remove participant from group chat
  removeParticipant: async (chatId: string, participantId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/chats/${chatId}/participants/${participantId}`);
    return response.data;
  },

  // Update chat information
  updateChat: async (chatId: string, data: UpdateChatRequest): Promise<ApiResponse> => {
    const response = await api.put(`/chats/${chatId}`, data);
    return response.data;
  },

  // Delete chat
  deleteChat: async (chatId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
  },

  // Make user admin
  makeAdmin: async (chatId: string, data: MakeAdminRequest): Promise<ApiResponse> => {
    const response = await api.post(`/chats/${chatId}/make-admin`, data);
    return response.data;
  },

  // Leave chat
  leaveChat: async (chatId: string): Promise<ApiResponse> => {
    const response = await api.post(`/chats/${chatId}/leave`);
    return response.data;
  },

  // Update last seen
  updateLastSeen: async (chatId: string): Promise<ApiResponse> => {
    const response = await api.post(`/chats/${chatId}/last-seen`);
    return response.data;
  },

  // Archive or unarchive chat
  archiveChat: async (chatId: string, data: ArchiveChatRequest): Promise<ApiResponse> => {
    const response = await api.post(`/chats/${chatId}/archive`, data);
    return response.data;
  },

  // Update chat settings
  updateChatSettings: async (chatId: string, data: UpdateChatSettingsRequest): Promise<ApiResponse> => {
    const response = await api.put(`/chats/${chatId}/settings`, data);
    return response.data;
  },

  // Remove admin role
  removeAdmin: async (chatId: string, data: RemoveAdminRequest): Promise<ApiResponse> => {
    const response = await api.post(`/chats/${chatId}/remove-admin`, data);
    return response.data;
  },

  // Search chats
  searchChats: async (params: SearchChatsParams): Promise<ChatsResponse> => {
    const response = await api.get('/chats/search', { params });
    return response.data;
  },

  // Mute or unmute chat
  muteChat: async (chatId: string, data: MuteChatRequest): Promise<ApiResponse> => {
    const response = await api.post(`/chats/${chatId}/mute`, data);
    return response.data;
  },

  // ==================== MESSAGING API ====================

  // Send message
  sendMessage: async (data: SendMessageRequest): Promise<MessageResponse> => {
    const formData = new FormData();
    formData.append('chatId', data.chatId);
    if (data.content) formData.append('content', data.content);
    if (data.messageType) formData.append('messageType', data.messageType);
    if (data.replyTo) formData.append('replyTo', data.replyTo);
    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await api.post('/messaging/send', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get messages for a chat
  getChatMessages: async (chatId: string, params?: MessageQueryParams): Promise<MessagesResponse> => {
    const response = await api.get(`/messaging/chat/${chatId}`, { params });
    return response.data;
  },

  // Edit message
  editMessage: async (messageId: string, data: EditMessageRequest): Promise<ApiResponse> => {
    const response = await api.put(`/messaging/${messageId}/edit`, data);
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/messaging/${messageId}`);
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (data: MarkReadRequest): Promise<ApiResponse> => {
    const response = await api.post('/messaging/mark-read', data);
    return response.data;
  },

  // Search messages
  searchMessages: async (params: SearchMessagesParams): Promise<MessagesResponse> => {
    const response = await api.get('/messaging/search', { params });
    return response.data;
  },

  // Get chat attachments
  getChatAttachments: async (chatId: string, params?: GetAttachmentsParams): Promise<MessagesResponse> => {
    const response = await api.get(`/messaging/attachments/${chatId}`, { params });
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await api.get('/messaging/unread-count');
    return response.data;
  },
};

export default internalMessagingApi;
