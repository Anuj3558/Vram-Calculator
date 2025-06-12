
import { ModelPreset, GPUSpecs } from "@/types/calculator";

export const MODEL_PRESETS: Record<string, ModelPreset> = {
  "deepseek-r1-3b": {
    name: "DeepSeek-R1 3B",
    parameters: 3000000000,
    layers: 28,
    hiddenSize: 2560,
    kvHeads: 20,
    headDimension: 128
  },
  "deepseek-r1-7b": {
    name: "DeepSeek-R1 7B",
    parameters: 7000000000,
    layers: 32,
    hiddenSize: 4096,
    kvHeads: 32,
    headDimension: 128
  },
  "llama-2-7b": {
    name: "LLaMA 2 7B",
    parameters: 7000000000,
    layers: 32,
    hiddenSize: 4096,
    kvHeads: 32,
    headDimension: 128
  },
  "llama-2-13b": {
    name: "LLaMA 2 13B",
    parameters: 13000000000,
    layers: 40,
    hiddenSize: 5120,
    kvHeads: 40,
    headDimension: 128
  },
  "llama-2-70b": {
    name: "LLaMA 2 70B",
    parameters: 70000000000,
    layers: 80,
    hiddenSize: 8192,
    kvHeads: 64,
    headDimension: 128
  },
  "mistral-7b": {
    name: "Mistral 7B",
    parameters: 7200000000,
    layers: 32,
    hiddenSize: 4096,
    kvHeads: 32,
    headDimension: 128
  },
  "custom": {
    name: "Custom Model",
    parameters: 7000000000,
    layers: 32,
    hiddenSize: 4096,
    kvHeads: 32,
    headDimension: 128
  }
};

export const GPU_SPECS: Record<string, GPUSpecs> = {
  "rtx-3060-12gb": {
    name: "RTX 3060 (12GB)",
    vram: 12,
    memoryBandwidth: 360,
    architecture: "Ampere"
  },
  "rtx-3070": {
    name: "RTX 3070 (8GB)",
    vram: 8,
    memoryBandwidth: 448,
    architecture: "Ampere"
  },
  "rtx-4070": {
    name: "RTX 4070 (12GB)",
    vram: 12,
    memoryBandwidth: 504,
    architecture: "Ada Lovelace"
  },
  "rtx-4080": {
    name: "RTX 4080 (16GB)",
    vram: 16,
    memoryBandwidth: 717,
    architecture: "Ada Lovelace"
  },
  "rtx-4090": {
    name: "RTX 4090 (24GB)",
    vram: 24,
    memoryBandwidth: 1008,
    architecture: "Ada Lovelace"
  },
  "rtx-3090": {
    name: "RTX 3090 (24GB)",
    vram: 24,
    memoryBandwidth: 936,
    architecture: "Ampere"
  },
  "a100-40gb": {
    name: "A100 40GB",
    vram: 40,
    memoryBandwidth: 1555,
    architecture: "Ampere"
  },
  "a100-80gb": {
    name: "A100 80GB",
    vram: 80,
    memoryBandwidth: 1935,
    architecture: "Ampere"
  },
  "h100": {
    name: "H100 80GB",
    vram: 80,
    memoryBandwidth: 3350,
    architecture: "Hopper"
  }
};
