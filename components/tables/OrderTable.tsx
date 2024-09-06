'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Typography, Modal, Spin, Table, Divider } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FaReceipt } from 'react-icons/fa6';
import { useOrder } from '@/hooks/useOrder';
import OrderDetail from '../OrderDetail';
import { formatPrice } from '@/lib/utils';
// import OrderFilter from '../filters/OrderFilter';
// import OrderDetail from '../details/OrderDetail';

const { Title } = Typography;

const OrderTable: React.FC = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const { useGetAllOrders, useDeleteOrder } = useOrder();

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<any>({
    order_code: '',
    payment_status: '',
    date: null,
  });

  const {
    data: orderData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllOrders(pagination.current as number, pagination.pageSize as number, filters, search, true);
  const { mutateAsync: mutateDeleteOrder, isPending: isDeletePending } = useDeleteOrder();
  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setPagination(pagination);
  }, []);

  const handleFilterChange = useCallback((filterType: string, values: any) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [filterType]: values,
    }));
  }, []);

  const handleViewOrderDetail = useCallback((id: string) => {
    setIsOrderDetailModalOpen(true);
    setOrderId(id);
  }, []);

  useEffect(() => {
    refetch();
  }, [filters, pagination, refetch, search]);

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: 'Order Code',
        dataIndex: 'order_code',
        key: 'order_code',
      },
      {
        title: 'Order Amount',
        dataIndex: 'order_amount',
        key: 'order_amount',
        render: (order_amount) => <span>{formatPrice(order_amount)}</span>,
      },
      {
        title: 'Payment Status',
        dataIndex: 'payment_status',
        key: 'payment_status',
        render: (payment_status) => (
          <Badge
            status={payment_status === 'paid' ? 'success' : 'warning'}
            text={payment_status === 'paid' ? 'Paid' : 'Pending'}
          />
        ),
      },
      {
        title: 'Shipping Phone',
        dataIndex: 'shipping_phone',
        key: 'shipping_phone',
      },
      {
        title: 'Shipping Amount',
        dataIndex: 'shipping_amount',
        key: 'shipping_amount',
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
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button onClick={() => handleViewOrderDetail(record.id)} size="small" icon={<FaReceipt />} type="default">
            View Details
          </Button>
        ),
      },
    ],
    [handleViewOrderDetail]
  );

  const handleCloseModal = () => {
    setIsOrderDetailModalOpen(false);
  };

  const filteredColumns = useMemo(() => columns.filter((column) => !column.hidden), [columns]);

  if (isDeletePending) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-white/70">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading orders: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  return (
    <>
      <Modal open={isOrderDetailModalOpen} onCancel={handleCloseModal} footer={null} maskClosable={false}>
        <OrderDetail handleCloseModal={handleCloseModal} id={orderId} />
      </Modal>
      <div>
        {/* <OrderFilter onFilterChange={handleFilterChange} setSearch={setSearch} /> */}
        <Table
          loading={isLoading}
          rowKey="id"
          columns={filteredColumns}
          dataSource={orderData?.data}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: orderData?.meta?.totalElements,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  );
};

export default React.memo(OrderTable);
