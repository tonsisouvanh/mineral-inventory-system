import StockMovementTable from '@/components/tables/StockMovementTable';
import Heading from '@/components/ui/Heading';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React from 'react';
const StockMovementPage = () => {
  return (
    <div className="space-y-10">
      <Breadcrumb
        className="mb-5"
        items={[
          {
            title: <Link href="/">Dashboard</Link>,
          },
          {
            title: 'Manage Stock Movement',
          },
        ]}
      />
      <Heading className="" subTitle="Stock Movement">
        Manage stock movement
      </Heading>
      <StockMovementTable />
    </div>
  );
};

export default StockMovementPage;
