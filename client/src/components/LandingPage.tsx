import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Network, Database, Coins, Users, ArrowRight, Github, Twitter, Linkedin } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20"></div>
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1731439635307-6931d0237bfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwQUklMjBob2xvZ3JhcGhpYyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYyMDg2NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15
          }}
        ></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
            <span className="text-purple-300">Powered by Blockchain & Federated Learning</span>
          </div>
          
          <h1 className="mb-6 bg-gradient-to-r from-purple-200 via-blue-200 to-teal-200 bg-clip-text text-transparent text-5xl md:text-7xl">
            Collaborate. Train. Earn Tokens.
          </h1>
          
          <p className="mb-12 text-xl text-gray-300 max-w-2xl mx-auto">
            Join the decentralized AI revolution. Contribute to federated learning models, 
            share datasets, and earn rewards through blockchain-based tokenomics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("marketplace")}
              className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 px-8 py-6 shadow-lg shadow-purple-500/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Marketplace
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </Button>
            
            <Button
              onClick={() => onNavigate("dashboard")}
              variant="outline"
              className="border-purple-400/50 hover:bg-purple-500/10 px-8 py-6 backdrop-blur-sm"
            >
              Join as Developer
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-center mb-16 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 backdrop-blur-sm p-6 hover:border-purple-400/50 transition-all group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="mb-4 w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-400/30">
                  <Network className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mb-2 text-purple-200">Federated Learning</h3>
                <p className="text-gray-400">
                  Train AI models collaboratively without sharing raw data. Privacy-preserving machine learning at scale.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30 backdrop-blur-sm p-6 hover:border-blue-400/50 transition-all group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="mb-4 w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                  <Database className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-blue-200">Community Datasets</h3>
                <p className="text-gray-400">
                  Access diverse, high-quality datasets contributed by the community. Share your data and earn rewards.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-teal-900/20 to-teal-800/10 border-teal-500/30 backdrop-blur-sm p-6 hover:border-teal-400/50 transition-all group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="mb-4 w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-400/30">
                  <Coins className="h-6 w-6 text-teal-400" />
                </div>
                <h3 className="mb-2 text-teal-200">Token Rewards</h3>
                <p className="text-gray-400">
                  Earn OAC tokens for contributing compute power, datasets, and expertise to AI model training.
                </p>
              </div>
            </Card>

            {/* Feature 4 */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-pink-900/20 to-pink-800/10 border-pink-500/30 backdrop-blur-sm p-6 hover:border-pink-400/50 transition-all group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="mb-4 w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-400/30">
                  <Users className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="mb-2 text-pink-200">Decentralized Governance (DAO)</h3>
                <p className="text-gray-400">
                  Participate in platform decisions. Token holders vote on model improvements and feature updates.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-12 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-lg opacity-50"></div>
                <Network className="relative h-6 w-6 text-purple-400" />
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                OpenAIChain
              </span>
            </div>

            <div className="flex gap-6">
  <a
    href="https://github.com/LovelySharma-dev/OpenAIChain"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-purple-400 transition-colors"
  >
    <Github className="h-5 w-5" />
  </a>
</div>
            

            <p className="text-sm text-gray-400">
              Privacy-first AI. No data collection. Open source.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
