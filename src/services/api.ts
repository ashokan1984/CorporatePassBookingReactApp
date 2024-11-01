// services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://your-api-url/api';

// Define interfaces for each entity
export interface Facility {
  id: string;
  name: string;
  location: string;
  // add other properties as needed
}

export interface Booking {
  id: string;
  visitorId: string;
  facilityId: string;
  date: string;
  // add other properties as needed
}

export interface Visitor {
  id: string;
  name: string;
  contact: string;
  // add other properties as needed
}

// API functions
export const getFacilities = () => axios.get<Facility[]>(`${API_BASE_URL}/facilities`);
export const getFacility = (id: string) => axios.get<Facility>(`${API_BASE_URL}/facility/${id}`);
export const getBookings = () => axios.get<Booking[]>(`${API_BASE_URL}/bookings`);
export const getBookingByVisitor = (visitorId: string) => axios.get<Booking[]>(`${API_BASE_URL}/bookings/${visitorId}`);
export const getBooking = (id: string) => axios.get<Booking>(`${API_BASE_URL}/booking/${id}`);
export const createBooking = (bookingData: Booking) => axios.post(`${API_BASE_URL}/booking`, bookingData);
export const updateBooking = (bookingData: Booking) => axios.put(`${API_BASE_URL}/booking`, bookingData);
export const getVisitors = () => axios.get<Visitor[]>(`${API_BASE_URL}/visitors`);
export const getVisitor = (id: string) => axios.get<Visitor>(`${API_BASE_URL}/visitor/${id}`);
export const createVisitor = (visitorData: Visitor) => axios.post(`${API_BASE_URL}/visitor`, visitorData);
export const updateVisitor = (visitorData: Visitor) => axios.put(`${API_BASE_URL}/visitor`, visitorData);
