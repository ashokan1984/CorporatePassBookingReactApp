// Example: components/BookingList.tsx
import React, { useEffect, useState } from 'react';
import { Booking, getBookings } from '../services/api';
import './BookingList.css';

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    getBookings().then(response => setBookings(response.data)).catch(console.error);
  }, []);

  return (
    <div className="card">
      <h2>Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Visitor ID</th>
            <th>Facility ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.visitorId}</td>
              <td>{booking.facilityId}</td>
              <td>{new Date(booking.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
