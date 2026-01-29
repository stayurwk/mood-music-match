import { motion } from "framer-motion";
import { Music, Mic2, Disc, Play, Square, Loader2 } from "lucide-react";
import type { RecommendationItem } from "@shared/schema";
import { useState, useRef, useEffect } from "react";
import { api, buildUrl } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RecommendationCardProps {
  item: RecommendationItem;
  index: number;
}

export function RecommendationCard({ item, index }: RecommendationCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const getIcon = () => {
    switch (item.type) {
      case "song": return <Music className="w-5 h-5 text-primary" />;
      case "artist": return <Mic2 className="w-5 h-5 text-accent" />;
      case "genre": return <Disc className="w-5 h-5 text-purple-400" />;
    }
  };

  const getLabel = () => {
    switch (item.type) {
      case "song": return "Track";
      case "artist": return "Artist";
      case "genre": return "Genre";
    }
  };

  const handlePlayPreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (previewUrl) {
      playAudio(previewUrl);
      return;
    }

    setIsLoading(true);
    try {
      const url = `${api.preview.get.path}?name=${encodeURIComponent(item.name)}&artist=${encodeURIComponent(item.description.split('by')[1]?.trim() || '')}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch preview");
      
      const data = await res.json();
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
        playAudio(data.previewUrl);
      } else {
        toast({
          title: "Preview unavailable",
          description: "We couldn't find a preview for this recommendation.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load song preview.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
    } else {
      audioRef.current.src = url;
    }
    audioRef.current.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:bg-secondary/60 transition-colors duration-300"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {getIcon()}
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background/50 border border-white/5">
            {getIcon()}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {getLabel()}
          </span>
        </div>

        {item.type === "song" && (
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-primary/20"
            onClick={handlePlayPreview}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Square className="w-4 h-4 fill-primary text-primary" />
            ) : (
              <Play className="w-4 h-4 fill-primary text-primary" />
            )}
          </Button>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
        {item.name}
      </h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-white/80 transition-colors">
        {item.description}
      </p>

      {/* Decorative gradient blur */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all duration-500" />
    </motion.div>
  );
}
