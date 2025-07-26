import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AnalyticsCharts() {
  const { data: trendData = [], isLoading: trendsLoading } = useQuery({
    queryKey: ["/api/analytics/trends"],
  });

  const { data: categoryData = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/analytics/categories"],
  });

  if (trendsLoading || categoriesLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Inquiry Volume Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inquiry Volume Trends</CardTitle>
            <div className="flex space-x-2">
              <Button variant="default" size="sm" className="text-xs bg-primary text-white px-3 py-1 rounded-full">
                Daily
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 px-3 py-1 rounded-full hover:bg-gray-100">
                Weekly
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 px-3 py-1 rounded-full hover:bg-gray-100">
                Monthly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalInquiries"
                  stroke="hsl(207, 90%, 54%)"
                  strokeWidth={2}
                  fill="hsl(207, 90%, 54%)"
                  name="Total Inquiries"
                />
                <Line
                  type="monotone"
                  dataKey="automatedResponses"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth={2}
                  fill="hsl(142, 71%, 45%)"
                  name="Automated Responses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Response Categories Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Response Categories</CardTitle>
            <Button variant="ghost" className="text-sm text-primary hover:text-blue-700">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
