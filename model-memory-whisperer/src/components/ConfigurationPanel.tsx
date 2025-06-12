
import { ModelConfig, InferenceConfig, FineTuningConfig } from "@/types/calculator";
import { GPU_SPECS } from "@/data/modelPresets";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Cpu, HardDrive, Users, Settings2, Layers } from "lucide-react";

interface ConfigurationPanelProps {
  config: ModelConfig;
  updateConfig: (updates: Partial<ModelConfig>) => void;
  mode: "inference" | "fine-tuning";
}

export function ConfigurationPanel({ config, updateConfig, mode }: ConfigurationPanelProps) {
  const handleGPUChange = (gpuType: string) => {
    const gpu = GPU_SPECS[gpuType];
    updateConfig({
      gpuType,
      availableVRAM: gpu.vram
    });
  };

  const isInference = mode === "inference";
  const inferenceConfig = config as InferenceConfig;
  const fineTuningConfig = config as FineTuningConfig;

  return (
    <div className="space-y-6">
      {/* Mode Specific Settings */}
      {isInference ? (
        <div className="space-y-6">
          {/* Inference Quantization */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-blue-500" />
              <Label className="text-sm font-semibold text-blue-700 dark:text-blue-300">Inference Quantization</Label>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
              Precision for model weights during inference. Lower uses less VRAM but may affect quality.
            </p>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="weight-precision" className="text-sm">Weight Precision</Label>
                <Select 
                  value={inferenceConfig.weightPrecision} 
                  onValueChange={(value) => updateConfig({ weightPrecision: value as any })}
                >
                  <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fp32">FP32 (Highest Quality)</SelectItem>
                    <SelectItem value="fp16">FP16 (Recommended)</SelectItem>
                    <SelectItem value="bf16">BF16</SelectItem>
                    <SelectItem value="int8">INT8 (Memory Efficient)</SelectItem>
                    <SelectItem value="int4">INT4 (Ultra Compressed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="kv-precision" className="text-sm">KV Cache Precision</Label>
                <Select 
                  value={inferenceConfig.kvCachePrecision} 
                  onValueChange={(value) => updateConfig({ kvCachePrecision: value as any })}
                >
                  <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fp16">FP16 / BF16 (Default)</SelectItem>
                    <SelectItem value="int8">INT8 (Memory Efficient)</SelectItem>
                    <SelectItem value="int4">INT4 (Ultra Compressed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Concurrent Users */}
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-green-500" />
              <Label className="text-sm font-semibold text-green-700 dark:text-green-300">Concurrent Users</Label>
              <Badge variant="secondary" className="text-xs">{inferenceConfig.concurrentUsers}</Badge>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mb-3">
              Number of users running inference simultaneously (affects memory usage and per-user performance)
            </p>
            
            <div className="space-y-3">
              <Slider
                value={[inferenceConfig.concurrentUsers]}
                onValueChange={(value) => updateConfig({ concurrentUsers: value[0] })}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 user</span>
                <span>100 users</span>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Fine-tuning Method */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="h-4 w-4 text-purple-500" />
              <Label className="text-sm font-semibold text-purple-700 dark:text-purple-300">Fine-tuning Method</Label>
            </div>
            
            <Select 
              value={fineTuningConfig.fineTuningMethod} 
              onValueChange={(value) => updateConfig({ fineTuningMethod: value as any })}
            >
              <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Fine-tuning</SelectItem>
                <SelectItem value="lora">LoRA (Low-Rank Adaptation)</SelectItem>
                <SelectItem value="qlora">QLoRA (Quantized LoRA)</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Base Model Precision */}
          <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-4 w-4 text-orange-500" />
              <Label className="text-sm font-semibold text-orange-700 dark:text-orange-300">Base Model Precision</Label>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mb-3">
              Precision for base model weights during fine-tuning. Affects memory for weights, optimizer, and gradients.
            </p>
            
            <Select 
              value={fineTuningConfig.basePrecision} 
              onValueChange={(value) => updateConfig({ basePrecision: value as any })}
            >
              <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fp32">FP32</SelectItem>
                <SelectItem value="fp16">FP16 / BF16</SelectItem>
                <SelectItem value="int8">INT8</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Gradient Accumulation */}
          <Card className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-indigo-500" />
              <Label className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Gradient Accumulation</Label>
              <Badge variant="secondary" className="text-xs">{fineTuningConfig.gradientAccumulation} steps</Badge>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-3">
              Steps to accumulate gradients before optimizer update (trades speed for memory).
            </p>
            
            <div className="space-y-3">
              <Slider
                value={[fineTuningConfig.gradientAccumulation]}
                onValueChange={(value) => updateConfig({ gradientAccumulation: value[0] })}
                max={32}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 step</span>
                <span>32 steps</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Separator className="my-6" />

      {/* Hardware Configuration */}
      <Card className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Hardware Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="gpu-select" className="text-sm font-medium">Select your GPU or set custom VRAM</Label>
            <Select value={config.gpuType} onValueChange={handleGPUChange}>
              <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                <SelectValue placeholder="Select GPU" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GPU_SPECS).map(([key, gpu]) => (
                  <SelectItem key={key} value={key}>
                    {gpu.name} ({gpu.vram}GB)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="num-gpus" className="text-sm">Num GPUs</Label>
                <Badge variant="outline" className="text-xs">{config.numGPUs}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Devices for parallel {isInference ? 'inference' : 'training'}
              </p>
              <Slider
                value={[config.numGPUs]}
                onValueChange={(value) => updateConfig({ numGPUs: value[0] })}
                max={8}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>8</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="batch-size" className="text-sm">Batch Size</Label>
                <Badge variant="outline" className="text-xs">{config.batchSize}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {isInference ? 'Inputs processed simultaneously per step' : 'Samples per optimization step'}
              </p>
              <Slider
                value={[config.batchSize]}
                onValueChange={(value) => updateConfig({ batchSize: value[0] })}
                max={128}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>128</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="sequence-length" className="text-sm">Sequence Length</Label>
              <Badge variant="outline" className="text-xs">{config.sequenceLength.toLocaleString()}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {isInference 
                ? 'Max tokens per input; impacts KV cache & activations' 
                : 'Max tokens per training sample (affects activations memory)'
              }
            </p>
            <Slider
              value={[config.sequenceLength]}
              onValueChange={(value) => updateConfig({ sequenceLength: value[0] })}
              max={32768}
              min={512}
              step={512}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>512</span>
              <span>32K</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
