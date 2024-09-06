import Stats from '@/components/Stats';
import ProductTableDashboard from '@/components/tables/ProductTableDashboard';
import React from 'react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen space-y-7">
      <Stats />
      <div>
        <ProductTableDashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
