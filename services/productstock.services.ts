import { Axios } from '@/config/axios.config';
import { ProductTableFilterType, ProductType } from '@/types/product.type';

export type ResponseTypeSingle = {
  status: string;
  data: any;
};

export type ResponseTypeMultiple = {
  status: string;
  data: any[];
  meta: any;
};

export const fetchAllProductStock = async (page?: number, limit?: number, filters?: any) => {
  const res = await Axios.get<ResponseTypeMultiple>('/stocks', {
    params: {
      page,
      limit,
      ...filters,
    },
  });
  return res.data;
};

export const fetchProductStockMovementCount = async () => {
  const res = await Axios.get<ResponseTypeSingle>('/products/product-stocks/movement-count');
  return res.data;
};

// export const fetchProductById = async (id: number) => {
//   const res = await Axios.get<ResponseTypeSingle>(`/products/${id}`);
//   return res.data;
// };

// export const updateProduct = async (values: ProductType) => {
//   const id = Number(values.id);
//   const res = await Axios.put(`/products/${id}`, values, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   return res.data;
// };

export const deleteProductStock = async (id: number) => {
  const res = await Axios.delete(`/stocks/${id}`);
  return res.data;
};
