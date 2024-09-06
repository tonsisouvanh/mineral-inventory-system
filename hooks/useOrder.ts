import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchAllOrders, fetchOrderById, addOrder, updateOrder, deleteOrder } from '@/services/order.services';
import { OrderType } from '@/types/order.type';

export const useOrder = () => {
  const queryClient = useQueryClient();

  const useGetOrder = (id: string) => {
    return useQuery({
      queryKey: ['orders', id],
      queryFn: () => fetchOrderById(id),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  const useGetAllOrders = (
    page?: number,
    limit?: number,
    // filters?: OrderTableFilterType,
    filters?: any,
    search?: string,
    refetchOnWindowFocus = false
  ) => {
    return useQuery({
      queryKey: ['orders', page, limit, filters, search],
      queryFn: () => fetchAllOrders(page, limit, filters, search),
      select: (data) => data,
      refetchOnWindowFocus: refetchOnWindowFocus,
    });
  };

  const useAddNewOrder = () => {
    const mutation = useMutation({
      mutationFn: async (values: OrderType) => {
        const res = await addOrder(values);
        return res;
      },
      onSuccess: () => {
        toast.success('Order added successfully');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add order';

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

  const useUpdateOrder = () => {
    const mutation = useMutation({
      mutationFn: async (values: OrderType) => {
        await updateOrder(values);
      },
      onSuccess: (data, variables, context) => {
        toast.success('Order updated successfully');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['order', variables.id] }); // Refetch specific order
      },
      onError: (error: any) => {
        const errorMessage = error.message || error.response?.data?.message || 'Failed to update order';

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

  const useDeleteOrder = () => {
    const mutation = useMutation({
      mutationFn: async (id: string) => {
        await deleteOrder(id);
      },
      onSuccess: () => {
        toast.success('Order deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
      onError: (error: any) => {
        const errorMessage = error.message || error.response?.data?.message || 'Failed to delete order';

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
    useGetOrder,
    useGetAllOrders,
    useAddNewOrder,
    useUpdateOrder,
    useDeleteOrder,
  };
};
