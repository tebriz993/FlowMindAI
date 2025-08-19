import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Laptop, Handshake, Upload } from "lucide-react";

export function DocumentStats() {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['/api/documents'],
    refetchInterval: 60000,
  });

  const getDocumentsByCategory = (category: string) => {
    // Mock categorization based on document titles or paths
    return documents.filter((doc: any) => {
      const title = doc.title.toLowerCase();
      switch (category) {
        case 'hr':
          return title.includes('hr') || title.includes('policy') || title.includes('employee');
        case 'it':
          return title.includes('it') || title.includes('technical') || title.includes('system');
        case 'onboarding':
          return title.includes('onboard') || title.includes('welcome') || title.includes('new');
        default:
          return false;
      }
    });
  };

  const categories = [
    {
      name: "HR Policies",
      icon: <Building className="text-blue-600 h-5 w-5" />,
      documents: getDocumentsByCategory('hr'),
      color: "bg-blue-100"
    },
    {
      name: "IT Documentation", 
      icon: <Laptop className="text-orange-600 h-5 w-5" />,
      documents: getDocumentsByCategory('it'),
      color: "bg-orange-100"
    },
    {
      name: "Onboarding",
      icon: <Handshake className="text-green-600 h-5 w-5" />,
      documents: getDocumentsByCategory('onboarding'),
      color: "bg-green-100"
    }
  ];

  // Mock query counts - in real app, track these metrics
  const getMockQueryCount = (category: string) => {
    switch (category) {
      case 'HR Policies': return 156;
      case 'IT Documentation': return 89;
      case 'Onboarding': return 34;
      default: return 0;
    }
  };

  const totalEmbeddings = documents.length * 12; // Mock: ~12 chunks per document
  const storageUsed = documents.length * 0.05; // Mock: ~50KB per document

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200" data-testid="document-stats-card">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle>Document Library</CardTitle>
          <Button 
            size="sm" 
            className="bg-primary-500 text-white hover:bg-primary-600"
            data-testid="button-upload-document-stats"
          >
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 bg-slate-200 rounded w-8"></div>
                    <div className="h-3 bg-slate-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <div 
                key={category.name} 
                className="flex items-center justify-between"
                data-testid={`document-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                    {category.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{category.name}</p>
                    <p className="text-xs text-slate-500" data-testid={`document-count-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      {category.documents.length} documents
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900" data-testid={`query-count-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {getMockQueryCount(category.name)}
                  </p>
                  <p className="text-xs text-slate-500">queries today</p>
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-slate-900">Total Embeddings</span>
                <span className="text-slate-600" data-testid="total-embeddings">
                  {totalEmbeddings.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900">Storage Used</span>
                <span className="text-slate-600" data-testid="storage-used">
                  {storageUsed.toFixed(1)} MB / 1000 MB
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
