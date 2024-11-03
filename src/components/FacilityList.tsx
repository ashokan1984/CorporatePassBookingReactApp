import React, { useState, useEffect } from "react";
import httpService from "../services/httpService";
import "./FacilityList.css";

interface Facility {
  id: string;
  name: string;
  type: string;
  totalCapacity: number;
  location: string;
  amenities: string[];
}

const FacilityList = (): JSX.Element => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [totalCapacity, setTotalcapacity] = useState(0);
  const [location, setLocation] = useState("");
  const [amenities, setAmenities] = useState("");
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [facilitiesPerPage] = useState(5); // Change this value for more or less facilities per page

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await httpService.get("Facility/GetAll");
        setFacilities(response.data);
      } catch (error) {
        console.error("Failed to fetch facilities", error);
      }
    };
    fetchFacilities();
  }, []);

  const handleViewFacility = async (facilityId: string) => {
    try {
      const response = await httpService.get(`Facility/GetById/${facilityId}`);
      setSelectedFacility(response.data);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Failed to fetch facility details", error);
    }
  };

  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    const newFacility = {
      name,
      type,
      totalCapacity,
      location,
      amenities: amenities.split(",").map((amenity) => amenity.trim()),
    };

    try {
      const response = await httpService.post("facility", newFacility);
      if (response.status === 201 || response.status === 200) {
        setFacilities((prevFacilities) => [...prevFacilities, response.data]);
        resetForm();
      } else {
        console.error("Failed to add facility");
      }
    } catch (error) {
      console.error("Error adding facility:", error);
    }
  };

  const handleEditFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFacilityId) return;

    const updatedFacility = {
      id: editingFacilityId,
      name,
      type,
      totalCapacity,
      location,
      amenities: amenities.split(",").map((amenity) => amenity.trim()),
    };

    try {
      const response = await httpService.put(`facility/${editingFacilityId}`, updatedFacility);
      if (response.status === 200 || response.status === 201) {
        const updatedFacilities = facilities.map((facility) =>
          facility.id === editingFacilityId ? response.data : facility
        );
        setFacilities(updatedFacilities);
        resetForm();
      } else {
        console.error("Failed to update facility");
      }
    } catch (error) {
      console.error("Error updating facility:", error);
    }
  };

  const handleEditClick = (facility: Facility) => {
    setName(facility.name);
    setType(facility.type);
    setTotalcapacity(facility.totalCapacity);
    setLocation(facility.location);
    setAmenities(facility.amenities.join(", "));
    setEditingFacilityId(facility.id);
    setIsAddingFacility(true);
  };

  const resetForm = () => {
    setName("");
    setType("");
    setTotalcapacity(0);
    setLocation("");
    setAmenities("");
    setIsAddingFacility(false);
    setEditingFacilityId(null);
  };

  // Pagination logic
  const indexOfLastFacility = currentPage * facilitiesPerPage;
  const indexOfFirstFacility = indexOfLastFacility - facilitiesPerPage;
  const currentFacilities = facilities.slice(indexOfFirstFacility, indexOfLastFacility);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Facility List</h2>
      <button onClick={() => setIsAddingFacility(!isAddingFacility)}>
        {isAddingFacility ? "Cancel" : "Add New Facility"}
      </button>

      {isAddingFacility && (
        <form onSubmit={editingFacilityId ? handleEditFacility : handleAddFacility}>
          <input
            type="text"
            placeholder="Facility Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={totalCapacity}
            onChange={(e) => setTotalcapacity(parseInt(e.target.value))}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Amenities (comma-separated)"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
          />
          <button type="submit">
            {editingFacilityId ? "Update Facility" : "Create Facility"}
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Facility ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Total Capacity</th>
            <th>Location</th>
            <th>Amenities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentFacilities.map((facility) => (
            <tr key={facility.id}>
              <td>{facility.id}</td>
              <td>{facility.name}</td>
              <td>{facility.type}</td>
              <td>{facility.totalCapacity}</td>
              <td>{facility.location}</td>
              <td>{facility.amenities.join(", ")}</td>
              <td>
                <button onClick={() => handleEditClick(facility)} style={{ marginRight: '10px' }}>Edit</button>
                <button onClick={() => handleViewFacility(facility.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(facilities.length / facilitiesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

      {isPopupOpen && selectedFacility && (
        <div className="popup">
          <div className="popup-content">
            <h3>Facility Details</h3>
            <table>
              <tbody>
                <tr>
                  <td><strong>ID:</strong></td>
                  <td>{selectedFacility.id}</td>
                </tr>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{selectedFacility.name}</td>
                </tr>
                <tr>
                  <td><strong>Type:</strong></td>
                  <td>{selectedFacility.type}</td>
                </tr>
                <tr>
                  <td><strong>Capacity:</strong></td>
                  <td>{selectedFacility.totalCapacity}</td>
                </tr>
                <tr>
                  <td><strong>Location:</strong></td>
                  <td>{selectedFacility.location}</td>
                </tr>
                <tr>
                  <td><strong>Amenities:</strong></td>
                  <td>{selectedFacility.amenities.join(", ")}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={() => setIsPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityList;
