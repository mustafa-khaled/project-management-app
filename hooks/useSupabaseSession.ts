"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const supabase = createClient();

export function useSupabaseSession() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["supabase-user"],
    queryFn: async (): Promise<User | null> => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return data.session?.user ?? null;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Manually update React Query cache when auth state changes
      queryClient.setQueryData(["supabase-user"], session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return {
    user,
    isLoading,
    isError: !!error,
    error,
  };
}
