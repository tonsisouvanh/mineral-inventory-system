import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { ProductTableFilterType, ProductType } from '@/types/product.type';
import {
  addProduct,
  deleteProduct,
  fetchAllProducts,
  fetchProductById,
  restockProduct,
  updateProduct,
} from '@/services/product.services';

export const useProduct = () => {
  const queryClient = useQueryClient();

  const useGetProduct = (id: number) => {
    return useQuery({
      queryKey: ['products', id],
      queryFn: () => fetchProductById(id),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  // GET ALL PRODUCTS
  const useGetAllProducts = (
    page?: number,
    limit?: number,
    filters?: ProductTableFilterType,
    refetchOnWindowFocus = false
  ) => {
    return useQuery({
      queryKey: ['products', page, limit, filters],
      queryFn: () => fetchAllProducts(page, limit, filters),
      select: (data) => data,
      refetchOnWindowFocus: refetchOnWindowFocus,
    });
  };

  const useAddNewProduct = () => {
    const mutation = useMutation({
      mutationFn: async (values: ProductType) => {
        const res = await addProduct(values);
        return res;
      },
      onSuccess: () => {
        toast.success('Product updated successfully');
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add product';

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

  const useUpdateProduct = () => {
    const mutation = useMutation({
      mutationFn: async (values: ProductType) => {
        await updateProduct(values);
      },
      onSuccess: (data, variables, context) => {
        toast.success('Product updated successfully');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product', variables.id] }); // Refetch specific product
      },
      onError: (error: any) => {
        const errorMessage = error.message || error.response?.data?.message || 'Failed to add product';

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

  const useDeleteProduct = () => {
    const mutation = useMutation({
      mutationFn: async (id: number) => {
        await deleteProduct(id);
      },
      onSuccess: () => {
        toast.success('Product deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
      onError: (error: any) => {
        const errorMessage = error.message || error.response?.data?.message || 'Failed to add product';

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

  const useRestockProduct = () => {
    const mutation = useMutation({
      mutationFn: async (values: any) => {
        await restockProduct(values);
      },
      onSuccess: (data, variables, context) => {
        toast.success('Product updated successfully');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product', variables.id] }); // Refetch specific product
      },
      onError: (error: any) => {
        const errorMessage = error.message || error.response?.data?.message || 'Failed to restock product';

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
    useRestockProduct,
    useDeleteProduct,
    useAddNewProduct,
    useUpdateProduct,
    useGetProduct,
    useGetAllProducts,
  };
};
