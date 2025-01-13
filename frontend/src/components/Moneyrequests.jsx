import React, { useEffect, useState } from "react";
import axios from "axios";

const MoneyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("received");

  // Consolidate fetching requests for both received and sent types
  const fetchRequests = async (type) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
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
      console.error(`Error fetching ${type} money requests:`, error.response?.data || error.message);
      alert(`Failed to fetch ${type} requests. Please try again.`);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const received = await fetchRequests("received");
      const sent = await fetchRequests("sent");
      setRequests(received);
      setSentRequests(sent);
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
      const response = await axios.post(
        `http://localhost:8080/api/v1/moneyrequest/handleRequest`,
        { requestId, action },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert(`Request ${action === "accepted" ? "accepted" : "rejected"} successfully.`);

      // Update the requests list
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      setSentRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error(`Error ${action}ing request:`, error.response?.data || error.message);
      alert(`Failed to ${action} request. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderRequest = (request, isSent) => (
    <div key={request._id} className="flex justify-between items-center border-b py-4">
      <div>
        <p><strong>From:</strong> {request.senderId.FirstName} {request.senderId.LastName}</p>
        <p><strong>To:</strong> {request.receiverId.FirstName} {request.receiverId.LastName} </p>
        <p><strong>Amount:</strong> ₹{request.amount}</p>
        <p><strong>Description:</strong> {request.description || "No description provided"}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>Requested At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
      </div>
      <div className="flex gap-2">
        {!isSent && request.status === "pending" && (
          <>
            <button
              onClick={() => handleAction(request._id, "accepted")}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
            >
              Accept
            </button>
            <button
              onClick={() => handleAction(request._id, "rejected")}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"}`}
            >
              Reject
            </button>
          </>
        )}
        {!isSent && request.status !== "pending" && (
          <p
            className={`text-sm p-3 rounded-xl font-bold ${request.status === "accepted" ? "bg-green-300 text-green-800" : "bg-red-300 text-red-800"}`}
          >
             {request.status}
          </p>
        )}
        {isSent &&  (
          <p
            className={`text-sm p-3 rounded-xl font-bold ${
              request.status === "accepted"
                ? "bg-green-300 text-green-800"
                : request.status === "rejected"
                ? "bg-red-300 text-red-800"
                : "bg-yellow-300 text-yellow-800"
            }`}
          >
            {request.status}
          </p>
        )}
      </div>
    </div>
  );

  const sortedRequests = (requests) => {
    return requests.sort((a, b) => {
      const statusOrder = { pending: 0, accepted: 1, rejected: 2 };
      const statusCompare = statusOrder[a.status] - statusOrder[b.status];

      // If status is the same, compare by createdAt date in descending order
      if (statusCompare === 0) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return statusCompare;
    });
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Money Requests</h1>

      {/* Tab Navigation */}
      <div className="flex mb-4 space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "received" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("received")}
        >
          Requests for Me
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "sent" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("sent")}
        >
          Requests Sent by Me
        </button>
      </div>

      {/* Requests Display */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-4">
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
    </div>
  );
};

export default MoneyRequests;
