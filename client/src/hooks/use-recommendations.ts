import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type RecommendInput, type RecommendResponse } from "@shared/routes";

export function useRecommendations() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: RecommendInput) => {
      const validated = api.recommend.create.input.parse(data);
      const res = await fetch(api.recommend.create.path, {
        method: api.recommend.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400 || res.status === 500) {
          const error = await res.json();
          throw new Error(error.message || "Failed to get recommendations");
        }
        throw new Error("Something went wrong");
      }

      return api.recommend.create.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate history query to show the new search
      queryClient.invalidateQueries({ queryKey: [api.history.list.path] });
    },
  });

  return mutation;
}

export function useHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(api.history.list.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.history.list.responses[200].parse(await res.json());
    },
  });
}
