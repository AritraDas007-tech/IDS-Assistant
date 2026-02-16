import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type ChatRequest, type ChatResponse, type Message } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// ============================================
// CHAT HOOKS
// ============================================

export function useChatHistory() {
  return useQuery({
    queryKey: [api.chat.history.path],
    queryFn: async () => {
      const res = await fetch(api.chat.history.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      // Validate with schema from routes definition
      const data = await res.json();
      return api.chat.history.responses[200].parse(data);
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: ChatRequest) => {
      const res = await fetch(api.chat.send.path, {
        method: api.chat.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Try to parse error message if available
        try {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to send message");
        } catch (e) {
          throw new Error("Failed to send message");
        }
      }

      const data = await res.json();
      return api.chat.send.responses[200].parse(data);
    },
    onSuccess: (data) => {
      // Invalidate history to show new messages
      queryClient.invalidateQueries({ queryKey: [api.chat.history.path] });
    },
    onError: (error) => {
      toast({
        title: "Transmission Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
