import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import {
  deleteProductStock,
  fetchAllProductStock,
  fetchProductStockMovementCount,
} from '@/services/productstock.services';

export const useProductStock = () => {
  const queryClient = useQueryClient();

  //   const useGetProduct = (id: number) => {
  //     return useQuery({
  //       queryKey: ['products', id],
  //       queryFn: () => fetchProductById(id),
  //       refetchOnWindowFocus: false,
  //       refetchOnReconnect: false,
  //     });
  //   };

  // GET ALL PRODUCT STOCKS
  const useGetAllProductStocks = (page?: number, limit?: number, filters?: any) => {
    return useQuery({
      queryKey: ['productStocks', page, limit, filters],
      queryFn: () => fetchAllProductStock(page, limit, filters),
      select: (data) => data,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  const useCountProductStockMovements = () => {
    return useQuery({
      queryKey: ['productStockMovementCounts'],
      queryFn: () => fetchProductStockMovementCount(),
      select: (data) => data,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  //   const useAddNewProduct = () => {
  //     const mutation = useMutation({
  //       mutationFn: async (values: ProductType) => {
  //         const res = await addProduct(values);
  //         return res;
  //       },
  //       onSuccess: () => {
  //         toast.success('Product updated successfully');
  //         queryClient.invalidateQueries({ queryKey: ['products'] });
  //       },
  //       onError: (error: any) => {
  //         const errorMessage = error.response?.data?.message || error.message || 'Failed to add product';

  //         if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
  //           error.response.data.errors.forEach((err: string) => {
  //             toast.error(err);
  //           });
  //         } else {
  //           toast.error(errorMessage);
  //         }
  //       },
  //     });

  //     return mutation;
  //   };

  const useDeleteProductStock = () => {
    const mutation = useMutation({
      mutationFn: async (id: number) => {
        await deleteProductStock(id);
      },
      onSuccess: () => {
        toast.success('Deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['productStocks'] });
      },
      onError: (error: any) => {
        const errorMessage = error.message || error.response?.data?.message || 'Failed to delete';

        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          error.response.data.errors.forEach((err: string) => {
            toast.error(err);
          });
        } else {
          toast.error(errorMessage);
        }
      },
    });

    return mutation;
  };

  return {
    useGetAllProductStocks,
    useDeleteProductStock,
    useCountProductStockMovements,
  };
};
