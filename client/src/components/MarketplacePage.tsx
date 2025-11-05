import { useState, useEffect } from "react";
import { ModelCard } from "./ModelCard";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, Upload, Activity, Loader2 } from "lucide-react";
import { fetchModels, Model } from "../api";

interface MarketplacePageProps {
  onNavigate: (page: string) => void;
  walletAddress?: string | null;
}

const recentTransactions = [
  { user: "0x7a9f...2b4c", action: "Trained ImageNet Classifier", reward: "+150 OAC", time: "2 min ago" },
  { user: "0x3d8e...9a1f", action: "Uploaded Dataset", reward: "+75 OAC", time: "5 min ago" },
  { user: "0x5c2b...7e3d", action: "Trained GPT-4 Fine-tune", reward: "+250 OAC", time: "8 min ago" },
  { user: "0x9f1a...4d6c", action: "Model Validation", reward: "+50 OAC", time: "12 min ago" },
  { user: "0x2e7c...8b5a", action: "Trained Speech Recognition", reward: "+200 OAC", time: "15 min ago" },
];

export function MarketplacePage({ onNavigate, walletAddress }: MarketplacePageProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch backend models once when the page loads
  useEffect(() => {
    fetchModels()
      .then((data) => {
        setModels(data.models || []);
      })
      .catch((err) => {
        console.error("❌ Failed to load models:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredModels = models.filter((model) => {
    const name = model.name?.toLowerCase() || "";
    const desc = model.description?.toLowerCase() || "";
    const type = model.type?.toLowerCase() || "";

    const matchesCategory =
      selectedCategory === "all" || type.includes(selectedCategory);
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      desc.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="mb-2 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                AI Model Marketplace
              </h1>
              <p className="text-gray-400">Discover, train, and earn rewards from federated AI models</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-purple-900/10 border-purple-500/30 focus:border-purple-400/50 backdrop-blur-sm"
                />
              </div>
              <div className="flex gap-2">
                {["all", "vision", "nlp", "audio"].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400/30"
                        : "border-purple-500/30 hover:bg-purple-500/10"
                    }
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center mt-12 py-12">
                  <Loader2 className="h-8 w-8 text-purple-400 animate-spin mb-4" />
                  <p className="text-gray-400 text-lg">Loading models...</p>
                </div>
              ) : filteredModels.length > 0 ? (
                filteredModels.map((model, index) => (
                  <ModelCard
                    key={model.id || index}
                    name={model.name}
                    category={model.type || "AI"}
                    accuracy={model.accuracy || "N/A"}
                    description={model.description}
                    reward={Math.floor(Math.random() * 250) + 100}
                    datasetSize={`${Math.floor(Math.random() * 2)}M records`}
                    walletAddress={walletAddress}
                  />
                ))
              ) : (
                <p className="text-gray-400 col-span-full text-center mt-6">
                  No models found.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - Blockchain Ledger */}
          <div className="lg:w-80">
            <Card className="sticky top-24 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-purple-400" />
                <h3 className="text-purple-100">Live Blockchain Ledger</h3>
              </div>

              <div className="space-y-4">
                {recentTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-purple-900/10 border border-purple-500/20 hover:border-purple-400/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm text-purple-300 font-mono">{tx.user}</span>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        {tx.reward}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{tx.action}</p>
                    <p className="text-xs text-gray-500">{tx.time}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30">
                <p className="text-sm text-gray-300 mb-1">Total Transactions (24h)</p>
                <p className="text-2xl text-purple-200">1,247</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Floating Upload Button */}
        <Button className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-2xl shadow-purple-500/40 hover:scale-110 transition-transform">
          <Upload className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
