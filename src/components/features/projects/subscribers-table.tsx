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
import { Search, RotateCw, Download, Monitor, Smartphone, Globe } from "lucide-react";

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

  const getSourceDisplay = (source: string | null) => {
    if (!source) return <span className="text-slate-400 italic">Unknown</span>;
    // Assuming source is a widget name or ID, we truncate it if it's an ID
    // If it's a name, we show it.
    // For now, let's just show it.
    return <span className="font-medium text-indigo-600">{source}</span>;
  };

  // Simplified for sidebar - we might want to hide some columns or make them scrollable
  // User requested: "aumenta la columna que indique de que widget salió cada subscriber [esta columna debe aparecer a la izquierda de la columna de email]"

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReload}
          disabled={isPending}
          className="h-9 w-9 text-slate-500"
          title="Refresh"
        >
          <RotateCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden flex-1 bg-white shadow-sm">
        <div className="overflow-x-auto h-full">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[120px] pl-4">Source</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No subscribers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-4 font-medium text-xs whitespace-nowrap">
                      <span className="font-medium text-orange-600">{getSourceDisplay(subscriber.source)}</span>
                    </TableCell>

                    <TableCell className="text-sm font-medium text-slate-700">
                      {subscriber.email}
                    </TableCell>

                    <TableCell className="text-xs text-slate-500">
                      {subscriber.metadata?.city || subscriber.metadata?.country ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">
                            {subscriber.metadata.city || "Unknown City"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {subscriber.metadata.country || subscriber.metadata.countryCode || "Unknown Country"}
                          </span>
                        </div>
                      ) : (
                        <span className="italic text-slate-400">Unknown</span>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-slate-500">
                      {subscriber.metadata?.device?.type ? (
                        <div className="flex items-center gap-2">
                          {subscriber.metadata.device.type === 'mobile' ? (
                            <Smartphone className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Monitor className="w-4 h-4 text-slate-400" />
                          )}
                          <div className="flex flex-col">
                            <span className="capitalize font-medium text-slate-700">
                              {subscriber.metadata.device.type}
                            </span>
                            <span className="text-[10px] text-slate-400 max-w-[100px] truncate" title={`${subscriber.metadata.device.vendor || ''} ${subscriber.metadata.device.model || ''}`}>
                              {[subscriber.metadata.device.vendor, subscriber.metadata.device.model].filter(Boolean).join(" ") || "Generic"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="italic text-slate-400">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">
                            {subscriber.metadata?.browser?.name || 'Unknown Browser'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {subscriber.metadata?.os?.name || 'Unknown OS'} {subscriber.metadata?.os?.version || ''}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(subscriber.subscribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="text-xs text-slate-400 text-center pt-1">
        {filteredSubscribers.length} subscriber{filteredSubscribers.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
