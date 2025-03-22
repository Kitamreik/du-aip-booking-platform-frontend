import { useUser } from "@clerk/clerk-react";

export function useRole() {
  const { user } = useUser();

  const role = user?.publicMetadata?.role;

  return {
    role,
    isAdmin: role === "admin",
  };
}
