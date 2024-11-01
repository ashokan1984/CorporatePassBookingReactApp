import React, { useState, useEffect } from "react";
import httpService from "../services/httpService";
import './VisitorList.css';

interface VisitorsData {
  visitorId: number
    name: string,
    email: string,
    phoneNumber: string
}

const VisitorList = (): JSX.Element => {
  const [visitors, setVisitors] = useState<VisitorsData[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      let response = await httpService.get("visitors");
      setVisitors(response.data);
    };
    fetchPost();
  }, []);

  // getting current item records
  const onEditClick = (item: VisitorsData): void => {
    alert(item.name);
  };

  return (
    <table>
      <tr>
        <th>Visitor Id</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
      </tr>
      <tbody>
        {(visitors ?? []).map((item) => (
          <tr>
            <td>{item.visitorId}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.phoneNumber}</td>
            <td>
              <button onClick={() => onEditClick(item)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default VisitorList;
