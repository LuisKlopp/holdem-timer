import { useQuery } from "@tanstack/react-query";

import { getHoldemMembers } from "@/api";

export const holdemMemberQueryKeys = {
  all: ["holdem-members"] as const,
};

export const useHoldemMembers = (enabled = true) =>
  useQuery({
    enabled,
    queryFn: getHoldemMembers,
    queryKey: holdemMemberQueryKeys.all,
  });
