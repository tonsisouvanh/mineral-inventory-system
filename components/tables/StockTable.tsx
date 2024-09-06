'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Typography, Modal, Spin, Table, Divider } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FaArrowsRotate } from 'react-icons/fa6';
import { ProductTableFilterType, ProductType } from '@/types/product.type';
import { useProduct } from '@/hooks/useProduct';
import ProductFilter from '../filters/ProductFilter';
import RestockForm from '../forms/RestockForm';

const { Title } = Typography;

const StockTable: React.FC = () => {
  const [productId, setProductId] = useState<number | null>(null);
  const [isReStockModalOpen, setIsReStockModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const { useGetAllProducts, useDeleteProduct } = useProduct();

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<ProductTableFilterType>({
    name: '',
    status: '',
    date: null,
  });

  const {
    data: productData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllProducts(pagination.current as number, pagination.pageSize as number, filters, true);
  const { mutateAsync: mutateDeleteProduct, isPending: isDeletePending } = useDeleteProduct();

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setPagination(pagination);
  }, []);

  // const handleDelete = useCallback(
  //   async (id: number) => {
  //     await mutateDeleteProduct(id);
  //     // Check if the current page is empty
  //     if (productData?.data.length === 1 && (pagination?.current as number) > 1) {
  //       setPagination((prev) => ({
  //         ...prev,
  //         current: (prev?.current as number) - 1,
  //       }));
  //     }
  //     refetch();
  //   },
  //   [mutateDeleteProduct, pagination, productData?.data.length, refetch]
  // );

  const handleFilterChange = useCallback((filterType: string, values: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: values,
    }));
  }, []);

  const handleReStock = useCallback((id: number) => {
    setIsReStockModalOpen(true);
    setProductId(id);
  }, []);

  useEffect(() => {
    refetch();
  }, [filters, pagination, refetch, search]);

  const columns: ColumnsType<ProductType | any> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        hidden: true,
      },
      {
        title: 'ID',
        dataIndex: 'product_number',
        key: 'product_number',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name) => <p className="line-clamp-2">{name}</p>,
      },
      // {
      //   title: 'Description',
      //   dataIndex: 'short_description',
      //   key: 'short_description',
      //   render: (short_description) => (
      //     <div
      //       className="line-clamp-2 whitespace-pre-line"
      //       style={{ whiteSpace: 'pre-line' }}
      //       dangerouslySetInnerHTML={{ __html: short_description }}
      //     />
      //   ),
      // },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Pack',
        dataIndex: 'pack',
        key: 'pack',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Status',
        key: 'stock_status',
        render: (_, record) => (
          <Badge
            className="whitespace-nowrap"
            status={
              record.quantity > 10
                ? 'success'
                : record.quantity <= (parseInt(process.env.NEXT_PUBLIC_REORDER_POINT as string) || 10) &&
                    record.quantity !== 0
                  ? 'warning'
                  : 'error'
            }
            text={
              record.quantity > (parseInt(process.env.NEXT_PUBLIC_REORDER_POINT as string) || 10)
                ? 'Normal'
                : record.quantity <= 10 && record.quantity !== 0
                  ? 'Low'
                  : 'Out of Stock'
            }
          />
        ),
      },
      // {
      //   title: 'Reorder Level',
      //   dataIndex: 'reorder_level',
      //   key: 'reorder_level',
      // },
      // {
      //   title: 'Active At',
      //   dataIndex: 'active_at',
      //   key: 'active_at',
      //   // render: (active_at) => (active_at ? new Date(active_at).toLocaleString('en-US') : 'Not Active'),
      //   render: (active_at) => (active_at ? format(new Date(active_at), 'dd/MM/yyyy') : 'Not Active'),
      // },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button onClick={() => handleReStock(record.id)} size="small" icon={<FaArrowsRotate />} type="default">
            Restock
          </Button>
        ),
      },
    ],
    [handleReStock]
  );

  const handleCloseModal = () => {
    setIsReStockModalOpen(false);
  };

  // Filter out hidden columns
  const filteredColumns = useMemo(() => columns.filter((column) => !column.hidden), [columns]);
  if (isDeletePending) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-white/70">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading products: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  return (
    <>
      <Modal open={isReStockModalOpen} onCancel={() => setIsReStockModalOpen(false)} footer={null} maskClosable={false}>
        <Title className="!text-lg">Add Stock</Title>
        <Divider />
        <RestockForm handleCloseModal={handleCloseModal} id={productId} />
      </Modal>
      <div className="w-full">
        <ProductFilter onFilterChange={handleFilterChange} setSearch={setSearch} />
        <Table
          className=""
          loading={isLoading}
          rowKey="id"
          columns={filteredColumns}
          dataSource={productData?.data}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: productData?.meta?.totalElements,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  );
};

export default React.memo(StockTable);
