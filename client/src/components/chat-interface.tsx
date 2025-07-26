import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Inquiry } from "@shared/schema";

interface ChatInterfaceProps {
  isFullScreen?: boolean;
}

export default function ChatInterface({ isFullScreen = false }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const { toast } = useToast();

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["/api/inquiries"],
    refetchInterval: 5000, // Refresh every 5 seconds for live updates
  });

  const createInquiry = useMutation({
    mutationFn: async (data: { message: string; senderName: string; senderEmail?: string }) => {
      const response = await apiRequest("POST", "/api/inquiries", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      setMessage("");
      setSenderName("");
      toast({ title: "Message sent successfully" });
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !senderName.trim()) return;

    createInquiry.mutate({
      message: message.trim(),
      senderName: senderName.trim(),
    });
  };

  const recentInquiries = inquiries.slice(0, 10);

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",
      isFullScreen ? "h-full" : ""
    )}>
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Live Chat Interface</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
              {inquiries.filter((i: Inquiry) => i.status === "pending").length} Active Chats
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className={cn(
        "overflow-y-auto p-4 space-y-4",
        isFullScreen ? "h-96" : "h-80"
      )}>
        {isLoading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : recentInquiries.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          recentInquiries.map((inquiry: Inquiry) => (
            <div key={inquiry.id} className="space-y-4">
              {/* User Message */}
              <div className="flex items-start space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-md">
                    <p className="text-sm text-gray-900">{inquiry.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {inquiry.senderName} • {new Date(inquiry.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Bot Response */}
              {inquiry.responseMessage && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="text-white text-sm" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 max-w-md">
                      <p className="text-sm text-gray-900 whitespace-pre-line">
                        {inquiry.responseMessage}
                      </p>
                      {inquiry.isAutomated && (
                        <p className="text-xs text-primary mt-2">
                          <CheckCircle className="inline w-3 h-3 mr-1" />
                          Auto-generated response • 98% confidence
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      EduBot • {inquiry.respondedAt ? new Date(inquiry.respondedAt).toLocaleTimeString() : "Just now"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center space-x-3">
            <Input
              type="text"
              placeholder="Your name..."
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="flex-1"
              required
            />
          </div>
          <div className="flex items-center space-x-3">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              required
            />
            <Button 
              type="submit" 
              disabled={createInquiry.isPending || !message.trim() || !senderName.trim()}
              className="bg-primary hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
