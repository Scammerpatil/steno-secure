"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const ManageRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/admin/requests");
        setRequests(res.data.requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);
  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Manage Requests
      </h1>
      <div className="overflow-x-auto">
        <table className="table w-full bg-base-300 rounded-box">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((request: any, index) => (
                <tr key={request._id}>
                  <td>{request._id}</td>
                  <td>{request.userId._id}</td>
                  <td>{request.userId.name}</td>
                  <td>{request.userId.email}</td>
                  <td>{request.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageRequestsPage;
