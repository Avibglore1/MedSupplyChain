"use client";
import { useState, useEffect } from "react";
import { getSocket } from "@/utils/socket";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchKPIs,
  fetchLicenses,
  revokeLicense,
  prolongLicense,
  fetchActivities,
} from "@/services/api";

export default function GovDashboard() {
  const [liveLogs, setLiveLogs] = useState([]);
  const queryClient = useQueryClient();

  const { data: kpis } = useQuery({
    queryKey: ["kpis"],
    queryFn: fetchKPIs,
  });

  const { data: licenses } = useQuery({
    queryKey: ["licenses"],
    queryFn: fetchLicenses,
  });

  const { data: activities } = useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
    refetchInterval: 5000,
  });

  const revokeMutation = useMutation({
    mutationFn: revokeLicense,
    onSuccess: () => queryClient.invalidateQueries(["licenses"]),
  });

  const prolongMutation = useMutation({
    mutationFn: prolongLicense,
    onSuccess: () => queryClient.invalidateQueries(["licenses"]),
  });

  useEffect(() => {
    const socket = getSocket();

    socket.on("license_update", (data) => {
      setLiveLogs((prev) => [data, ...prev]);
    });

    return () => socket.off("license_update");
  }, []);

  const combinedLogs = [...liveLogs, ...(activities || [])];

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Government Control Panel
        </h1>
        <span className="text-sm text-gray-500">
          Regulatory Monitoring System
        </span>
      </div>

      {/* KPI Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-blue-600">
          <p className="text-gray-500 text-sm">Drug Types</p>
          <h2 className="text-2xl font-semibold text-gray-800">
            {kpis?.drugTypes || 0}
          </h2>
        </div>

        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-green-600">
          <p className="text-gray-500 text-sm">Valid Licenses</p>
          <h2 className="text-2xl font-semibold text-gray-800">
            {kpis?.validLicenses || 0}
          </h2>
        </div>

        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-red-600">
          <p className="text-gray-500 text-sm">Revoked Licenses</p>
          <h2 className="text-2xl font-semibold text-gray-800">
            {kpis?.revokedLicenses || 0}
          </h2>
        </div>
      </div>

      {/* License Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          License Management
        </h2>

        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Drug</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Expiry</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {licenses?.map((lic) => (
              <tr key={lic._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{lic.drugTypes}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      lic.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {lic.status}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(lic.expiresAt).toLocaleDateString()}
                </td>

                <td className="p-3 flex justify-center gap-2">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    onClick={() => revokeMutation.mutate(lic._id)}
                  >
                    Revoke
                  </button>

                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    onClick={() => prolongMutation.mutate(lic._id)}
                  >
                    Prolong
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Feed */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Live Activity Feed
        </h2>

        <div className="h-72 overflow-y-auto space-y-3">
          {combinedLogs.map((log, i) => (
            <div
              key={i}
              className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded"
            >
              <p className="text-sm text-gray-800">{log.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}