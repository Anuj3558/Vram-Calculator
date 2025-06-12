
import { ModelConfig, VRAMResults, InferenceConfig, FineTuningConfig } from "@/types/calculator";

const PRECISION_BYTES = {
  fp32: 4,
  fp16: 2,
  bf16: 2,
  int8: 1,
  int4: 0.5
} as const;

export function calculateVRAM(config: ModelConfig): VRAMResults {
  if (config.mode === "inference") {
    return calculateInferenceVRAM(config);
  } else {
    return calculateFineTuningVRAM(config);
  }
}

function calculateInferenceVRAM(config: InferenceConfig): VRAMResults {
  const {
    parameters,
    layers,
    kvHeads,
    headDimension,
    batchSize,
    sequenceLength,
    weightPrecision,
    kvCachePrecision,
    availableVRAM,
    concurrentUsers,
    numGPUs
  } = config;

  // Weight memory calculation
  const weightBytes = PRECISION_BYTES[weightPrecision];
  const weights = (parameters * weightBytes) / (1024 ** 3); // Convert to GB

  // KV-cache calculation (multiplied by concurrent users)
  const kvCacheBytes = PRECISION_BYTES[kvCachePrecision];
  const kvCache = (2 * layers * kvHeads * headDimension * sequenceLength * batchSize * concurrentUsers * kvCacheBytes) / (1024 ** 3);

  // Activation memory (scaled by batch size and concurrent users)
  const activations = (weights * 0.15 * batchSize * concurrentUsers) / numGPUs;

  // Overhead (CUDA runtime, PyTorch overhead, etc.)
  const overhead = (weights + kvCache + activations) * 0.1;

  const total = (weights + kvCache + activations + overhead) / numGPUs;
  const fitsOnGPU = total <= availableVRAM;
  const utilizationPercentage = Math.min((total / availableVRAM) * 100, 100);

  const breakdown = {
    weights: { 
      value: weights / numGPUs, 
      percentage: (weights / (total * numGPUs)) * 100 
    },
    kvCache: { 
      value: kvCache / numGPUs, 
      percentage: (kvCache / (total * numGPUs)) * 100 
    },
    activations: { 
      value: activations, 
      percentage: (activations / total) * 100 
    },
    overhead: { 
      value: overhead / numGPUs, 
      percentage: (overhead / (total * numGPUs)) * 100 
    }
  };

  return {
    weights: weights / numGPUs,
    kvCache: kvCache / numGPUs,
    activations,
    overhead: overhead / numGPUs,
    total,
    fitsOnGPU,
    utilizationPercentage,
    breakdown
  };
}

function calculateFineTuningVRAM(config: FineTuningConfig): VRAMResults {
  const {
    parameters,
    layers,
    kvHeads,
    headDimension,
    batchSize,
    sequenceLength,
    basePrecision,
    availableVRAM,
    gradientAccumulation,
    numGPUs,
    fineTuningMethod
  } = config;

  // Weight memory calculation
  const weightBytes = PRECISION_BYTES[basePrecision];
  const weights = (parameters * weightBytes) / (1024 ** 3);

  // Gradient memory (same as weights for full fine-tuning)
  const gradients = fineTuningMethod === "full" ? weights : weights * 0.1; // LoRA uses much less

  // Optimizer states (Adam: 2x parameters for momentum and variance)
  const optimizer = fineTuningMethod === "full" ? weights * 2 : weights * 0.2;

  // KV-cache (minimal during training)
  const kvCacheBytes = PRECISION_BYTES[basePrecision];
  const kvCache = (2 * layers * kvHeads * headDimension * sequenceLength * batchSize * kvCacheBytes) / (1024 ** 3);

  // Activation memory (much higher during training)
  const activations = (weights * 0.5 * batchSize * gradientAccumulation) / numGPUs;

  // Overhead
  const overhead = (weights + gradients + optimizer + kvCache + activations) * 0.15;

  const total = (weights + gradients + optimizer + kvCache + activations + overhead) / numGPUs;
  const fitsOnGPU = total <= availableVRAM;
  const utilizationPercentage = Math.min((total / availableVRAM) * 100, 100);

  const totalMemory = total * numGPUs;
  const breakdown = {
    weights: { 
      value: weights / numGPUs, 
      percentage: (weights / totalMemory) * 100 
    },
    gradients: { 
      value: gradients / numGPUs, 
      percentage: (gradients / totalMemory) * 100 
    },
    optimizer: { 
      value: optimizer / numGPUs, 
      percentage: (optimizer / totalMemory) * 100 
    },
    kvCache: { 
      value: kvCache / numGPUs, 
      percentage: (kvCache / totalMemory) * 100 
    },
    activations: { 
      value: activations, 
      percentage: (activations / total) * 100 
    },
    overhead: { 
      value: overhead / numGPUs, 
      percentage: (overhead / totalMemory) * 100 
    }
  };

  return {
    weights: weights / numGPUs,
    kvCache: kvCache / numGPUs,
    activations,
    gradients: gradients / numGPUs,
    optimizer: optimizer / numGPUs,
    overhead: overhead / numGPUs,
    total,
    fitsOnGPU,
    utilizationPercentage,
    breakdown
  };
}

export function formatBytes(bytes: number): string {
  return `${bytes.toFixed(2)} GB`;
}

export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}
