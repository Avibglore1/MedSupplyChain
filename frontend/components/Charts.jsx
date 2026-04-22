"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#16a34a", "#dc2626"];

export function LicenseTrendChart({ data }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-sm font-semibold mb-4 text-gray-700">
        License Activity Trend
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LicenseStatusChart({ valid, revoked }) {
  const data = [
    { name: "Valid", value: valid },
    { name: "Revoked", value: revoked },
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-sm font-semibold mb-4 text-gray-700">
        License Distribution
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}