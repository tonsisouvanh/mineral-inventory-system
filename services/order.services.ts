import { Axios } from '@/config/axios.config';
import { OrderType } from '@/types/order.type';
// import { OrderTableFilterType, OrderType } from '@/types/order.type';

export type ResponseTypeSingle = {
  status: string;
  data: {
    order: OrderType;
    orderDetails: any;
  };
};

export type ResponseTypeMultiple = {
  status: string;
  data: OrderType[];
  meta: any;
};

export const fetchAllOrders = async (
  page?: number,
  limit?: number,
  //   filters?: OrderTableFilterType,
  filters?: any,
  search?: string
) => {
  const res = await Axios.get<ResponseTypeMultiple>('/orders', {
    params: {
      page,
      limit,
      ...filters,
      search,
    },
  });
  return res.data;
};

export const addOrder = async (values: OrderType) => {
  const res = await Axios.post('/orders', values, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const fetchOrderById = async (id: string) => {
  const res = await Axios.get<ResponseTypeSingle>(`/orders/${id}`);
  return res.data;
};

export const updateOrder = async (values: OrderType) => {
  const id = values.id;
  const res = await Axios.put(`/orders/${id}`, values, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const deleteOrder = async (id: string) => {
  const res = await Axios.delete(`/orders/${id}`);
  return res.data;
};
