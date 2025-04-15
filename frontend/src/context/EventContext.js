import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  
  // Get all events with filters
  const getEvents = useCallback(async (filters = {}, page = 1, limit = 10) => {
    setLoading(true);
    
    try {
      let queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await axios.get(`/api/events?${queryParams}`);
      
      setEvents(response.data.data);
      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.total,
        pages: response.data.pagination.pages
      });
      setLoading(false);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch events');
      setLoading(false);
      return { success: false, message: err.response?.data?.error };
    }
  }, []);
  
  // Get single event
  const getEvent = useCallback(async (id) => {
    setLoading(true);
    
    try {
      const response = await axios.get(`/api/events/${id}`);
      
      setEvent(response.data.data);
      setLoading(false);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch event details');
      setLoading(false);
      return { success: false, message: err.response?.data?.error };
    }
  }, []);
  
  // Create new event
  const createEvent = async (eventData) => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/events', eventData);
      
      setLoading(false);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
      setLoading(false);
      return { success: false, message: err.response?.data?.error };
    }
  };
  
  // Update event
  const updateEvent = async (id, eventData) => {
    setLoading(true);
    
    try {
      const response = await axios.put(`/api/events/${id}`, eventData);
      
      if (event && event._id === id) {
        setEvent(response.data.data);
      }
      
      setLoading(false);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update event');
      setLoading(false);
      return { success: false, message: err.response?.data?.error };
    }
  };
  
  // Delete event
  const deleteEvent = async (id) => {
    setLoading(true);
    
    try {
      await axios.delete(`/api/events/${id}`);
      
      // Remove from events list if exists
      setEvents(events.filter((event) => event._id !== id));
      
      // Clear current event if it was deleted
      if (event && event._id === id) {
        setEvent(null);
      }
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete event');
      setLoading(false);
      return { success: false, message: err.response?.data?.error };
    }
  };
  
  // Clear error
  const clearError = () => {
    setError(null);
  };
  
  return (
    <EventContext.Provider
      value={{
        events,
        event,
        loading,
        error,
        pagination,
        getEvents,
        getEvent,
        createEvent,
        updateEvent,
        deleteEvent,
        clearError
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext); 