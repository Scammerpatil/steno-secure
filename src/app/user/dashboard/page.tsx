"use client";
import { useUser } from "@/context/AuthProvider";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import {
  IconUser,
  IconFileText,
  IconCalendar,
  IconCheck,
} from "@tabler/icons-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function UserDashboard() {
  const { user } = useUser();
  const [examAttempts, setExamAttempts] = useState<any[]>([]);
  useEffect(() => {
    setExamAttempts(user?.examAttempts || []);
  }, []);
  const chartData = examAttempts.map((attempt, index) => ({
    name: `Attempt ${index + 1}`,
    score: attempt.score,
    status: attempt.status,
  }));

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-dots"></div>
        <h1 className="text-4xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-3 text-center uppercase">
        User Dashboard
      </h1>

      <div className="stats shadow w-full bg-base-300">
        <StatCard
          color="primary"
          icon={<IconUser size={36} />}
          title="Name"
          value={user?.name}
          desc="Your full name"
        />
        <StatCard
          color="accent"
          icon={<IconFileText size={36} />}
          title="Email"
          value={user?.email}
          desc="Your registered email"
        />
        <StatCard
          color="info"
          icon={<IconCalendar size={36} />}
          title="Date of Birth"
          value={new Date(user?.dob).toLocaleDateString()}
          desc="Your date of birth"
        />
        <StatCard
          color="success"
          icon={<IconCheck size={36} />}
          title="Contact"
          value={user?.contact}
          desc="Your contact number"
        />

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img
                  src={user?.profileImage || "/default-avatar.png"}
                  alt="user"
                />
              </div>
            </div>
          </div>
          <div className="stat-value">{user?.name}</div>
          <div className="stat-title">Logged In</div>
          <div className="stat-desc text-secondary">{user?.email}</div>
        </div>
      </div>

      <div className="mt-3 bg-base-300 p-6 rounded-box shadow w-full">
        <h2 className="text-xl font-semibold mb-4 text-center uppercase">
          Your Exam Attempts
        </h2>
        {examAttempts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center">No exam attempts yet.</div>
        )}
      </div>

      <div className="mt-6 p-6 bg-base-300 shadow rounded-box w-full">
        <h2 className="text-xl font-semibold mb-4 text-center uppercase">
          Aadhar Card Status
        </h2>
        {user?.aadharCard ? (
          <div>
            <div className="flex justify-between">
              <span className="font-bold">Aadhar Number</span>
              <span>{user.aadharCard.number}</span>
            </div>
            <div className="mt-2">
              <img
                src={user.aadharCard.image}
                alt="Aadhar Card"
                className="w-full max-w-sm mx-auto"
              />
            </div>
            <div className="mt-2 text-center">
              <span
                className={`badge ${
                  user.currentlyAllowed ? "badge-success" : "badge-error"
                }`}
              >
                {user.currentlyAllowed ? "Allowed" : "Not Allowed"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center">No Aadhar Card uploaded.</div>
        )}
      </div>
    </>
  );
}

const StatCard = ({
  icon,
  title,
  value,
  color,
  desc,
}: {
  icon: JSX.Element;
  title: string;
  value: string | number;
  color: string;
  desc?: string;
}) => (
  <div className="stat">
    <div className={`stat-figure text-${color}`}>{icon}</div>
    <div className="stat-title">{title}</div>
    <div className={`stat-value text-${color}`}>{value}</div>
    {desc && <div className="stat-desc">{desc}</div>}
  </div>
);
