
import { ModelConfig } from "@/types/calculator";
import { MODEL_PRESETS } from "@/data/modelPresets";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ModelSelectorProps {
  config: ModelConfig;
  updateConfig: (updates: Partial<ModelConfig>) => void;
}

export function ModelSelector({ config, updateConfig }: ModelSelectorProps) {
  const handleModelChange = (modelType: string) => {
    const preset = MODEL_PRESETS[modelType];
    updateConfig({
      modelType,
      parameters: preset.parameters,
      layers: preset.layers,
      hiddenSize: preset.hiddenSize,
      kvHeads: preset.kvHeads,
      headDimension: preset.headDimension
    });
  };

  const isCustom = config.modelType === "custom";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="model-select">Model Type</Label>
        <Select value={config.modelType} onValueChange={handleModelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MODEL_PRESETS).map(([key, preset]) => (
              <SelectItem key={key} value={key}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isCustom && (
        <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
          <h4 className="text-sm font-medium text-foreground">Custom Model Parameters</h4>
          
          <div>
            <Label htmlFor="parameters">Parameters (billions)</Label>
            <Input
              id="parameters"
              type="number"
              value={config.parameters / 1000000000}
              onChange={(e) => updateConfig({ parameters: parseFloat(e.target.value) * 1000000000 })}
              step="0.1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="layers">Layers</Label>
              <Input
                id="layers"
                type="number"
                value={config.layers}
                onChange={(e) => updateConfig({ layers: parseInt(e.target.value) })}
              />
            </div>
            
            <div>
              <Label htmlFor="hidden-size">Hidden Size</Label>
              <Input
                id="hidden-size"
                type="number"
                value={config.hiddenSize}
                onChange={(e) => updateConfig({ hiddenSize: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="kv-heads">KV Heads</Label>
              <Input
                id="kv-heads"
                type="number"
                value={config.kvHeads}
                onChange={(e) => updateConfig({ kvHeads: parseInt(e.target.value) })}
              />
            </div>
            
            <div>
              <Label htmlFor="head-dim">Head Dimension</Label>
              <Input
                id="head-dim"
                type="number"
                value={config.headDimension}
                onChange={(e) => updateConfig({ headDimension: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
