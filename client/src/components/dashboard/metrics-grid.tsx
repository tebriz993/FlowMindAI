import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Target, Timer, Users } from "lucide-react";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  target: string;
  progress: number;
  trend: string;
  trendDirection: "up" | "down";
}

function MetricCard({ icon, title, value, target, progress, trend, trendDirection }: MetricCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200" data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <span className={`text-sm font-medium ${trendDirection === 'up' ? 'text-green-600' : 'text-green-600'}`}>
            <i className={`fas fa-arrow-${trendDirection === 'up' ? 'up' : 'down'} mr-1`}></i>
            {trend}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1" data-testid={`metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </h3>
        <p className="text-slate-600 text-sm">{title}</p>
        <div className="mt-3 bg-slate-50 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500 mt-1">{target}</p>
      </CardContent>
    </Card>
  );
}

export function MetricsGrid() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white rounded-xl shadow-sm border border-slate-200">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-12 bg-slate-200 rounded mb-4"></div>
                <div className="h-8 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded mb-3"></div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const responseTimeProgress = metrics?.avgResponseTime ? Math.min(100, (2.5 - metrics.avgResponseTime) / 2.5 * 100) : 0;
  const approvalTimeProgress = metrics?.avgApprovalTime ? Math.min(100, (48 - metrics.avgApprovalTime) / 48 * 100) : 0;
  const userProgress = metrics?.activeUsers && metrics?.totalUsers ? (metrics.activeUsers / metrics.totalUsers) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="metrics-grid">
      <MetricCard
        icon={<Clock className="text-blue-600 h-6 w-6" />}
        title="Avg Response Time"
        value={`${metrics?.avgResponseTime || 0}s`}
        target="Target: ≤2.5s"
        progress={responseTimeProgress}
        trend="12%"
        trendDirection="down"
      />
      
      <MetricCard
        icon={<Target className="text-green-600 h-6 w-6" />}
        title="Auto-routing Accuracy"
        value={`${metrics?.routingAccuracy || 0}%`}
        target="Target: ≥80%"
        progress={metrics?.routingAccuracy || 0}
        trend="5%"
        trendDirection="up"
      />
      
      <MetricCard
        icon={<Timer className="text-purple-600 h-6 w-6" />}
        title="Avg Approval Time"
        value={`${metrics?.avgApprovalTime || 0}h`}
        target="Target: ≤2h (was 2 days)"
        progress={approvalTimeProgress}
        trend="85%"
        trendDirection="down"
      />
      
      <MetricCard
        icon={<Users className="text-orange-600 h-6 w-6" />}
        title="Active Users Today"
        value={`${metrics?.activeUsers || 0}`}
        target={`${Math.round(userProgress)}% of total users`}
        progress={userProgress}
        trend="23%"
        trendDirection="up"
      />
    </div>
  );
}
