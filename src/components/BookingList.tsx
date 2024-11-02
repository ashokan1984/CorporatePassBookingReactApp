import React, { useState, useEffect } from "react";
import httpService from "../services/httpService";
import "./BookingList.css";

interface Facility {
  id: string;
  name: string;
  amenities: string[];
}

interface Visitor {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  facilityId: string;
  visitorId: string;
  quantity: number;
  bookingDateTime: string;
  facility: Facility;
  visitor: Visitor;
}

const BookingList = (): JSX.Element => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [facilityId, setFacilityId] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [bookingDateTime, setBookingDateTime] = useState("");
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await httpService.get("Booking/GetAll");
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    };

    const fetchFacilities = async () => {
      try {
        const response = await httpService.get("Facility/GetAll");
        setFacilities(response.data);
      } catch (error) {
        console.error("Failed to fetch facilities", error);
      }
    };

    const fetchVisitors = async () => {
      try {
        const response = await httpService.get("Visitor/GetAll");
        setVisitors(response.data);
      } catch (error) {
        console.error("Failed to fetch visitors", error);
      }
    };

    fetchBookings();
    fetchFacilities();
    fetchVisitors();
  }, []);

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = { facilityId, visitorId, quantity, bookingDateTime };

    try {
      const response = await httpService.post("Booking/Create", newBooking);
      if (response.status === 200 || response.status === 201) {
        setBookings((prevBookings) => [...prevBookings, response.data]);
        resetForm();
      } else {
        console.error("Failed to add booking");
      }
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  const handleEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookingId) return;

    const updatedBooking = { id: editingBookingId, facilityId, visitorId, quantity, bookingDateTime };

    try {
      const response = await httpService.put("Booking/Update", updatedBooking);
      if (response.status === 200 || response.status === 201) {
        const updatedBookings = bookings.map((booking) =>
          booking.id === editingBookingId ? response.data : booking
        );
        setBookings(updatedBookings);
        resetForm();
      } else {
        console.error("Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleEditClick = (booking: Booking) => {
    setFacilityId(booking.facilityId);
    setVisitorId(booking.visitorId);
    setQuantity(booking.quantity);
    setBookingDateTime(booking.bookingDateTime);
    setEditingBookingId(booking.id);
    setIsAddingBooking(true);
  };

  const resetForm = () => {
    setFacilityId("");
    setVisitorId("");
    setQuantity(1);
    setBookingDateTime("");
    setIsAddingBooking(false);
    setEditingBookingId(null);
  };

  return (
    <div>
      <h2>Booking List</h2>
      <button onClick={() => { resetForm(); setIsAddingBooking(!isAddingBooking); }}>
        {isAddingBooking ? "Cancel" : "Add New Booking"}
      </button>

      {isAddingBooking && (
        <form onSubmit={editingBookingId ? handleEditBooking : handleAddBooking}>
          <select
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            required
          >
            <option value="">Select Facility</option>
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>

          <select
            value={visitorId}
            onChange={(e) => setVisitorId(e.target.value)}
            required
          >
            <option value="">Select Visitor</option>
            {visitors.map((visitor) => (
              <option key={visitor.id} value={visitor.id}>
                {visitor.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
          />
          <input
            type="datetime-local"
            placeholder="Booking Date and Time"
            value={bookingDateTime}
            onChange={(e) => setBookingDateTime(e.target.value)}
            required
          />
          <button type="submit">
            {editingBookingId ? "Update Booking" : "Create Booking"}
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Visitor Name</th>
            <th>Facility Name</th>
            <th>Amenities</th>
            <th>Quantity</th>
            <th>Booking Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.visitor.name}</td>
              <td>{booking.facility.name}</td>
              <td>{booking.facility.amenities.join(", ")}</td>
              <td>{booking.quantity}</td>
              <td>{new Date(booking.bookingDateTime).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditClick(booking)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
