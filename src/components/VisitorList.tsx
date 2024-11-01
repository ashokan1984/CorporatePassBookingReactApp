import React, { useState, useEffect } from "react";
import httpService from "../services/httpService";
import './VisitorList.css';

interface VisitorsData {
  id: number;  // Unique identifier for the visitor
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

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await httpService.get("Visitor/GetAll");
        setVisitors(response.data);
      } catch (error) {
        console.error('Failed to fetch visitors', error);
      }
    };
    fetchVisitors();
  }, []);

  const handleAddVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVisitor = { name, email, phoneNumber };

    try {
      const response = await httpService.post("visitor", newVisitor);

      if (response.status === 201) {
        const createdVisitor = response.data; // Adjust based on your API response
        setVisitors((prevVisitors) => [...prevVisitors, createdVisitor]);
        resetForm(); // Reset the form
      } else {
        console.error('Failed to add visitor');
      }
    } catch (error) {
      console.error('Error adding visitor:', error); // Log error if request fails
    }
  };

  const handleEditVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVisitorId === null) return;

    const updatedVisitor = { id: editingVisitorId, name, email, phoneNumber };

    try {
      const response = await httpService.put(`visitor/${editingVisitorId}`, updatedVisitor);

      if (response.status === 200) {
        const updatedVisitors = visitors.map(visitor => 
          visitor.id === editingVisitorId ? response.data : visitor
        );
        setVisitors(updatedVisitors);
        resetForm();
      } else {
        console.error('Failed to update visitor');
      }
    } catch (error) {
      console.error('Error updating visitor:', error);
    }
  };

  const handleEditClick = (visitor: VisitorsData) => {
    setName(visitor.name);
    setEmail(visitor.email);
    setPhoneNumber(visitor.phoneNumber);
    setEditingVisitorId(visitor.id); // Set the visitorId for the editing context
    setIsAddingVisitor(true); // Show the form in edit mode
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setIsAddingVisitor(false);
    setEditingVisitorId(null); // Reset editingVisitorId
  };

  return (
    <div>
      <h2>Visitor List</h2>
      <button onClick={() => setIsAddingVisitor(!isAddingVisitor)}>
        {isAddingVisitor ? 'Cancel' : 'Add New Visitor'}
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
            {editingVisitorId ? 'Update Visitor' : 'Create Visitor'} {/* Ensure the button reflects the action */}
          </button>
        </form>
      )}

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
          {visitors.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phoneNumber}</td>
              <td>
                <button onClick={() => handleEditClick(item)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorList;
