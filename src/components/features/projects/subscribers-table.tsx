"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  subscribedAt: Date;
  metadata: {
    city?: string;
    country?: string;
    countryCode?: string;
    device?: { type?: string; vendor?: string; model?: string };
    browser?: { name?: string; version?: string };
    os?: { name?: string; version?: string };
    [key: string]: unknown;
  } | null;
};

type SubscribersTableProps = {
  subscribers: Subscriber[];
  projectId: string;
};

export function SubscribersTable({
  subscribers,
  projectId,
}: SubscribersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReload = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const getLocation = (sub: Subscriber) => {
    if (!sub.metadata?.city && !sub.metadata?.country) return "-";
    const parts = [
      sub.metadata?.city,
      sub.metadata?.countryCode || sub.metadata?.country,
    ].filter(Boolean);
    return parts.join(", ") || "-";
  };

  const getDevice = (sub: Subscriber) => {
    const type = sub.metadata?.device?.type || "desktop";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getBrowser = (sub: Subscriber) => {
    return sub.metadata?.browser?.name || "-";
  };

  const getOS = (sub: Subscriber) => {
    return sub.metadata?.os?.name || "-";
  };

  const handleExportCSV = () => {
    const headers = [
      "Email",
      "Source",
      "Location",
      "Device",
      "Browser",
      "OS",
      "Subscribed At",
    ];
    const rows = filteredSubscribers.map((sub) => [
      sub.email,
      sub.source || "widget",
      getLocation(sub),
      getDevice(sub),
      getBrowser(sub),
      getOS(sub),
      new Date(sub.subscribedAt).toISOString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${projectId}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (subscribers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-slate-600 mb-1">No subscribers yet</p>
        <p className="text-sm text-slate-500 mb-4">
          Install the widget on your website to start collecting emails
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReload}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReload}
            disabled={isPending}
            title="Refresh subscribers"
          >
            <svg
              className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">
                  {subscriber.email}
                </TableCell>
                <TableCell className="text-slate-500">
                  {getLocation(subscriber)}
                </TableCell>
                <TableCell className="text-slate-500">
                  {getDevice(subscriber)}
                </TableCell>
                <TableCell className="text-slate-500">
                  {getBrowser(subscriber)}
                </TableCell>
                <TableCell className="text-slate-500">
                  {getOS(subscriber)}
                </TableCell>
                <TableCell className="text-slate-500">
                  {new Date(subscriber.subscribedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-slate-500">
        Showing {filteredSubscribers.length} of {subscribers.length} subscribers
      </p>
    </div>
  );
}
