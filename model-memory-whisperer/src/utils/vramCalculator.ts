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
    numGPUs,
    hiddenSize
  } = config;

  const weightBytes = PRECISION_BYTES[weightPrecision];
  const weights = (parameters * weightBytes) / (1024 ** 3); 

  const kvCacheBytes = PRECISION_BYTES[kvCachePrecision];
  const kvCache = (
    2 * layers * kvHeads * headDimension * sequenceLength * batchSize * concurrentUsers * kvCacheBytes
  ) / (1024 ** 3);

  const effectiveBatchSize = Math.pow(batchSize, 0.8);

  // Apply fp32 boost to activations only
  const fp32ActivationMultiplier =
    weightPrecision === "fp32"
      ? 1 + 0.27 * Math.log2(batchSize + 1)
      : 1;

  const activations = (
    layers * effectiveBatchSize * sequenceLength * hiddenSize * weightBytes * fp32ActivationMultiplier
  ) / (1024 ** 3 * numGPUs);

  const overheadMultiplier = 0.2;
  const overhead = (weights + kvCache + activations) * overheadMultiplier;

  const reservedSystemBuffer = 0.3; 
  const total = (weights + kvCache + activations + overhead + reservedSystemBuffer) / numGPUs;

  const fitsOnGPU = total <= availableVRAM;
  const utilizationPercentage = Math.min((total / availableVRAM) * 100, 100);
  const totalMemory = total * numGPUs;

  const breakdown = {
    weights: {
      value: weights / numGPUs,
      percentage: (weights / totalMemory) * 100,
    },
    kvCache: {
      value: kvCache / numGPUs,
      percentage: (kvCache / totalMemory) * 100,
    },
    activations: {
      value: activations,
      percentage: (activations / total) * 100,
    },
    overhead: {
      value: overhead / numGPUs,
      percentage: (overhead / totalMemory) * 100,
    },
    reserved: {
      value: reservedSystemBuffer / numGPUs,
      percentage: (reservedSystemBuffer / totalMemory) * 100,
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
    batchSize,
    sequenceLength,
    hiddenSize,
    basePrecision,
    availableVRAM,
    gradientAccumulation,
    numGPUs,
    fineTuningMethod
  } = config;

  const precisionBytes = PRECISION_BYTES[basePrecision];

  // More realistic memory usage estimates
  const weights = (parameters * precisionBytes) / (1024 ** 3); // GB

  const gradients = fineTuningMethod === "full"
    ? (parameters * precisionBytes) / (1024 ** 3) // FP16 gradients
    : (parameters * precisionBytes * 0.1) / (1024 ** 3); // LoRA: 10%

  const optimizer = fineTuningMethod === "full"
    ? (parameters * 2 * precisionBytes) / (1024 ** 3) // 2x FP16 for Adam (realistic)
    : (parameters * precisionBytes * 0.2) / (1024 ** 3); // LoRA

  // Activation memory (realistic)
  const activations = (
    layers *
    batchSize *
    sequenceLength *
    hiddenSize *
    4 * // MLP intermediate factor
    2 * // forward + backward
    precisionBytes *
    gradientAccumulation
  ) / (1024 ** 3 * numGPUs);

  // No KV cache in training
  const kvCache = 0;

  // Lower overhead to 5%
  const overhead = (weights + gradients + optimizer + activations) * 0.05;

  const total = (weights + gradients + optimizer + activations + overhead) / numGPUs;
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
      value: kvCache,
      percentage: 0
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
    kvCache,
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
