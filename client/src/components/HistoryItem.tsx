import { formatDistanceToNow } from "date-fns";
import { Music, Calendar, ChevronRight } from "lucide-react";
import type { Mood } from "@shared/schema";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RecommendationCard } from "./RecommendationCard";

interface HistoryItemProps {
  item: Mood;
}

export function HistoryItem({ item }: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Cast the recommendations since JSONB comes back as any/unknown
  const recommendations = item.recommendations as any[];

  return (
    <div className="rounded-2xl glass-card overflow-hidden border border-white/5 transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white">
              "{item.mood}"
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {item.createdAt 
                  ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
                  : "Just now"}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`p-2 rounded-full bg-white/5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, i) => (
                <RecommendationCard key={i} item={rec} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
