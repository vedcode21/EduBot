import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { BarChart3, MessageCircle, Database, Tags, Settings, LogOut, Bot } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Live Chat", href: "/chat", icon: MessageCircle },
  { name: "Knowledge Base", href: "/knowledge-base", icon: Database },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EduBot</h1>
            <p className="text-sm text-gray-500">Response Automation</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive
                    ? "text-primary bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"
            alt="User Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
