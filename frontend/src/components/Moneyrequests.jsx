import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftRight, CheckCircle, XCircle, Clock } from 'lucide-react';

const MoneyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("received");

  const fetchRequests = async (type) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return [];
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/moneyrequest/moneyRequests?type=${type}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${type} money requests:`, error);
      alert(`Failed to fetch ${type} requests. Please try again.`);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const received = await fetchRequests("received");
      const sent = await fetchRequests("sent");
      setRequests(received);
      setSentRequests(sent);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleAction = async (requestId, action) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/v1/moneyrequest/handleRequest`,
        { requestId, action },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert(`Request ${action === "accepted" ? "accepted" : "rejected"} successfully.`);

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: action } : request
        )
      );
      setSentRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: action } : request
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderRequest = (request, isSent) => (
    <div key={request._id} className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-lg font-semibold">
            {isSent ? "To: " : "From: "}
            {isSent ? request.receiverId.FirstName : request.senderId.FirstName}{" "}
            {isSent ? request.receiverId.LastName : request.senderId.LastName}
          </p>
          <p className="text-gray-600">
            {!isSent ? "To: " : "From: "}
            {!isSent ? request.receiverId.FirstName : request.senderId.FirstName}{" "}
            {!isSent ? request.receiverId.LastName : request.senderId.LastName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">₹{request.amount.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{new Date(request.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{request.description || "No description provided"}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {request.status === "pending" && <Clock className="text-yellow-500 mr-2" />}
          {request.status === "accepted" && <CheckCircle className="text-green-500 mr-2" />}
          {request.status === "rejected" && <XCircle className="text-red-500 mr-2" />}
          <span className={`font-semibold ${
            request.status === "pending" ? "text-yellow-700" :
            request.status === "accepted" ? "text-green-700" : "text-red-700"
          }`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
        {!isSent && request.status === "pending" && (
          <div className="space-x-2">
            <button
              onClick={() => handleAction(request._id, "accepted")}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
            >
              Accept
            </button>
            <button
              onClick={() => handleAction(request._id, "rejected")}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const sortedRequests = (requests) => {
    return requests.sort((a, b) => {
      const statusOrder = { pending: 0, accepted: 1, rejected: 2 };
      const statusCompare = statusOrder[a.status] - statusOrder[b.status];

      if (statusCompare === 0) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      return statusCompare;
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Money Requests</h1>

        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex justify-center mb-4">
            <button
              className={`px-6 py-2 rounded-full ${
                activeTab === "received"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-colors duration-300 mr-4`}
              onClick={() => setActiveTab("received")}
            >
              Requests for Me
            </button>
            <button
              className={`px-6 py-2 rounded-full ${
                activeTab === "sent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-colors duration-300`}
              onClick={() => setActiveTab("sent")}
            >
              Requests Sent by Me
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === "received" ? (
                sortedRequests(requests).length === 0 ? (
                  <p className="text-center text-gray-600">No money requests available.</p>
                ) : (
                  sortedRequests(requests).map((request) => renderRequest(request, false))
                )
              ) : (
                sortedRequests(sentRequests).length === 0 ? (
                  <p className="text-center text-gray-600">No sent money requests available.</p>
                ) : (
                  sortedRequests(sentRequests).map((request) => renderRequest(request, true))
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoneyRequests;
