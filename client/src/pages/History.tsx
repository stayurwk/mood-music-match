import { useHistory } from "@/hooks/use-recommendations";
import { HistoryItem } from "@/components/HistoryItem";
import { Loader2, History as HistoryIcon, SearchX } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const { data: history, isLoading, error } = useHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Failed to load history</h2>
        <p className="text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-secondary border border-white/5">
          <HistoryIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">History</h1>
          <p className="text-muted-foreground">Your past mood discoveries</p>
        </div>
      </div>

      {!history || history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 rounded-3xl glass-card border-dashed border-2 border-white/10"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
            <HistoryIcon className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No history yet</h3>
          <p className="text-muted-foreground">
            Your search history will appear here once you start exploring.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {history.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <HistoryItem item={item} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
