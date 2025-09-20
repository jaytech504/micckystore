import { useState, useEffect } from 'react';
import { eventsApi, Event, CreateEventRequest, UpdateEventRequest, EventQueryParams } from '../../../../api/eventsApi';

// Custom hook for fetching all events
export const useEvents = (params?: EventQueryParams) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.getEvents(params);
      setEvents(response.data.events || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [params?.month, params?.year]);

  const refetchEvents = () => {
    fetchEvents();
  };

  return {
    events,
    loading,
    error,
    refetchEvents
  };
};

// Custom hook for fetching a single event
export const useEvent = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(!!id); // Only set loading to true if there's an ID
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async () => {
    if (!id) {
      setLoading(false);
      setEvent(null);
      setError(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.getEventById(id);
      setEvent(response.data.event);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch event');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const refetchEvent = () => {
    fetchEvent();
  };

  return {
    event,
    loading,
    error,
    refetchEvent
  };
};

// Custom hook for event operations (CRUD)
export const useEventOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (eventData: CreateEventRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.createEvent(eventData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, eventData: UpdateEventRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.updateEvent(id, eventData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.deleteEvent(id);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    loading,
    error
  };
};

// Custom hook for events by month
export const useEventsByMonth = (month: number, year?: number) => {
  const params: EventQueryParams = { month, year };
  return useEvents(params);
};

// Custom hook for events by year
export const useEventsByYear = (year: number) => {
  const params: EventQueryParams = { year };
  return useEvents(params);
};

// Custom hook for current month events
export const useCurrentMonthEvents = () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
  const year = currentDate.getFullYear();
  
  return useEventsByMonth(month, year);
};

// Custom hook for upcoming events (next 30 days)
export const useUpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get events for current month and next month
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      
      // Fetch current month events
      const currentResponse = await eventsApi.getEvents({ month: currentMonth, year: currentYear });
      const nextResponse = await eventsApi.getEvents({ month: nextMonth, year: nextYear });
      
      // Check if API calls were successful
      if (!currentResponse.data || !nextResponse.data) {
        console.error('API response error:', { currentResponse, nextResponse });
        throw new Error('Failed to fetch events from API');
      }
      
      console.log('API Responses:', {
        currentMonth,
        currentYear,
        nextMonth,
        nextYear,
        currentResponse: currentResponse.data,
        nextResponse: nextResponse.data,
        currentEvents: currentResponse.data.events || [],
        nextEvents: nextResponse.data.events || []
      });
      
      const allEvents = [
        ...(currentResponse.data.events || []),
        ...(nextResponse.data.events || [])
      ];
      
      console.log('All events fetched:', allEvents);
      
      // Filter events that are in the next 30 days
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day
      
      const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
      thirtyDaysFromNow.setHours(23, 59, 59, 999); // Set to end of day
      
      const upcomingEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
        
        console.log('Event date comparison:', {
          eventName: event.name,
          eventDate: event.date,
          parsedEventDate: eventDate.toISOString(),
          today: today.toISOString(),
          thirtyDaysFromNow: thirtyDaysFromNow.toISOString(),
          isUpcoming: eventDate >= today && eventDate <= thirtyDaysFromNow
        });
        
        return eventDate >= today && eventDate <= thirtyDaysFromNow;
      });
      
      console.log('Filtered upcoming events:', upcomingEvents);
      setEvents(upcomingEvents);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch upcoming events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const refetchEvents = () => {
    fetchUpcomingEvents();
  };

  return {
    events,
    loading,
    error,
    refetchEvents
  };
};
