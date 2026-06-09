import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Generic mutation hook
 * @param {Function} mutationFn - fungsi API untuk create/update/delete
 * @param {Object} options - tambahan option seperti onSuccess, onError
 * @param {Array|string} invalidateKeys - queryKey(s) yang harus di-refetch setelah mutate
 */
const useGenericMutation = (mutationFn, options = {}, invalidateKeys = []) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Refresh query spesifik saja
      if (invalidateKeys.length > 0) {
        invalidateKeys.forEach((key) => queryClient.invalidateQueries(key));
      } else {
        queryClient.invalidateQueries(); // fallback: refresh semua
      }

      // Jalankan onSuccess custom kalau ada
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (options.onError) options.onError(error, variables, context);
    },
    ...options,
  });
};

export default useGenericMutation;