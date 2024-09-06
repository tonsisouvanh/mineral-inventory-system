'use client';
import React, { useMemo } from 'react';
import { FaProductHunt, FaBoxesStacked, FaClipboardList } from 'react-icons/fa6';
import { useProduct } from '@/hooks/useProduct';
import { useProductStock } from '@/hooks/useProductStock';
import { useOrder } from '@/hooks/useOrder';
import StatCard from './StatCard';
import { FaShippingFast } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';

const Stats = () => {
  const { useGetAllProducts } = useProduct();
  const productQuery = useGetAllProducts();
  const { useGetAllProductStocks, useCountProductStockMovements } = useProductStock();
  const productStockQuery = useGetAllProductStocks();
  const { useGetAllOrders } = useOrder();
  const orderQuery = useGetAllOrders();
  const { data: productStockDataCount } = useCountProductStockMovements();
  const isLoading = productQuery.isLoading || productStockQuery.isLoading || orderQuery.isLoading;
  const isError = productQuery.isError || productStockQuery.isError || orderQuery.isError;

  const { totalProduct, lowStock, normalStock, outOfStock } = useMemo(() => {
    const totalProduct = productQuery.data?.meta.totalElements || 0;
    const lowStock =
      productQuery.data?.data.filter(
        (product: any) =>
          product.quantity <= (parseInt(process.env.NEXT_PUBLIC_REORDER_POINT as string) || 10) && product.quantity > 0
      ).length || 0;
    const normalStock =
      productQuery.data?.data.filter(
        (product: any) => product.quantity > (parseInt(process.env.NEXT_PUBLIC_REORDER_POINT as string) || 10)
      ).length || 0;
    const outOfStock = productQuery.data?.data.filter((product) => (product.quantity as number) <= 0).length || 0;

    return { totalProduct, lowStock, normalStock, outOfStock };
  }, [productQuery.data]);

  const totalOrders = orderQuery.data?.meta.totalElements || 0;
  const totalRevenue = useMemo(() => {
    return orderQuery.data?.data.reduce((acc: number, order: any) => acc + parseInt(order.order_amount), 0) || 0;
  }, [orderQuery.data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="h-36 w-full animate-pulse rounded-md bg-gray-300"></div>
        <div className="h-36 w-full animate-pulse rounded-md bg-gray-300"></div>
        <div className="h-36 w-full animate-pulse rounded-md bg-gray-300"></div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Products"
          value={totalProduct}
          icon={<FaProductHunt size={40} />}
          details={[
            { label: 'Low', value: lowStock },
            { label: 'Normal', value: normalStock },
            { label: 'Out of stock', value: outOfStock },
          ]}
          colors="bg-gradient-to-tr from-blue-600 to-blue-400 bg-clip-border text-white shadow-lg shadow-blue-500/40"
        />
        <StatCard
          title="Stock Movement"
          value={productStockDataCount?.data.totalStockMovements}
          icon={<FaBoxesStacked size={40} />}
          details={[
            { label: 'IN', value: productStockDataCount?.data.inStockCount },
            { label: 'OUT', value: productStockDataCount?.data.outStockCount },
          ]}
          colors="bg-gradient-to-tr from-pink-600 to-pink-400 bg-clip-border text-white shadow-lg shadow-pink-500/40"
        />
        <StatCard
          title="Delivery"
          value={totalProduct}
          icon={<FaShippingFast size={40} />}
          details={[
            { label: 'Shipped', value: 0 },
            { label: 'Pending', value: 0 },
          ]}
          colors="bg-gradient-to-tr from-orange-600 to-orange-400 bg-clip-border text-white shadow-lg shadow-orange-500/40"
        />
        <StatCard
          title="Orders"
          value={totalOrders}
          icon={<FaClipboardList size={40} />}
          details={[{ label: 'Revenue', value: formatPrice(totalRevenue) }]}
          colors="bg-gradient-to-tr from-green-600 to-green-400 bg-clip-border text-white shadow-lg shadow-green-500/40"
        />
      </div>
    </div>
  );
};

export default React.memo(Stats);
