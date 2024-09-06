import { Axios } from '@/config/axios.config';
import { ProductTableFilterType, ProductType } from '@/types/product.type';

export type ResponseTypeSingle = {
  status: string;
  data: ProductType;
};

export type ResponseTypeMultiple = {
  status: string;
  data: ProductType[];
  meta: any;
};

export const fetchAllProducts = async (page?: number, limit?: number, filters?: ProductTableFilterType) => {
  const res = await Axios.get<ResponseTypeMultiple>('/products', {
    params: {
      page,
      limit,
      ...filters,
    },
  });
  return res.data;
};

export const restockProduct = async (values: any) => {
  const { id, ...rest } = values;
  const res = await Axios.put(`/products/product-stocks/${id}`, rest, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const addProduct = async (values: ProductType) => {
  const res = await Axios.post('/products', values, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const fetchProductById = async (id: number) => {
  const res = await Axios.get<ResponseTypeSingle>(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (values: ProductType) => {
  const id = Number(values.id);
  const res = await Axios.put(`/products/${id}`, values, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await Axios.delete(`/products/${id}`);
  return res.data;
};
