import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  CheckCircle,
  Cpu,
  HardDrive,
  MemoryStick,
  Thermometer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartConfig, ChartContainer } from "./components/ui/chart";

const initialData = Array(20).fill({
  time: "",
  cpuTemp: 0,
  cpuUsage: { currentLoad: 0, cpus: [] },
  memoryUsed: 0,
});

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function ServerDashboard() {
  const [data, setData] = useState(initialData);
  const [systemInfo, setSystemInfo] = useState({
    cpuTemperature: { main: 0, max: 0 },
    cpuUsage: { currentLoad: 0, cpus: [] },
    memoryUsage: { total: 0, used: 0, free: 0 },
    time: "",
  });

  useEffect(() => {
    const eventSource = new EventSource("http://192.168.1.231:6969/realtime");
    eventSource.addEventListener("metrics", (event) => {
      const newData = JSON.parse(event.data);
      console.log(newData);
      setSystemInfo(newData);

      setData((prevData) => {
        const newDataPoint = {
          time: new Date(newData.time).toLocaleTimeString(),
          cpuTemp: newData.cpuTemperature.main,
          cpuUsage: newData.cpuUsage.currentLoad,
          memoryUsed: newData.memoryUsage.used / 1024 / 1024 / 1024, // Convert to GB
        };
        return [...prevData.slice(1), newDataPoint];
      });
    });

    return () => {
      eventSource.close();
    };
  }, []);

  const recentEvents = [
    {
      id: 1,
      type: "error",
      message: "Database connection lost",
      time: "17:45",
    },
    {
      id: 2,
      type: "warning",
      message: "High CPU usage detected",
      time: "16:30",
    },
    { id: 3, type: "info", message: "System update completed", time: "15:15" },
    { id: 4, type: "success", message: "New user registered", time: "14:50" },
  ];

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow rounded-lg mb-8 p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            LIHAT (farhan server)
          </h1>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" />
            <span className="font-semibold text-green-500">Server Online</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                CPU Temperature
              </CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemInfo.cpuTemperature.main}°C
              </div>
              <p className="text-xs text-muted-foreground">
                Max: {systemInfo.cpuTemperature.max}°C
              </p>
              <ChartContainer
                config={chartConfig}
                className="h-[200px] w-full flex items-center justify-center mt-4"
              >
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 20, left: -34, bottom: 5 }}
                >
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cpuTemp"
                    stroke="#8884d8"
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                {systemInfo.cpuUsage.currentLoad.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Cores: {systemInfo.cpuUsage.cpus.length}
              </p>
              <ChartContainer
                config={chartConfig}
                className="h-[200px] w-full flex items-center justify-center mt-4"
              >
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 20, left: -34, bottom: 5 }}
                >
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cpuUsage"
                    stroke="#82ca9d"
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Memory Usage
              </CardTitle>
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBytes(systemInfo.memoryUsage.used)}
              </div>
              <p className="text-xs text-muted-foreground">
                of {formatBytes(systemInfo.memoryUsage.total)} total
              </p>
              <ChartContainer
                config={chartConfig}
                className="h-[200px] w-full flex items-center justify-center mt-4"
              >
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 20, left: -34, bottom: 5 }}
                >
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="memoryUsed"
                    stroke="#ffc658"
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentEvents.map((event) => (
                <li key={event.id} className="flex items-start space-x-4">
                  {event.type === "error" && (
                    <AlertCircle className="text-red-500 mt-0.5" />
                  )}
                  {event.type === "warning" && (
                    <AlertCircle className="text-yellow-500 mt-0.5" />
                  )}
                  {event.type === "info" && (
                    <AlertCircle className="text-blue-500 mt-0.5" />
                  )}
                  {event.type === "success" && (
                    <CheckCircle className="text-green-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {event.message}
                    </p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                  <Badge
                    variant={
                      event.type === "error"
                        ? "destructive"
                        : event.type === "warning"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {event.type}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
