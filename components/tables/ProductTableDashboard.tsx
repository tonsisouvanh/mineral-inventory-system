'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Typography, Table, Modal, Divider } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FaArrowsRotate } from 'react-icons/fa6';
import { ProductType } from '@/types/product.type';
import { useProduct } from '@/hooks/useProduct';
import Link from 'next/link';
import RestockForm from '../forms/RestockForm';

const { Title } = Typography;

const StockTable: React.FC = () => {
  const [productId, setProductId] = useState<number | null>(null);
  const [isReStockModalOpen, setIsReStockModalOpen] = useState<boolean>(false);
  const { useGetAllProducts } = useProduct();

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 25,
  });

  const {
    data: productData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllProducts(pagination.current as number, pagination.pageSize as number);

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setPagination(pagination);
  }, []);

  const handleReStock = useCallback((id: number) => {
    setIsReStockModalOpen(true);
    setProductId(id);
  }, []);

  useEffect(() => {
    refetch();
  }, [pagination, refetch]);

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
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
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
              record.quantity > (parseInt(process.env.NEXT_PUBLIC_REORDER_POINT as string) || 10)
                ? 'success'
                : record.quantity <= 10 && record.quantity > 0
                  ? 'warning'
                  : record.quantity <= 0
                    ? 'error'
                    : 'error'
            }
            text={
              record.quantity > (parseInt(process.env.NEXT_PUBLIC_REORDER_POINT as string) || 10)
                ? 'Normal'
                : record.quantity <= 10 && record.quantity > 0
                  ? 'Low'
                  : record.quantity <= 0
                    ? 'Out of Stock'
                    : 'Unknown'
            }
          />
        ),
        sorter: (a, b) => a.quantity - b.quantity,
      },
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

  if (isLoading) {
    return <div className="mt-10 h-96 w-full animate-pulse rounded-md bg-gray-300"></div>;
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
      <div className="">
        <Table
          title={() => (
            <div className="flex w-full justify-between">
              <Title level={4}>Stocks</Title>
              <Link className="underline hover:text-color-2" href="manage-stock">
                See all
              </Link>
            </div>
          )}
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
