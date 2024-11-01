import React from 'react';
// import { Link } from 'react-router-dom';
import httpService from '../services/httpService';

interface VisitorRequestPayload {
    name: string,
    email: string,
    phoneNumber: string,
    visitorId:number,
    // address:VisitorAddress[]
}

// interface VisitorAddress {
//     street:string,
//     state:string,
//     pinCode:number;

// }
function Visitor() {

    const addVisitors = async (requestBody: VisitorRequestPayload) => {
        const response = await httpService.post("visitor/save", requestBody);

        alert(response.data);
      };
    
      const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const { userName, phone,email } = event.currentTarget;
    
        const requestBody: VisitorRequestPayload = {
          name: userName.value,
          email: email.value,
          phoneNumber: phone.value,
          visitorId:1
        };

        addVisitors(requestBody);
      };
      
  return (
    <div className="form-container">
      <h2>Visitor Form</h2>
      {/* <Link to="/visitor-list">Visitor List</Link> */}
      <form action="/submit" method="post" onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="userName" required />

        <label htmlFor="phone">Phone Number:</label>
        <input type="tel" id="phone" name="phone" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Visitor;
