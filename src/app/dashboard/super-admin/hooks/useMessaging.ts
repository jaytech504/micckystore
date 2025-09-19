import { useState, useEffect } from 'react';
import { 
  messagingApi, 
  Message, 
  SendMessageRequest,
  GetMessagesParams,
  WebhookTestResponse,
  WebhookVerificationParams,
  WhatsAppWebhookPayload,
  InstagramWebhookPayload
} from '../../../../api/messagingApi';

// ===== MESSAGING HOOKS =====

// Hook for sending messages
export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendMessage = async (messageData: SendMessageRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await messagingApi.sendMessage(messageData);
      
      if (response.success) {
        setSuccess(true);
        return response.message;
      } else {
        throw new Error('Message sending failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
      setError(null);
    setSuccess(false);
  };

  return {
    sendMessage,
    loading,
    error,
    success,
    resetState
  };
};

// Hook for fetching messages
export const useMessages = (params?: GetMessagesParams) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await messagingApi.getMessages(params);
      
      if (response.success) {
        setMessages(response.messages);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [JSON.stringify(params)]);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages
  };
};

// Hook for WhatsApp messages specifically
export const useWhatsAppMessages = (additionalParams?: Omit<GetMessagesParams, 'channel'>) => {
  const params: GetMessagesParams = {
    channel: 'whatsapp',
    ...additionalParams
  };

  return useMessages(params);
};

// Hook for Instagram messages specifically
export const useInstagramMessages = (additionalParams?: Omit<GetMessagesParams, 'channel'>) => {
  const params: GetMessagesParams = {
    channel: 'instagram',
    ...additionalParams
  };

  return useMessages(params);
};

// Hook for webhook configuration testing
export const useWebhookTest = () => {
  const [config, setConfig] = useState<WebhookTestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testWebhook = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await messagingApi.testWebhookConfiguration();
      setConfig(response);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to test webhook configuration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    loading,
    error,
    testWebhook
  };
};

// Hook for WhatsApp webhook verification
export const useWhatsAppWebhook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyWebhook = async (params: WebhookVerificationParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const challenge = await messagingApi.verifyWhatsAppWebhook(params);
      return challenge;
    } catch (err: any) {
      setError(err.message || 'WhatsApp webhook verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleWebhook = async (payload: WhatsAppWebhookPayload) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await messagingApi.handleWhatsAppWebhook(payload);
      return response;
    } catch (err: any) {
      setError(err.message || 'WhatsApp webhook handling failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyWebhook,
    handleWebhook,
    loading,
    error
  };
};

// Hook for Instagram webhook verification
export const useInstagramWebhook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyWebhook = async (params: WebhookVerificationParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const challenge = await messagingApi.verifyInstagramWebhook(params);
      return challenge;
    } catch (err: any) {
      setError(err.message || 'Instagram webhook verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleWebhook = async (payload: InstagramWebhookPayload) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await messagingApi.handleInstagramWebhook(payload);
      return response;
    } catch (err: any) {
      setError(err.message || 'Instagram webhook handling failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyWebhook,
    handleWebhook,
    loading,
    error
  };
};

// Hook for real-time message management
export const useMessagingDashboard = (initialParams?: GetMessagesParams) => {
  const [params, setParams] = useState<GetMessagesParams>(initialParams || {});
  const { messages, loading, error, refetch } = useMessages(params);
  const { sendMessage, loading: sendLoading, error: sendError, success: sendSuccess, resetState } = useSendMessage();

  // Filter messages by channel
  const whatsappMessages = messages.filter(msg => msg.channel === 'whatsapp');
  const instagramMessages = messages.filter(msg => msg.channel === 'instagram');

  // Message statistics
  const stats = {
    total: messages.length,
    whatsapp: whatsappMessages.length,
    instagram: instagramMessages.length,
    sent: messages.filter(msg => msg.status === 'sent').length,
    delivered: messages.filter(msg => msg.status === 'delivered').length,
    read: messages.filter(msg => msg.status === 'read').length,
    failed: messages.filter(msg => msg.status === 'failed').length,
    starred: messages.filter(msg => msg.starred).length,
    important: messages.filter(msg => msg.important).length
  };

  // Update filters
  const updateFilters = (newParams: Partial<GetMessagesParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  // Clear filters
  const clearFilters = () => {
    setParams({});
  };

  // Send message and refresh list
  const sendAndRefresh = async (messageData: SendMessageRequest) => {
    try {
      const result = await sendMessage(messageData);
      await refetch(); // Refresh messages after sending
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    // Messages data
    messages,
    whatsappMessages,
    instagramMessages,
    stats,
    
    // Loading states
    loading,
    sendLoading,
    
    // Error states
    error,
    sendError,
    sendSuccess,
    
    // Actions
    sendMessage: sendAndRefresh,
    refetch,
    resetState,
    
    // Filters
    params,
    updateFilters,
    clearFilters
  };
};

// Hook for message analytics
export const useMessageAnalytics = () => {
  const { messages, loading, error } = useMessages();
  
  // Calculate analytics from messages
  const analytics = {
    totalMessages: messages.length,
    
    // By channel
    whatsappCount: messages.filter(msg => msg.channel === 'whatsapp').length,
    instagramCount: messages.filter(msg => msg.channel === 'instagram').length,
    
    // By status
    sentCount: messages.filter(msg => msg.status === 'sent').length,
    deliveredCount: messages.filter(msg => msg.status === 'delivered').length,
    readCount: messages.filter(msg => msg.status === 'read').length,
    failedCount: messages.filter(msg => msg.status === 'failed').length,
    
    // Success rate
    successRate: messages.length > 0 
      ? ((messages.filter(msg => msg.status !== 'failed').length / messages.length) * 100).toFixed(1)
      : '0',
    
    // By priority
    starredCount: messages.filter(msg => msg.starred).length,
    importantCount: messages.filter(msg => msg.important).length,
    
    // Recent activity (last 24 hours)
    recentMessages: messages.filter(msg => {
      const messageDate = new Date(msg.timestamp);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return messageDate >= yesterday;
    }).length
  };

  return {
    analytics,
    messages,
    loading,
    error
  };
};

// Utility functions for message management
export const useMessageUtils = () => {
  // Format message timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get message status color
  const getStatusColor = (status: Message['status']) => {
    const colors = {
      sent: 'text-blue-600',
      delivered: 'text-green-600',
      read: 'text-green-800',
      failed: 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
  };

  // Get channel icon
  const getChannelIcon = (channel: Message['channel']) => {
    return channel === 'whatsapp' ? '📱' : '📷';
  };

  // Validate phone number for WhatsApp
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  // Validate Instagram username
  const validateInstagramUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
    return usernameRegex.test(username);
  };

  return {
    formatTimestamp,
    getStatusColor,
    getChannelIcon,
    validatePhoneNumber,
    validateInstagramUsername
  };
};
