
export type CalculationMode = "inference" | "fine-tuning";
export type FineTuningMethod = "full" | "lora" | "qlora";
export type PrecisionType = "fp32" | "fp16" | "bf16" | "int8" | "int4";

export interface BaseConfig {
  mode: CalculationMode;
  modelType: string;
  parameters: number;
  layers: number;
  hiddenSize: number;
  kvHeads: number;
  headDimension: number;
  gpuType: string;
  availableVRAM: number;
  numGPUs: number;
  batchSize: number;
  sequenceLength: number;
}

export interface InferenceConfig extends BaseConfig {
  mode: "inference";
  weightPrecision: PrecisionType;
  kvCachePrecision: PrecisionType;
  concurrentUsers: number;
}

export interface FineTuningConfig extends BaseConfig {
  mode: "fine-tuning";
  fineTuningMethod: FineTuningMethod;
  basePrecision: PrecisionType;
  gradientAccumulation: number;
}

export type ModelConfig = InferenceConfig | FineTuningConfig;

export interface VRAMResults {
  weights: number;
  kvCache: number;
  activations: number;
  gradients?: number;
  optimizer?: number;
  overhead: number;
  total: number;
  fitsOnGPU: boolean;
  utilizationPercentage: number;
  breakdown: {
    weights: { value: number; percentage: number };
    kvCache: { value: number; percentage: number };
    activations: { value: number; percentage: number };
    gradients?: { value: number; percentage: number };
    optimizer?: { value: number; percentage: number };
    overhead: { value: number; percentage: number };
  };
}

export interface ModelPreset {
  name: string;
  parameters: number;
  layers: number;
  hiddenSize: number;
  kvHeads: number;
  headDimension: number;
}

export interface GPUSpecs {
  name: string;
  vram: number;
  memoryBandwidth: number;
  architecture: string;
}

export interface ProFeature {
  id: number;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}
