import { api } from './apiService';

// Event Management API Types
export interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  additionalInfo?: string;
  attendees: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  name: string;
  date: string;
  time: string;
  location: string;
  additionalInfo?: string;
  attendees: string[];
}

export interface UpdateEventRequest {
  name?: string;
  date?: string;
  time?: string;
  location?: string;
  additionalInfo?: string;
  attendees?: string[];
}

export interface EventResponse {
  message: string;
  event: Event;
}

export interface EventsResponse {
  events: Event[];
}

export interface EventQueryParams {
  month?: number;
  year?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Event Management API Service
export const eventsApi = {
  // Create a new event
  createEvent: async (eventData: CreateEventRequest) => {
    return api.post<EventResponse>('/events', eventData);
  },

  // Get all events with optional filtering
  getEvents: async (params?: EventQueryParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.year) queryParams.append('year', params.year.toString());

    const url = `/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<EventsResponse>(url);
  },

  // Get event by ID
  getEventById: async (id: string) => {
    return api.get<EventResponse>(`/events/${id}`);
  },

  // Update event
  updateEvent: async (id: string, eventData: UpdateEventRequest) => {
    return api.put<EventResponse>(`/events/${id}`, eventData);
  },

  // Delete event
  deleteEvent: async (id: string) => {
    return api.delete<{ message: string }>(`/events/${id}`);
  }
};
