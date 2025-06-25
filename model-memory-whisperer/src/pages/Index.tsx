import { useState, useMemo } from "react";
import { ModelSelector } from "@/components/ModelSelector";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { LandingPage } from "@/components/LandingPage";
import { ProDashboard } from "@/components/ProDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Calculator, Zap, Download, Crown, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateVRAM } from "@/utils/vramCalculator";
import { ModelConfig, InferenceConfig, FineTuningConfig } from "@/types/calculator";

type PageView = "landing" | "calculator" | "pro";

const Index = () => {
  const [currentView, setCurrentView] = useState<PageView>("landing");
  const [mode, setMode] = useState<"inference" | "fine-tuning">("inference");
  
  const [inferenceConfig, setInferenceConfig] = useState<InferenceConfig>({
    mode: "inference",
    modelType: "deepseek-r1-3b",
    parameters: 3000000000,
    layers: 28,
    hiddenSize: 2560,
    kvHeads: 20,
    headDimension: 128,
    batchSize: 1,
    sequenceLength: 2048,
    weightPrecision: "fp16",
    kvCachePrecision: "fp16",
    gpuType: "rtx-3060-12gb",
    availableVRAM: 12,
    numGPUs: 1,
    concurrentUsers: 1
  });

  const [fineTuningConfig, setFineTuningConfig] = useState<FineTuningConfig>({
    mode: "fine-tuning",
    modelType: "deepseek-r1-3b",
    parameters: 3000000000,
    layers: 28,
    hiddenSize: 2560,
    kvHeads: 20,
    headDimension: 128,
    batchSize: 16,
    sequenceLength: 2048,
    fineTuningMethod: "full",
    basePrecision: "fp16",
    gpuType: "rtx-3060-12gb",
    availableVRAM: 12,
    numGPUs: 1,
    gradientAccumulation: 1
  });

  const currentConfig = mode === "inference" ? inferenceConfig : fineTuningConfig;
  const results = useMemo(() => calculateVRAM(currentConfig), [currentConfig]);

  const updateConfig = (updates: Partial<ModelConfig>) => {
    if (mode === "inference") {
      setInferenceConfig(prev => ({ ...prev, ...updates } as InferenceConfig));
    } else {
      setFineTuningConfig(prev => ({ ...prev, ...updates } as FineTuningConfig));
    }
  };

  if (currentView === "landing") {
    return <LandingPage onGetStarted={() => setCurrentView("calculator")} />;
  }

  if (currentView === "pro") {
    return <ProDashboard onBack={() => setCurrentView("calculator")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("landing")}
                className="p-2"
              >
                <Home className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
              
                <div>
                  <h1 className="md:text-2xl hidden font-bold text-foreground">VRAM Calculator</h1>
                  <p className="text-sm hidden text-muted-foreground">AI Model Memory Requirements Estimator</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                size="sm"
                onClick={() => setCurrentView("pro")}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Pro Features
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Mode Selection */}
        <div className="mb-8 animate-fade-in">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "inference" | "fine-tuning")}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="inference" className="transition-all duration-300">
                <Zap className="h-4 w-4 mr-2" />
                Inference
              </TabsTrigger>
              <TabsTrigger value="fine-tuning" className="transition-all duration-300">
                <Settings className="h-4 w-4 mr-2" />
                Fine-tuning
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in">
            <Card className="p-6 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Model Selection</h2>
              <ModelSelector config={currentConfig} updateConfig={updateConfig} />
            </Card>
            
            <Card className="p-6 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Configuration</h2>
              <ConfigurationPanel config={currentConfig} updateConfig={updateConfig} mode={mode} />
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 animate-fade-in">
            <ResultsDisplay config={currentConfig} results={results} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center animate-fade-in">
          <Card className="p-6 bg-muted/50 transition-all duration-300 hover:bg-muted/70">
            <h3 className="text-lg font-semibold mb-2 text-foreground">About VRAM Calculator</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Accurately estimate GPU memory requirements for running AI models with different configurations. 
              Supports inference, fine-tuning, various quantization methods, and model architectures.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
