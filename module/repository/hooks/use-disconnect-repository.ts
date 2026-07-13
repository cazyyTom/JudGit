"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectRepository } from "@/module/settings/action";
import { toast } from "sonner";

export const useDisconnectRepository = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (repositoryId: string) => {
      return await disconnectRepository(repositoryId);
    },
    onSuccess: () => {
      toast.success("Repository disconnected successfully!");
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
      queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
    },
    onError: (error) => {
      toast.error("Failed to disconnect repository.");
      console.error(error);
    }
  });
}
