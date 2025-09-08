"use client";

import React from "react";
import axios from "axios";

export default function TestPage() {
  const checkCurrentUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/method/frappe.auth.get_logged_user",
        { withCredentials: true }
      );
      
      if (res.data.message) {
        alert("Current User: " + res.data.message);
      } else {
        alert("No user logged in");
      }
    } catch (err: any) {
      alert(
        "Error: " + JSON.stringify(err.response?.data || err.message)
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Check User</h1>
      <button
        onClick={checkCurrentUser}
        className="bg-green-500 text-white p-2 rounded"
      >
        Check Current User
      </button>
    </div>
  );
}