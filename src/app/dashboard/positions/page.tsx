"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, RefreshCw, AlertCircle } from "lucide-react";

// Update this with your actual positions API endpoint
const POSITIONS_API_BASE = 'https://trialnestjs-1.onrender.com/positions';

interface Position {
  position_id: number;
  position_code: string;
  position_name: string;
}

export default function PositionsPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionCode, setPositionCode] = useState("");
  const [positionName, setPositionName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Check token for protected route
  const getToken = () => localStorage.getItem("accessToken");
  
  const authHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch positions from backend API
  async function fetchPositions() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${POSITIONS_API_BASE}`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        let errorMsg = `Error: ${res.status}`;
        try {
          const errData = await res.json();
          errorMsg = errData.message || errData.error || errorMsg;
        } catch (e) {
          errorMsg = res.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setPositions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch positions");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
    } else {
      fetchPositions();
    }
  }, [router]);

  // Create or Update position
  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!positionCode.trim() || !positionName.trim()) {
      setError("Both fields are required");
      return;
    }

    // Try multiple payload formats
    const payloads = [
      // Format 1: Simple camelCase
      { code: positionCode.trim(), name: positionName.trim() },
      // Format 2: snake_case
      { position_code: positionCode.trim(), position_name: positionName.trim() },
      // Format 3: Different field names
      { positionCode: positionCode.trim(), positionName: positionName.trim() },
    ];

    let payload = payloads[0]; // Start with first format

    console.log("Sending payload:", JSON.stringify(payload));

    try {
      let res: Response;
      if (editingId) {
        // Update
        res = await fetch(`${POSITIONS_API_BASE}/${editingId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        res = await fetch(`${POSITIONS_API_BASE}`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      }

      console.log("Response status:", res.status);

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        let errorMsg = `Error: ${res.status}`;
        let responseBody = '';
        try {
          responseBody = await res.text();
          console.log("Response body:", responseBody);
          const errData = JSON.parse(responseBody);
          errorMsg = errData.message || errData.error || JSON.stringify(errData) || errorMsg;
        } catch (e) {
          errorMsg = responseBody || res.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      console.log("Success response:", data);

      // Success -> refresh list
      setPositionCode("");
      setPositionName("");
      setEditingId(null);
      await fetchPositions();

    } catch (err: any) {
      setError(err.message || "Save failed");
      console.error("Save error:", err);
    }
  }

  function startEdit(p: Position) {
    setEditingId(p.position_id);
    setPositionCode(p.position_code);
    setPositionName(p.position_name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this position?")) return;
    setError(null);

    try {
      const res = await fetch(`${POSITIONS_API_BASE}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        let errorMsg = `Error: ${res.status}`;
        try {
          const errData = await res.json();
          errorMsg = errData.message || errData.error || errorMsg;
        } catch (e) {
          errorMsg = res.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      // Success -> refresh
      await fetchPositions();

    } catch (err: any) {
      setError(err.message || "Delete failed");
      console.error("Delete error:", err);
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setPositionCode("");
    setPositionName("");
    setError(null);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-black">Positions</h2>
        <button
          onClick={() => fetchPositions()}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white font-semibold rounded-lg transition-all"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Create/Update Form */}
      <div className="bg-white border-2 border-black rounded-lg p-6">
        <h3 className="text-xl font-bold text-black mb-6">
          {editingId ? "Edit Position" : "Create New Position"}
        </h3>
        <form onSubmit={handleCreateOrUpdate} className="flex flex-col gap-5 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-black uppercase tracking-wider">
                Position Code
              </label>
              <input
                className="border-2 border-black rounded-lg p-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                placeholder="e.g., MGR"
                value={positionCode}
                onChange={(e) => setPositionCode(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-black uppercase tracking-wider">
                Position Name
              </label>
              <input
                className="border-2 border-black rounded-lg p-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                placeholder="e.g., Manager"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-lg border-2 border-black transition-all"
            >
              <Plus size={20} />
              {editingId ? "Update Position" : "Create Position"}
            </button>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                type="button"
                className="px-6 bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-lg border-2 border-black transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
        {positions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 font-medium text-lg">No positions found.</p>
            <p className="text-gray-500 text-sm mt-1">Create your first position to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black text-white border-b-2 border-black">
                <tr>
                  <th className="p-4 font-bold uppercase text-sm tracking-wider">ID</th>
                  <th className="p-4 font-bold uppercase text-sm tracking-wider">Code</th>
                  <th className="p-4 font-bold uppercase text-sm tracking-wider">Name</th>
                  <th className="p-4 font-bold uppercase text-sm tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p, idx) => (
                  <tr
                    key={p.position_id}
                    className={`border-b border-gray-300 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-all`}
                  >
                    <td className="p-4 text-black font-semibold">{p.position_id}</td>
                    <td className="p-4 text-black font-medium">{p.position_code}</td>
                    <td className="p-4 text-black">{p.position_name}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="flex items-center gap-1 px-3 py-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white font-semibold rounded-md transition-all text-sm"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.position_id)}
                        className="flex items-center gap-1 px-3 py-2 bg-black hover:bg-gray-900 text-white font-semibold rounded-md transition-all text-sm border-2 border-black"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
