// components/FacilityList.tsx
import React, { useEffect, useState } from 'react';
import { Facility, getFacilities } from '../services/api';

const FacilityList: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    getFacilities()
      .then(response => setFacilities(response.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Facilities</h2>
      <ul>
        {facilities.map(facility => (
          <li key={facility.id}>{facility.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FacilityList;
