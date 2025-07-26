import { useQuery } from "@tanstack/react-query";
import MetricsCards from "@/components/metrics-cards";
import AnalyticsCharts from "@/components/analytics-charts";
import ChatInterface from "@/components/chat-interface";
import ResponseTemplatesTable from "@/components/response-templates-table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Calendar } from "lucide-react";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
  });

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log("Exporting report...");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600">Monitor and analyze your automated response system performance</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Date Range Selector */}
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select defaultValue="7days">
                <SelectTrigger className="bg-transparent border-none text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Export Button */}
            <Button onClick={handleExport} className="bg-primary hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Key Metrics Cards */}
        <MetricsCards metrics={metrics} isLoading={metricsLoading} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsCharts />
        </div>

        {/* Live Chat Interface and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <i className="fas fa-plus text-primary w-4 mr-2"></i>
                  Add Response Template
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <i className="fas fa-tags text-primary w-4 mr-2"></i>
                  Manage Categories
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <i className="fas fa-upload text-primary w-4 mr-2"></i>
                  Import Knowledge Base
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <i className="fas fa-cogs text-primary w-4 mr-2"></i>
                  Configure Automation
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">Response template updated</p>
                    <p className="text-gray-500 text-xs">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot text-primary text-xs"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">15 automated responses sent</p>
                    <p className="text-gray-500 text-xs">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-tag text-warning text-xs"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">New category created</p>
                    <p className="text-gray-500 text-xs">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Response Management Table */}
        <ResponseTemplatesTable />
      </main>
    </>
  );
}
