import Heading from '@/components/ui/Heading';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React from 'react';
import dynamic from 'next/dynamic';

const OrderTable = dynamic(() => import('@/components/tables/OrderTable'), { ssr: false });

const AllOrdersPage = () => {
  return (
    <div className="space-y-10">
      <Breadcrumb
        className="mb-5"
        items={[
          {
            title: <Link href="/">Dashboard</Link>,
          },
          {
            title: 'All Orders',
          },
        ]}
      />
      <Heading className="" subTitle="Manage your orders">
        Manage Orders
      </Heading>
      <OrderTable />
    </div>
  );
};

export default AllOrdersPage;
