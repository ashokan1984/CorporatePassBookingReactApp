import React, { useState, useEffect } from "react";
import httpService from "../services/httpService";
import './VisitorList.css';

interface VisitorsData {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

const VisitorList = (): JSX.Element => {
  const [visitors, setVisitors] = useState<VisitorsData[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAddingVisitor, setIsAddingVisitor] = useState(false);
  const [editingVisitorId, setEditingVisitorId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorsData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch all visitors
  const fetchVisitors = async () => {
    try {
      const response = await httpService.get("Visitor/GetAll");
      setVisitors(response.data);
    } catch (error) {
      console.error("Failed to fetch visitors", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Function to fetch a single visitor's details
  const fetchVisitorDetails = async (id: number) => {
    try {
      const response = await httpService.get(`Visitor/GetById/${id}`);
      setSelectedVisitor(response.data);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Failed to fetch visitor details", error);
    }
  };

  // Add visitor function
  const handleAddVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVisitor = { name, email, phoneNumber };

    try {
      const response = await httpService.post("Visitor/Create", newVisitor);
      if (response.status === 200 || response.status === 201) {
        const createdVisitor = response.data;
        setVisitors((prevVisitors) => [...prevVisitors, createdVisitor]);
        setNotification("Visitor added successfully!");
        resetForm();
      } else {
        setNotification("Failed to add visitor.");
      }
    } catch (error) {
      setNotification("Error adding visitor. Please try again.");
      console.error("Error adding visitor:", error);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  // Edit visitor function
  const handleEditVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVisitorId === null) return;

    const updatedVisitor = { id: editingVisitorId, name, email, phoneNumber };

    try {
      const response = await httpService.put("Visitor/Update", updatedVisitor);

      if (response.status === 200 || response.status === 201) {
        const updatedVisitorData = response.data;

        // Update the specific visitor in the list
        setVisitors((prevVisitors) =>
          prevVisitors.map(visitor =>
            visitor.id === editingVisitorId ? updatedVisitorData : visitor
          )
        );
        setNotification("Visitor updated successfully!");
        resetForm();

        // Optionally re-fetch all visitors after update to ensure full sync with backend
        await fetchVisitors();
      } else {
        setNotification("Failed to update visitor.");
      }
    } catch (error) {
      setNotification("Error updating visitor. Please try again.");
      console.error("Error updating visitor:", error);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  // Edit button click
  const handleEditClick = (visitor: VisitorsData) => {
    setName(visitor.name);
    setEmail(visitor.email);
    setPhoneNumber(visitor.phoneNumber);
    setEditingVisitorId(visitor.id);
    setIsAddingVisitor(true);
  };

  // View button click
  const handleViewClick = (id: number) => {
    fetchVisitorDetails(id);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisitors = visitors.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(visitors.length / itemsPerPage)));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setIsAddingVisitor(false);
    setEditingVisitorId(null);
  };

  // Close popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedVisitor(null);
  };

  return (
    <div>
      <h2>Visitor List</h2>
      <button onClick={() => setIsAddingVisitor(!isAddingVisitor)}>
        {isAddingVisitor ? "Cancel" : "Add New Visitor"}
      </button>

      {isAddingVisitor && (
        <form onSubmit={editingVisitorId ? handleEditVisitor : handleAddVisitor}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <button type="submit">
            {editingVisitorId ? "Update Visitor" : "Create Visitor"}
          </button>
        </form>
      )}

      {notification && <div className="notification">{notification}</div>}

      <table>
        <thead>
          <tr>
            <th>Visitor Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVisitors.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phoneNumber}</td>
              <td>
                <button onClick={() => handleEditClick(item)}>Edit</button>
                <button onClick={() => handleViewClick(item.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(visitors.length / itemsPerPage)}>Next</button>
      </div>

      {/* Popup for viewing visitor details */}
      {isPopupOpen && selectedVisitor && (
  <div className="popup">
    <div className="popup-content">
      <h3>Visitor Details</h3>
      <table className="popup-table">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{selectedVisitor.id}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{selectedVisitor.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{selectedVisitor.email}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{selectedVisitor.phoneNumber}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={closePopup}>Close</button>
    </div>
  </div>
)}
    </div>
  );
};

export default VisitorList;
