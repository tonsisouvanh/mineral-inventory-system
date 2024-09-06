import React, { useEffect } from 'react';
import { useOrder } from '@/hooks/useOrder';
import { Descriptions, Divider, Spin, Typography } from 'antd';
import { formatPrice } from '@/lib/utils';

const { Title } = Typography;

interface OrderDetailProps {
  id: string | null;
  handleCloseModal: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ id, handleCloseModal }) => {
  const { useGetOrder } = useOrder();
  const { data, isLoading, isError, refetch } = useGetOrder(id as string);
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading order details</div>;
  }

  if (!data) {
    return <div>No order details available</div>;
  }

  const { order, orderDetails } = data.data;
  return (
    <div>
      <Title level={4}>Order Details</Title>
      <Divider />
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Order Code">{order.order_code}</Descriptions.Item>
        <Descriptions.Item label="Order Amount">{formatPrice(parseInt(order.order_amount))}</Descriptions.Item>
        <Descriptions.Item label="Payment Status">{order.payment_status}</Descriptions.Item>
        <Descriptions.Item label="Shipping Phone">{order.shipping_phone}</Descriptions.Item>
        <Descriptions.Item label="Shipping Amount">{order.shipping_amount}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Title level={5}>Order Items</Title>
      <Descriptions bordered column={1}>
        {orderDetails?.map((detail: any, index: number) => (
          <Descriptions.Item key={index} label={detail.name}>
            <div>
              <p>Product ID: {detail.product_id}</p>
              <p>Quantity: {detail.quantity}</p>
              <p>Price: {detail.price}</p>
              <p>Total: {detail.total_price}</p>
            </div>
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  );
};

export default OrderDetail;
