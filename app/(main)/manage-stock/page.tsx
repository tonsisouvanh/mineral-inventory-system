import Heading from '@/components/ui/Heading';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React from 'react';
import dynamic from 'next/dynamic';

const StockTable = dynamic(() => import('@/components/tables/StockTable'), { ssr: false });

const ManageStockPage = () => {
  return (
    <div className="space-y-10">
      <Breadcrumb
        className="mb-5"
        items={[
          {
            title: <Link href="/">Dashboard</Link>,
          },
          {
            title: 'Manage stock',
          },
        ]}
      />
      <Heading className="" subTitle="Manage your stock">
        Manage Stock
      </Heading>
      <StockTable />
    </div>
  );
};

export default ManageStockPage;
