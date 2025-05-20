"use client";
import { useUser } from "@/context/AuthProvider";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import {
  IconUserCheck,
  IconUsersGroup,
  IconCertificate,
  IconEye,
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

export default function AdminDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    users: 0,
    candidates: 0,
    suspects: 0,
    verifiedCandidates: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/admin/dashboard");
      setStats(res.data.stats);
    };
    fetchData();
  }, []);

  const chartData = [
    { name: "Week 1", candidates: 25, exams: 5 },
    { name: "Week 2", candidates: 60, exams: 10 },
    { name: "Week 3", candidates: 110, exams: 16 },
    { name: "Week 4", candidates: stats.candidates, exams: 50 },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-3 text-center uppercase">
        Admin Dashboard
      </h1>

      <div className="stats shadow w-full bg-base-300">
        <StatCard
          color="primary"
          icon={<IconUsersGroup size={36} />}
          title="Total Users"
          value={stats.users}
          desc="All system accounts"
        />
        <StatCard
          color="accent"
          icon={<IconUserCheck size={36} />}
          title="Candidates"
          value={stats.candidates}
          desc="Registered for exams"
        />
        <StatCard
          color="info"
          icon={<IconEye size={36} />}
          title="Suspects"
          value={stats.suspects}
          desc="Uploaded in database"
        />
        <StatCard
          color="success"
          icon={<IconCertificate size={36} />}
          title="Verified Candidates"
          value={stats.verifiedCandidates}
          desc="Passed document verification"
        />

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src={user?.profileImage} alt="user" />
              </div>
            </div>
          </div>
          <div className="stat-value">{user?.name}</div>
          <div className="stat-title">Admin Logged In</div>
          <div className="stat-desc text-secondary">{user?.email}</div>
        </div>
      </div>

      <div className="mt-3 bg-base-300 p-6 rounded-box shadow w-full">
        <h2 className="text-xl font-semibold mb-4 text-center uppercase">
          Weekly Candidate & Exam Growth
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="candidates"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorC)"
            />
            <Area
              type="monotone"
              dataKey="exams"
              stroke="#16a34a"
              fillOpacity={1}
              fill="url(#colorE)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
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
  value: number;
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
