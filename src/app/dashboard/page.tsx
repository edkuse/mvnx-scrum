"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Boxes, CheckCircle, Clock, Layers3, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const [activeAppCount, setActiveAppCount] = useState<number | null>(null);
  const [epicCount, setEpicCount] = useState<number | null>(null);
  const [activeTaskCount, setActiveTaskCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchActiveApps() {
      try {
        const res = await fetch(`${API_URL}/applications/`);
        const data = await res.json();
        const activeCount = Array.isArray(data)
          ? data.filter((app) => app.active).length
          : 0;
        setActiveAppCount(activeCount);
      } catch {
        setActiveAppCount(null);
      }
    }
    fetchActiveApps();
  }, []);

  useEffect(() => {
    async function fetchEpics() {
      try {
        const res = await fetch(`${API_URL}/epics/`);
        const data = await res.json();
        setEpicCount(Array.isArray(data) ? data.length : 0);
      } catch {
        setEpicCount(null);
      }
    }
    fetchEpics();
  }, []);

  useEffect(() => {
    async function fetchActiveTasks() {
      try {
        const res = await fetch(`${API_URL}/stories/`);
        const data = await res.json();
        const activeCount = Array.isArray(data)
          ? data.filter((story) => story.status !== 'Done').length
          : 0;
        setActiveTaskCount(activeCount);
      } catch {
        setActiveTaskCount(null);
      }
    }
    fetchActiveTasks();
  }, []);

  const stats = [
    {
      name: "Applications",
      value: activeAppCount === null ? "-" : activeAppCount,
      icon: Boxes,
      iconColor: "text-blue-500",
    },
    {
      name: "Epics",
      value: epicCount === null ? "-" : epicCount,
      icon: Layers3,
      iconColor: "text-purple-500",
    },
    {
      name: "Active Tasks",
      value: activeTaskCount === null ? "-" : activeTaskCount,
      icon: CheckCircle,
      iconColor: "text-green-500",
      href: "/stories",
    },
    {
      name: "Active Sprints",
      value: "2",
      icon: Flag,
      iconColor: "text-orange-500",
    },
    {
      name: "Hours Logged",
      value: "320",
      icon: Clock,
      iconColor: "text-pink-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-base text-gray-500">
          Welcome to your <span className="font-semibold text-gray-900">MVNx Scrum</span> dashboard
        </p>
      </div>

      <div className="flex gap-4 flex-wrap mb-6">
        {stats.map((stat) => {
          const isLink = stat.href !== undefined;
          const href = stat.href;
          const card = (
            <Card key={stat.name} className="min-w-[220px] flex-1 shadow-md bg-white transition duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-100">
                  <stat.icon className={cn("h-7 w-7", stat.iconColor)} />
                </div>
                <div>
                  <CardDescription className="text-gray-500 text-sm">{stat.name}</CardDescription>
                  <CardTitle className="text-2xl text-gray-900">{stat.value}</CardTitle>
                </div>
              </CardContent>
            </Card>
          );
          return isLink && href ? (
            <Link key={stat.name} href={href} className="flex-1 min-w-[220px]" tabIndex={-1}>
              {card}
            </Link>
          ) : card;
        })}
      </div>

      <div className="flex gap-6 flex-wrap">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="mb-2">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 space-y-4">
              {/* Add activity feed here */}
              <span className="text-gray-400 text-sm">No recent activity</span>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="mb-2">Upcoming Sprints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 space-y-4">
              {/* Add sprint list here */}
              <span className="text-gray-400 text-sm">No upcoming sprints</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 