import { useQuery } from "@tanstack/react-query";

const useGenerikFetch = (key, fetchFunction, options = {}) => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],  // Bisa string atau array
    queryFn: fetchFunction,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default useGenerikFetch;