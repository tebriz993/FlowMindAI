import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, FileText, Settings, User, LogOut, Bot, Workflow, BarChart3 } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">FlowMindAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-200">Xoş gəlmisiniz, {user?.firstName}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Çıxış
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            İstifadəçi Paneli
          </h1>
          <p className="text-blue-200">
            FlowMindAI platformuna xoş gəlmisiniz. İş proseslərinizdə kömək almaq üçün aşağıdakı xidmətlərdən istifadə edin.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-blue-400" />
                <CardTitle className="text-white">AI Söhbət</CardTitle>
              </div>
              <CardDescription className="text-blue-200">
                HR və IT suallarınız üçün AI assistentindən kömək alın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" data-testid="button-chat">
                Söhbətə Başla
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-green-400" />
                <CardTitle className="text-white">Tiket Yarat</CardTitle>
              </div>
              <CardDescription className="text-blue-200">
                Texniki dəstək və ya yardım üçün tiket göndərin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" data-testid="button-create-ticket">
                Yeni Tiket
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Workflow className="h-6 w-6 text-purple-400" />
                <CardTitle className="text-white">İş Axını Sorğuları</CardTitle>
              </div>
              <CardDescription className="text-blue-200">
                Məzuniyyət, xərc və digər sorğularınızı göndərin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600" data-testid="button-workflow-request">
                Sorğu Yarat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-blue-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow-400" />
                <span>Son Bildirişlər</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center text-blue-200 py-4">
                Hələlik bildirişiniz yoxdur
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                <span>Mənim Fəaliyyətim</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Açıq Tiketlər</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Gözləyən Sorğular</span>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Tamamlanmış</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">0</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <Card className="bg-slate-800/50 border-blue-700/30">
            <CardHeader>
              <CardTitle className="text-white">Sürətli Keçidlər</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white" data-testid="button-profile">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
                <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white" data-testid="button-documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Sənədlər
                </Button>
                <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white" data-testid="button-my-tickets">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mənim Tiketlərim
                </Button>
                <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white" data-testid="button-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Tənzimləmələr
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}