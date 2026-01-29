import { useState } from "react";
import { useRecommendations } from "@/hooks/use-recommendations";
import { Sparkles, ArrowRight, Loader2, Music4 } from "lucide-react";
import { motion } from "framer-motion";
import { RecommendationCard } from "@/components/RecommendationCard";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [mood, setMood] = useState("");
  const { mutate: getRecommendations, isPending, data } = useRecommendations();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    getRecommendations({ mood }, {
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Music Discovery</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Discover music that matches your <span className="text-gradient">vibe</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tell us how you're feeling, what you're doing, or describe a scene. 
            Our AI will curate the perfect mix of songs, artists, and genres for the moment.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
            <div className="relative flex items-center">
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g., Driving down the coast at sunset..."
                disabled={isPending}
                className="w-full px-6 py-4 sm:py-5 rounded-xl bg-secondary/80 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all shadow-xl text-lg"
              />
              <button
                type="submit"
                disabled={!mood.trim() || isPending}
                className="absolute right-2 p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary/20"
              >
                {isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <ArrowRight className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </div>

      {/* Results Section */}
      {data && (
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-2 text-primary">
              <Music4 className="w-5 h-5" />
              <span className="font-medium">Recommended for you</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recommendations.map((item, i) => (
              <RecommendationCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State / Decorative Elements */}
      {!data && !isPending && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 text-center"
        >
          <div className="inline-block p-4 rounded-full bg-white/5 backdrop-blur border border-white/5 mb-4">
            <div className="flex gap-4 opacity-50">
              <div className="w-12 h-1 bg-white/20 rounded-full animate-pulse" />
              <div className="w-8 h-1 bg-white/20 rounded-full animate-pulse delay-75" />
              <div className="w-16 h-1 bg-white/20 rounded-full animate-pulse delay-150" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Type a mood above to start discovering</p>
        </motion.div>
      )}
    </div>
  );
}
