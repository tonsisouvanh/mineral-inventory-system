'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Spin, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { ProductTableFilterType, ProductType } from '@/types/product.type';
import ErrorLoadingData from '../ui/ErrorLoadingData';
import { useProductStock } from '@/hooks/useProductStock';
import { format } from 'date-fns';
import { FaTrash } from 'react-icons/fa';
import ModalConfirm from '../ui/ModalConfirm';
import StockMovementFilter from '../filters/StockMovementFilter';
import { getLocalDateTime } from '@/lib/utils';

const StockMovementTable: React.FC = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [stockMovementId, setStockMovementId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<ProductTableFilterType>({
    name: '',
    status: '',
    date: null,
    search: '',
  });

  const { useGetAllProductStocks, useDeleteProductStock } = useProductStock();
  const {
    data: stockMovementData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllProductStocks(pagination.current as number, pagination.pageSize as number, filters);
  const { mutateAsync: mutateDeleteStockMovement, isPending: isDeletePending } = useDeleteProductStock();

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setPagination(pagination);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      await mutateDeleteStockMovement(id);
      if (stockMovementData?.data.length === 1 && (pagination?.current as number) > 1) {
        setPagination((prev) => ({
          ...prev,
          current: (prev?.current as number) - 1,
        }));
      }
      refetch();
    },
    [mutateDeleteStockMovement, pagination, stockMovementData?.data.length, refetch]
  );

  const handleFilterChange = useCallback((filterType: string, values: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: values,
    }));
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
        dataIndex: 'product_id',
        key: 'product_id',
      },
      {
        title: 'Product',
        dataIndex: 'product',
        key: 'product',
        render: (product) => <p className="line-clamp-2">{product?.name}</p>,
      },
      {
        title: 'Movement',
        dataIndex: 'movement_type',
        key: 'movement_type',
        render: (movement_type) => (
          <p
            className={
              movement_type === 'IN' ? 'text-green-500' : movement_type === 'OUT' ? 'text-red-500' : 'text-blue-500'
            }
          >
            {movement_type}
          </p>
        ),
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Created by',
        dataIndex: 'user',
        key: 'user',
        render: (user) => <p>{user?.name.split(' ')[0]}</p>,
      },
      {
        title: 'Date',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (created_at) => (
          <p>
            {created_at?.replace(/T|Z/g, (match: any) => (match === 'T' ? ' ' : '')).replace(/\.\d{3}$/, '') ||
              'No Date'}
          </p>
        ),
        sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      },
      {
        title: 'Remark',
        dataIndex: 'remarks',
        key: 'remarks',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button
            onClick={() => showDeleteConfirmModal(record.id)}
            danger
            size="small"
            icon={<FaTrash />}
            type="default"
          ></Button>
        ),
      },
    ],
    []
  );

  const showDeleteConfirmModal = (id: number) => {
    setDeleteModalOpen(true);
    setStockMovementId(id);
  };

  // Filter out hidden columns
  const filteredColumns = useMemo(() => columns.filter((column) => !column.hidden), [columns]);
  if (isDeletePending) {
    return <Spin />;
  }

  if (isError) {
    return <ErrorLoadingData message={error instanceof Error ? error.message : 'Unknown error'} />;
  }

  return (
    <>
      <ModalConfirm
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        iconType="warning"
        handleAction={handleDelete}
        actionArgs={[stockMovementId]}
      ></ModalConfirm>
      <div>
        <StockMovementFilter onFilterChange={handleFilterChange} setSearch={setSearch} />
        <Table
          loading={isLoading}
          rowKey="id"
          columns={filteredColumns}
          dataSource={stockMovementData?.data}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: stockMovementData?.meta?.totalElements,
          }}
          onChange={handleTableChange}
          scroll={{ x: 600 }}
        />
      </div>
    </>
  );
};

export default React.memo(StockMovementTable);
