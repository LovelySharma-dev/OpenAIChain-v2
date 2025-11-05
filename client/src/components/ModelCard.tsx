import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Database, TrendingUp, Coins, Loader2 } from "lucide-react";
import { trainModel, TrainingResponse } from "../api";
import { TrainingModal } from "./TrainingModal";
import { useAuth } from "../hooks/useAuth";

interface ModelCardProps {
  name: string;
  category: string;
  accuracy: number | string;
  datasetSize: string;
  reward: number;
  description?: string;
  walletAddress?: string | null;
}

export function ModelCard({ name, category, accuracy, datasetSize, reward, description, walletAddress }: ModelCardProps) {
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState<TrainingResponse | null>(null);
  const { isAuthenticated, token, refreshUser } = useAuth();

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'vision':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'nlp':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'audio':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default:
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
    }
  };

  const handleTrainModel = async () => {
    // Auth removed: allow training for guest users (no token required)
    setTraining(true);
    setResult(null);
    try {
      const res = await trainModel({ 
        modelName: name, 
        epochs: 5,
        walletAddress: walletAddress || undefined
      }, token);
      setResult(res);
      
      // Show reward notification and refresh user balance
      if (res.rewardAmount) {
        alert(`🎉 Training complete! You earned ${res.rewardAmount} OAC tokens!`);
        // Refresh user data to show updated balance (if available)
        try { await refreshUser?.(); } catch {};
      }
    } catch (err) {
      console.error("❌ Training failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Training failed. Please try again.";
      alert(`Training failed: ${errorMessage}`);
    } finally {
      setTraining(false);
    }
  };

  return (
    <>
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/10 to-blue-900/10 border-purple-500/30 backdrop-blur-sm p-6 hover:border-purple-400/50 transition-all group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all"></div>

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-purple-100 mb-1">{name}</h3>
              {description && (
                <p className="text-sm text-gray-400">{description}</p>
              )}
            </div>
            <Badge className={getCategoryColor(category)}>
              {category}
            </Badge>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span>Accuracy</span>
              </div>
              <span className="text-green-400">{accuracy}%</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Database className="h-4 w-4 text-blue-400" />
                <span>Dataset</span>
              </div>
              <span className="text-blue-300">{datasetSize}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span>Reward</span>
              </div>
              <span className="text-yellow-400">{reward} OAC</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleTrainModel}
            disabled={training}
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-lg shadow-purple-500/20 transition-all ${training ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {training ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Training...
              </>
            ) : (
              "Train Model"
            )}
          </Button>
        </div>
      </Card>

      {/* ✅ Federated Training Result Modal */}
      {result && <TrainingModal result={result} onClose={() => setResult(null)} />}
    </>
  );
}
