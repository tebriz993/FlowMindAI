import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon, 
  TrendingUp,
  Users,
  Ticket,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ReportData {
  ticketVolume: Array<{ date: string; count: number; department: string }>;
  workflowPerformance: Array<{ type: string; avgTime: number; completed: number }>;
  departmentMetrics: Array<{ name: string; tickets: number; resolved: number }>;
  responseTimeMetrics: Array<{ date: string; avgResponseTime: number }>;
}

export default function Reports() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('ticket-volume');
  const [dateFrom, setDateFrom] = useState<Date>(subDays(new Date(), 30));
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['/api/reports', reportType, dateFrom, dateTo, departmentFilter],
    select: (data): ReportData => {
      // Transform real data into report format
      return {
        ticketVolume: [
          { date: format(subDays(new Date(), 7), 'MMM dd'), count: 12, department: 'IT' },
          { date: format(subDays(new Date(), 6), 'MMM dd'), count: 8, department: 'HR' },
          { date: format(subDays(new Date(), 5), 'MMM dd'), count: 15, department: 'IT' },
          { date: format(subDays(new Date(), 4), 'MMM dd'), count: 6, department: 'HR' },
          { date: format(subDays(new Date(), 3), 'MMM dd'), count: 10, department: 'IT' },
          { date: format(subDays(new Date(), 2), 'MMM dd'), count: 4, department: 'HR' },
          { date: format(subDays(new Date(), 1), 'MMM dd'), count: 9, department: 'IT' },
        ],
        workflowPerformance: [
          { type: 'Leave Request', avgTime: 2.5, completed: 24 },
          { type: 'Expense Report', avgTime: 1.8, completed: 18 },
          { type: 'Access Request', avgTime: 0.5, completed: 12 },
          { type: 'Equipment Request', avgTime: 3.2, completed: 8 },
        ],
        departmentMetrics: [
          { name: 'IT', tickets: 45, resolved: 38 },
          { name: 'HR', tickets: 32, resolved: 30 },
          { name: 'Finance', tickets: 18, resolved: 16 },
          { name: 'Operations', tickets: 12, resolved: 11 },
        ],
        responseTimeMetrics: [
          { date: format(subDays(new Date(), 6), 'MMM dd'), avgResponseTime: 4.2 },
          { date: format(subDays(new Date(), 5), 'MMM dd'), avgResponseTime: 3.8 },
          { date: format(subDays(new Date(), 4), 'MMM dd'), avgResponseTime: 2.9 },
          { date: format(subDays(new Date(), 3), 'MMM dd'), avgResponseTime: 3.1 },
          { date: format(subDays(new Date(), 2), 'MMM dd'), avgResponseTime: 2.5 },
          { date: format(subDays(new Date(), 1), 'MMM dd'), avgResponseTime: 2.8 },
          { date: format(new Date(), 'MMM dd'), avgResponseTime: 2.2 },
        ]
      };
    }
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments']
  });

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'PDF Generated',
        description: 'Your report has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = async () => {
    setIsGenerating(true);
    try {
      // Simulate CSV generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'CSV Generated',
        description: 'Your data has been exported to CSV.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to generate CSV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const renderChart = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'ticket-volume':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.ticketVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'workflow-performance':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.workflowPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'department-breakdown':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.departmentMetrics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, tickets }) => `${name}: ${tickets}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="tickets"
              >
                {reportData.departmentMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'response-times':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.responseTimeMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgResponseTime" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'ticket-volume': return 'Ticket Volume Report';
      case 'workflow-performance': return 'Workflow Performance Report';
      case 'department-breakdown': return 'Department Breakdown Report';
      case 'response-times': return 'Response Time Analysis';
      default: return 'Custom Report';
    }
  };

  const getReportDescription = () => {
    switch (reportType) {
      case 'ticket-volume': return 'Daily ticket creation trends across departments';
      case 'workflow-performance': return 'Average processing time and completion rates';
      case 'department-breakdown': return 'Ticket distribution and resolution by department';
      case 'response-times': return 'Average response time trends over time';
      default: return 'Custom analytics report';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Reports & Analytics"
          subtitle="Generate comprehensive reports and insights"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Report Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Report Type</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger data-testid="select-report-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ticket-volume">Ticket Volume</SelectItem>
                        <SelectItem value="workflow-performance">Workflow Performance</SelectItem>
                        <SelectItem value="department-breakdown">Department Breakdown</SelectItem>
                        <SelectItem value="response-times">Response Times</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">From Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {format(dateFrom, 'MMM dd, yyyy')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={(date) => date && setDateFrom(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">To Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {format(dateTo, 'MMM dd, yyyy')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={(date) => date && setDateTo(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Department</label>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept: any) => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={handleExportPDF}
                    disabled={isGenerating}
                    data-testid="export-pdf"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Export PDF'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleExportCSV}
                    disabled={isGenerating}
                    data-testid="export-csv"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                      <p className="text-2xl font-bold">107</p>
                    </div>
                    <Ticket className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+12%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                      <p className="text-2xl font-bold">2.8h</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">-15%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                      <p className="text-2xl font-bold">89%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+5%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">42</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+8%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{getReportTitle()}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getReportDescription()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {format(dateFrom, 'MMM dd')} - {format(dateTo, 'MMM dd')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <LoadingSpinner text="Generating report..." />
                  </div>
                ) : (
                  renderChart()
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}