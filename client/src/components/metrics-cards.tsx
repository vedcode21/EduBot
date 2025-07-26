import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Bot, Clock, Star, MessageCircle } from "lucide-react";

interface MetricsCardsProps {
  metrics?: {
    totalInquiries: number;
    automatedResponses: number;
    avgResponseTime: number;
    avgSatisfactionScore: number;
    automationRate: number;
  };
  isLoading: boolean;
}

export default function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Inquiries",
      value: metrics?.totalInquiries?.toLocaleString() || "0",
      change: "+12% from last week",
      icon: MessageCircle,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
      trend: "up",
    },
    {
      title: "Automated Responses",
      value: metrics?.automatedResponses?.toLocaleString() || "0",
      change: `${Math.round((metrics?.automationRate || 0) * 100)}% automation rate`,
      icon: Bot,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: "up",
    },
    {
      title: "Avg Response Time",
      value: `${metrics?.avgResponseTime?.toFixed(1) || "0"}s`,
      change: "15% faster",
      icon: Clock,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: "down",
    },
    {
      title: "Satisfaction Score",
      value: `${metrics?.avgSatisfactionScore?.toFixed(1) || "0"}/5`,
      change: "0.3 points up",
      icon: Star,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown;
        const trendColor = card.trend === "up" ? "text-green-600" : "text-green-600";
        
        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  <p className={`text-sm mt-1 ${trendColor}`}>
                    <TrendIcon className="inline w-3 h-3 mr-1" />
                    <span>{card.change}</span>
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${card.iconColor} text-xl`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
