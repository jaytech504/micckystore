import { api } from './apiService';

// ===== TYPE DEFINITIONS =====

export interface Message {
  _id: string;
  channel: 'whatsapp' | 'instagram';
  from: string;
  to: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  labels: string[];
  starred: boolean;
  important: boolean;
  timestamp: string;
}

export interface SendMessageRequest {
  channel: 'whatsapp' | 'instagram';
  from: string;
  to: string;
  content: string;
  labels?: string[];
  starred?: boolean;
  important?: boolean;
}

export interface SendMessageResponse {
  success: boolean;
  message: Message;
}

export interface SendMessageErrorResponse {
  success: false;
  error: string;
  message: string;
}

export interface GetMessagesResponse {
  success: boolean;
  messages: Message[];
}

export interface GetMessagesErrorResponse {
  success: false;
  error: string;
}

export interface GetMessagesParams {
  channel?: 'whatsapp' | 'instagram';
  label?: string;
  from?: string;
  to?: string;
}

// ===== WEBHOOK TYPES =====

export interface WebhookVerificationParams {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
}

export interface WebhookErrorResponse {
  success: false;
  error: string;
}

// WhatsApp Webhook Types
export interface WhatsAppWebhookPayload {
  object: 'whatsapp_business_account';
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: 'whatsapp';
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text?: {
            body: string;
          };
          type: string;
        }>;
      };
      field: 'messages';
    }>;
  }>;
}

// Instagram Webhook Types
export interface InstagramWebhookPayload {
  object: 'instagram';
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: 'instagram';
        contacts?: Array<{
          username: string;
          id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text?: {
            body: string;
          };
          type: string;
        }>;
      };
      field: 'messages';
    }>;
  }>;
}

// Webhook Test Response
export interface WebhookTestResponse {
  message: string;
  endpoints: {
    whatsapp: string;
    instagram: string;
  };
  verification: {
    token: string;
  };
}

// ===== API SERVICE FUNCTIONS =====

export const messagingApi = {
  /**
   * POST /api/messages
   * Send a message via WhatsApp or Instagram
   * 
   * Sends a message to a recipient via WhatsApp or Instagram and stores it in the backend.
   */
  sendMessage: async (messageData: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await api.post<SendMessageResponse>('/messages', messageData);
    return response.data;
  },

  /**
   * GET /api/messages
   * Fetch messages
   * 
   * Fetch messages filtered by channel, label, sender, or recipient.
   */
  getMessages: async (params?: GetMessagesParams): Promise<GetMessagesResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.channel) queryParams.append('channel', params.channel);
    if (params?.label) queryParams.append('label', params.label);
    if (params?.from) queryParams.append('from', params.from);
    if (params?.to) queryParams.append('to', params.to);

    const url = `/messages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<GetMessagesResponse>(url);
    return response.data;
  },

  /**
   * GET /api/messages/webhook/whatsapp
   * WhatsApp webhook verification
   * 
   * Meta (Facebook) webhook verification endpoint for WhatsApp integration. 
   * Used during webhook setup in Meta Developer Console.
   */
  verifyWhatsAppWebhook: async (params: WebhookVerificationParams): Promise<string> => {
    const queryParams = new URLSearchParams();
    queryParams.append('hub.mode', params['hub.mode']);
    queryParams.append('hub.verify_token', params['hub.verify_token']);
    queryParams.append('hub.challenge', params['hub.challenge']);

    const url = `/messages/webhook/whatsapp?${queryParams.toString()}`;
    const response = await api.get<string>(url);
    return response.data;
  },

  /**
   * POST /api/messages/webhook/whatsapp
   * WhatsApp webhook event handler
   * 
   * Receives and processes incoming WhatsApp message events from Meta. 
   * Automatically stores messages in database.
   */
  handleWhatsAppWebhook: async (payload: WhatsAppWebhookPayload): Promise<WebhookResponse> => {
    const response = await api.post<WebhookResponse>('/messages/webhook/whatsapp', payload);
    return response.data;
  },

  /**
   * GET /api/messages/webhook/instagram
   * Instagram webhook verification
   * 
   * Meta (Facebook) webhook verification endpoint for Instagram integration. 
   * Used during webhook setup in Meta Developer Console.
   */
  verifyInstagramWebhook: async (params: WebhookVerificationParams): Promise<string> => {
    const queryParams = new URLSearchParams();
    queryParams.append('hub.mode', params['hub.mode']);
    queryParams.append('hub.verify_token', params['hub.verify_token']);
    queryParams.append('hub.challenge', params['hub.challenge']);

    const url = `/messages/webhook/instagram?${queryParams.toString()}`;
    const response = await api.get<string>(url);
    return response.data;
  },

  /**
   * POST /api/messages/webhook/instagram
   * Instagram webhook event handler
   * 
   * Receives and processes incoming Instagram message events from Meta. 
   * Automatically stores messages in database.
   */
  handleInstagramWebhook: async (payload: InstagramWebhookPayload): Promise<WebhookResponse> => {
    const response = await api.post<WebhookResponse>('/messages/webhook/instagram', payload);
    return response.data;
  },

  /**
   * GET /api/messages/webhook-test
   * Webhook configuration test
   * 
   * Test endpoint to verify webhook configuration and get setup information.
   */
  testWebhookConfiguration: async (): Promise<WebhookTestResponse> => {
    const response = await api.get<WebhookTestResponse>('/messages/webhook-test');
    return response.data;
  },
};

export default messagingApi;
