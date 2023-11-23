import { useQuery } from "@tanstack/react-query";
import { useAxiosAuthorized } from "./useAxiosAuthorized";
import { useDebounce } from "./useDebounce";

export const useSearchbarUsersQuery = (searchTerm: string) => {
  const axiosAuthorized = useAxiosAuthorized();
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return useQuery({
    queryKey: ["users/search", debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm) {
        const response = await axiosAuthorized.get(
          `users/search?query=${debouncedSearchTerm}`
        );
        return response.data;
      }

      return [];
    },
  });
};
