
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Download, 
  Layers, 
  Settings, 
  Zap, 
  Crown,
  ArrowLeft,
  TrendingUp
} from "lucide-react";
import { ProFeature } from "@/types/calculator";

interface ProDashboardProps {
  onBack: () => void;
}

export function ProDashboard({ onBack }: ProDashboardProps) {
  const [activeTab, setActiveTab] = useState("features");

  const proFeatures: ProFeature[] = [
    {
      id: 1,
      name: "Model Comparison Tool",
      description: "Visually compare VRAM usage across different models side-by-side.",
      icon: "BarChart",
      available: true
    },
    {
      id: 2,
      name: "Live GPU Benchmark Data",
      description: "Fetch/update live GPU performance metrics for VRAM vs inference speed.",
      icon: "TrendingUp",
      available: true
    },
    {
      id: 3,
      name: "Dataset-Specific Calculator",
      description: "Customize VRAM usage based on dataset size/type (e.g., image/text/video).",
      icon: "Layers",
      available: false
    },
    {
      id: 4,
      name: "Custom Model Builder",
      description: "Let users create custom models layer-by-layer and see VRAM estimates live.",
      icon: "Settings",
      available: false
    },
    {
      id: 5,
      name: "Automatic VRAM Budgeting",
      description: "Recommend maximum batch size given a specific VRAM limit.",
      icon: "Zap",
      available: true
    }
  ];

  const getIcon = (iconName: string) => {
    const icons = {
      BarChart,
      TrendingUp,
      Layers,
      Settings,
      Zap
    };
    return icons[iconName as keyof typeof icons] || BarChart;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="animate-fade-in">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pro Dashboard</h1>
              <p className="text-muted-foreground">Advanced features and analytics</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Pro Features</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proFeatures.map((feature) => {
                const IconComponent = getIcon(feature.icon);
                return (
                  <Card 
                    key={feature.id}
                    className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-border/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant={feature.available ? "default" : "secondary"}>
                        {feature.available ? "Available" : "Coming Soon"}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                    <Button 
                      size="sm" 
                      variant={feature.available ? "default" : "outline"}
                      disabled={!feature.available}
                      className="w-full"
                    >
                      {feature.available ? "Try Now" : "Notify Me"}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Calculations This Month</span>
                      <span>247/500</span>
                    </div>
                    <Progress value={49.4} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Reports Generated</span>
                      <span>15/50</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>API Calls</span>
                      <span>1,203/5,000</span>
                    </div>
                    <Progress value={24} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Popular Models</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">LLaMA 2 7B</span>
                    <Badge variant="secondary">42 calcs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">DeepSeek-R1 3B</span>
                    <Badge variant="secondary">31 calcs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mistral 7B</span>
                    <Badge variant="secondary">28 calcs</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Generated Reports</h3>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Generate New Report
                </Button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">VRAM Analysis Report #{i}</div>
                      <div className="text-sm text-muted-foreground">
                        Generated {i} day{i > 1 ? 's' : ''} ago
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
