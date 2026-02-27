"use client";

import { useState, useMemo } from "react";
import { format, subDays, isAfter } from "date-fns";
import { ActivityCalendar } from "react-activity-calendar";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Activity, Users, Layout, MapPin } from "lucide-react";
import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface AnalyticsViewProps {
    totalWidgets: number;
    totalSubscribers: number;
    widgets: Array<{ id: string; name: string }>;
    timeData: Array<{ date: string; count: number }>;
    locationData: Array<{
        location: string;
        desktop: number;
        mobile: number;
        tablet: number;
        unknown: number;
        total: number;
    }>;
    heatmapData: Array<{ date: string; widgetId: string | null }>;
}

export function AnalyticsView({
    totalWidgets,
    totalSubscribers,
    widgets,
    timeData,
    locationData,
    heatmapData,
}: AnalyticsViewProps) {
    const [timeFilter, setTimeFilter] = useState<"24h" | "3d" | "7d" | "30d">("7d");
    const [selectedWidget, setSelectedWidget] = useState<string>("all");

    // Filter Heatmap Data
    const calendarData = useMemo(() => {
        // Process the heatmap data to sum per day
        const dayCounts = new Map<string, number>();

        heatmapData.forEach((h) => {
            // Filter by widget if applicable
            if (selectedWidget !== "all" && h.widgetId !== selectedWidget) return;

            const formattedDate = format(new Date(h.date), "yyyy-MM-dd");
            const count = dayCounts.get(formattedDate) || 0;
            dayCounts.set(formattedDate, count + 1);
        });

        // Make sure we have a year worth of data to show github style calendar
        const today = new Date();
        const data = [];
        for (let i = 365; i >= 0; i--) {
            const date = format(subDays(today, i), "yyyy-MM-dd");
            data.push({
                date,
                count: dayCounts.get(date) || 0,
                level: getLevel(dayCounts.get(date) || 0),
            });
        }

        return data;
    }, [heatmapData, selectedWidget]);

    // Aggregate time series for LineChart
    const chartTimeData = useMemo(() => {
        const today = new Date();
        let daysToSubtract = 7;
        if (timeFilter === "24h") daysToSubtract = 1;
        else if (timeFilter === "3d") daysToSubtract = 3;
        else if (timeFilter === "30d") daysToSubtract = 30;

        const cutoffDate = subDays(today, daysToSubtract);

        // Group by Date for the chart
        // For 24h we might group by hour eventually, but for now by day
        const aggregated = new Map<string, number>();

        // Initialize required dates to 0
        for (let i = daysToSubtract; i >= 0; i--) {
            const d = format(subDays(today, i), "MMM dd");
            aggregated.set(d, 0);
        }

        timeData.forEach((t) => {
            const dateObj = new Date(t.date);
            if (isAfter(dateObj, cutoffDate) || format(dateObj, "yyyy-MM-dd") === format(cutoffDate, "yyyy-MM-dd")) {
                const formattedDate = format(dateObj, "MMM dd");
                aggregated.set(formattedDate, (aggregated.get(formattedDate) || 0) + t.count);
            }
        });

        return Array.from(aggregated.entries()).map(([date, count]) => ({ date, count }));
    }, [timeData, timeFilter]);

    function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 5) return 2;
        if (count <= 10) return 3;
        return 4;
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Analytics
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Track your project's performance and audience growth.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                            Total Subscribers
                        </CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {totalSubscribers}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                            Total Widgets
                        </CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Layout className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {totalWidgets}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscriber Growth Line Chart */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            Subscriber Growth
                        </CardTitle>
                        <CardDescription>Visualizing subscriber acquisition over time</CardDescription>
                    </div>
                    <Select value={timeFilter} onValueChange={(val: any) => setTimeFilter(val)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="3d">Last 3 Days</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartTimeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dx={-10}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    name="Subscribers"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Activity Heatmap */}
                <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 h-[88px]">
                        <div>
                            <CardTitle className="text-lg">Activity Heatmap</CardTitle>
                            <CardDescription>Subscribers per widget daily</CardDescription>
                        </div>
                        <Select value={selectedWidget} onValueChange={setSelectedWidget}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Widgets" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Widgets</SelectItem>
                                {widgets.map(w => (
                                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center p-6 overflow-x-auto min-h-[160px]">
                        <div className="w-full max-w-full overflow-x-auto scrollbar-hide py-2 flex justify-end">
                            <div className="inline-block" style={{ minWidth: 'min-content' }}>
                                <ActivityCalendar
                                    data={calendarData}
                                    showWeekdayLabels={true}
                                    renderBlock={(block, activity) => (
                                        <UITooltip key={activity.date} delayDuration={50}>
                                            <TooltipTrigger asChild>{block}</TooltipTrigger>
                                            <TooltipContent side="top">
                                                {activity.count} subscriber{activity.count !== 1 ? 's' : ''} on {format(new Date(activity.date), "MMM d, yyyy")}
                                            </TooltipContent>
                                        </UITooltip>
                                    )}
                                    theme={{
                                        light: ['#f1f5f9', '#c7d2fe', '#818cf8', '#4f46e5', '#312e81'],
                                        dark: ['#f1f5f9', '#c7d2fe', '#818cf8', '#4f46e5', '#312e81'],
                                    }}
                                    labels={{
                                        legend: {
                                            less: "Less",
                                            more: "More"
                                        },
                                        months: [
                                            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                                        ],
                                        totalCount: '{{count}} subscribers in the last year'
                                    }}
                                    showTotalCount={false}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audience Devices by Location */}
                <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="pb-2 h-[88px]">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-emerald-500" />
                            Devices by Location
                        </CardTitle>
                        <CardDescription>Top subscriber locations by device</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-6 flex flex-col items-center justify-center">
                        <div className="h-[250px] w-full">
                            {locationData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={locationData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                    >
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="location" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            align="center"
                                            iconType="circle"
                                            formatter={(value) => <span className="text-slate-700 text-sm font-medium">{value}</span>}
                                        />
                                        <Bar dataKey="desktop" stackId="a" fill="#3b82f6" name="Desktop" />
                                        <Bar dataKey="mobile" stackId="a" fill="#10b981" name="Mobile" />
                                        <Bar dataKey="tablet" stackId="a" fill="#f59e0b" name="Tablet" />
                                        <Bar dataKey="unknown" stackId="a" fill="#8b5cf6" name="Unknown" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                    No location data yet
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
