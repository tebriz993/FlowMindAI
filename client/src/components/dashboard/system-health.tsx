import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemHealth() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['/api/health'],
    refetchInterval: 60000, // Refresh every minute
  });

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
      case 'missing_key':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (service: string, status: string, meta?: any) => {
    switch (service) {
      case 'openai':
        return status === 'missing_key' ? 'Missing API Key' : meta?.uptime || 'Healthy';
      case 'vectorDB':
        return 'Healthy';
      case 'slack':
        return 'Connected';
      case 'cache':
        return meta?.hitRate || 'Healthy';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200" data-testid="system-health-card">
      <CardHeader className="border-b border-slate-100">
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !health ? (
          <div className="text-center py-4" data-testid="health-unavailable">
            <p className="text-slate-500">Health information unavailable</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between" data-testid="health-openai">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusIndicator(health.openai?.status)}`}></div>
                <span className="text-sm text-slate-900">OpenAI API</span>
              </div>
              <span className="text-sm text-slate-500">
                {getStatusText('openai', health.openai?.status, health.openai)}
              </span>
            </div>

            <div className="flex items-center justify-between" data-testid="health-vector-db">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusIndicator(health.vectorDB?.status)}`}></div>
                <span className="text-sm text-slate-900">Vector Database</span>
              </div>
              <span className="text-sm text-slate-500">
                {getStatusText('vectorDB', health.vectorDB?.status, health.vectorDB)}
              </span>
            </div>

            <div className="flex items-center justify-between" data-testid="health-slack">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusIndicator(health.slack?.status)}`}></div>
                <span className="text-sm text-slate-900">Slack Integration</span>
              </div>
              <span className="text-sm text-slate-500">
                {getStatusText('slack', health.slack?.status, health.slack)}
              </span>
            </div>

            <div className="flex items-center justify-between" data-testid="health-cache">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusIndicator(health.cache?.status)}`}></div>
                <span className="text-sm text-slate-900">Cache Layer</span>
              </div>
              <span className="text-sm text-slate-500">
                {getStatusText('cache', health.cache?.status, health.cache)}
              </span>
            </div>

            {health.apiCalls && (
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-slate-900">Daily API Calls</span>
                  <span className="text-slate-600" data-testid="api-calls-count">
                    {health.apiCalls.daily?.toLocaleString()} / {health.apiCalls.limit?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min(100, (health.apiCalls.daily / health.apiCalls.limit) * 100)}%` 
                    }}
                    data-testid="api-calls-progress"
                  ></div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
