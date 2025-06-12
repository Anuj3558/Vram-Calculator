
import { ModelConfig, VRAMResults } from "@/types/calculator";
import { formatBytes, formatPercentage } from "@/utils/vramCalculator";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ResultsDisplayProps {
  config: ModelConfig;
  results: VRAMResults;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function ResultsDisplay({ config, results }: ResultsDisplayProps) {
  const pieData = [
    { name: 'Weights', value: results.breakdown.weights.value, percentage: results.breakdown.weights.percentage },
    { name: 'KV Cache', value: results.breakdown.kvCache.value, percentage: results.breakdown.kvCache.percentage },
    { name: 'Activations', value: results.breakdown.activations.value, percentage: results.breakdown.activations.percentage },
    { name: 'Overhead', value: results.breakdown.overhead.value, percentage: results.breakdown.overhead.percentage },
  ];

  const barData = [
    { name: 'Weights', value: results.weights },
    { name: 'KV Cache', value: results.kvCache },
    { name: 'Activations', value: results.activations },
    { name: 'Overhead', value: results.overhead },
  ];

  const getStatusIcon = () => {
    if (results.fitsOnGPU) {
      return results.utilizationPercentage > 90 ? (
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
      ) : (
        <CheckCircle className="h-5 w-5 text-green-500" />
      );
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (results.fitsOnGPU) {
      return results.utilizationPercentage > 90 ? "High Utilization" : "Fits on GPU";
    }
    return "Exceeds GPU Memory";
  };

  const getStatusColor = () => {
    if (results.fitsOnGPU) {
      return results.utilizationPercentage > 90 ? "warning" : "default";
    }
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Memory Requirements</h2>
          <Badge variant={getStatusColor() as any} className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatBytes(results.total)}</div>
            <div className="text-sm text-muted-foreground">Total Required</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{config.availableVRAM}GB</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{formatPercentage(results.utilizationPercentage)}</div>
            <div className="text-sm text-muted-foreground">Utilization</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{formatBytes(Math.max(0, config.availableVRAM - results.total))}</div>
            <div className="text-sm text-muted-foreground">Remaining</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>GPU Memory Usage</span>
            <span>{formatPercentage(results.utilizationPercentage)}</span>
          </div>
          <Progress value={Math.min(results.utilizationPercentage, 100)} className="h-3" />
        </div>
      </Card>

      {/* Memory Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Memory Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatBytes(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Memory Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value.toFixed(1)}GB`} />
                <Tooltip formatter={(value: number) => [formatBytes(value), "Memory"]} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Detailed Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(results.breakdown).map(([key, data]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[Object.keys(results.breakdown).indexOf(key)] }} />
                <span className="font-medium capitalize text-foreground">{key.replace(/([A-Z])/g, ' $1')}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">{formatBytes(data.value)}</div>
                <div className="text-sm text-muted-foreground">{formatPercentage(data.percentage)}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Optimization Recommendations</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {!results.fitsOnGPU && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 font-medium">Memory exceeds GPU capacity!</p>
              <ul className="mt-2 space-y-1 text-red-600 dark:text-red-500">
                <li>• Consider using INT8 or INT4 quantization for weights</li>
                <li>• Reduce batch size or sequence length</li>
                <li>• Use gradient checkpointing if training</li>
                <li>• Consider model sharding across multiple GPUs</li>
              </ul>
            </div>
          )}
          
          {results.fitsOnGPU && results.utilizationPercentage > 90 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-400 font-medium">High memory utilization - consider optimization</p>
              <ul className="mt-2 space-y-1 text-yellow-600 dark:text-yellow-500">
                <li>• Use FP16 for KV cache if not already enabled</li>
                <li>• Consider slightly reducing sequence length for safety margin</li>
              </ul>
            </div>
          )}

          {results.fitsOnGPU && results.utilizationPercentage <= 90 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-400 font-medium">Good memory utilization!</p>
              <ul className="mt-2 space-y-1 text-green-600 dark:text-green-500">
                <li>• You have {formatBytes(config.availableVRAM - results.total)} of free memory</li>
                <li>• Consider increasing batch size for better throughput</li>
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
