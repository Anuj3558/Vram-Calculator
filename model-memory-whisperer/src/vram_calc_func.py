#!/usr/bin/env python3
"""
APXML-style VRAM Estimator for LLMs (Inference)
Usage:
  python vram_calc_apxml.py config.json
  cat config.json | python vram_calc_apxml.py
"""

import json
import math
import sys
from pathlib import Path
from typing import Dict, Any

BYTE_TO_GB = 1024 ** 3
FIXED_OVERHEAD_GB = 1.35  # Matches APXML fixed framework overhead

def bytes_to_gb(n_bytes: float) -> float:
    return n_bytes / BYTE_TO_GB

def get_val(d: Dict[str, Any], *keys, default=None):
    """Safe nested dict getter"""
    cur = d
    for k in keys:
        if not isinstance(cur, dict) or k not in cur:
            return default
        cur = cur[k]
    return cur

def param_bytes(cfg: Dict[str, Any]) -> int:
    bits = get_val(cfg, "quantization", "bits_per_weight", default=16)
    params = get_val(cfg, "parameters", "total_parameters")
    return int(params * bits / 8)

def kv_cache_bytes_apxml(cfg: Dict[str, Any]) -> int:
    B = cfg.get("batch_size", 1)
    S = cfg.get("context_length", 2048)
    U = cfg.get("concurrent_users", 1)
    L = get_val(cfg, "parameters", "num_layers")
    H = get_val(cfg, "parameters", "hidden_size")
    A = get_val(cfg, "parameters", "num_attention_heads")
    D = H // A
    bits = get_val(cfg, "quantization", "bits_per_activation", default=16)
    return int(U * B * S * L * 2 * D * bits / 8)

def activation_bytes_apxml(cfg: Dict[str, Any]) -> int:
    B = cfg.get("batch_size", 1)
    S = cfg.get("context_length", 2048)
    U = cfg.get("concurrent_users", 1)
    L = get_val(cfg, "parameters", "num_layers")
    H = get_val(cfg, "parameters", "hidden_size")
    bits = get_val(cfg, "quantization", "bits_per_activation", default=16)
    return int(U * B * S * H * L * bits / 8)

def compute_apxml_vram(cfg: Dict[str, Any]) -> Dict[str, float]:
    out = {}

    # Components
    param_b = param_bytes(cfg)
    kv_b = kv_cache_bytes_apxml(cfg)
    act_b = activation_bytes_apxml(cfg)

    # Convert to GB
    param_gb = bytes_to_gb(param_b)
    kv_gb = bytes_to_gb(kv_b)
    act_gb = bytes_to_gb(act_b)

    total_gb = param_gb + kv_gb + act_gb + FIXED_OVERHEAD_GB

    out["APXML_VRAM_Profile"] = {
        "base_model_weights_gb": round(param_gb, 2),
        "activations_gb": round(act_gb, 2),
        "kv_cache_gb": round(kv_gb, 2),
        "framework_overhead_gb": FIXED_OVERHEAD_GB,
        "total_vram_required_gb": round(total_gb, 2)
    }

    return out

def main():
    if len(sys.argv) > 1 and Path(sys.argv[1]).exists():
        data = json.load(open(sys.argv[1], "r"))
    else:
        data = json.load(sys.stdin)

    result = compute_apxml_vram(data)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
