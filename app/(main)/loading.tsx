'use client';

import { Spin } from 'antd';

export default function Loading() {
  return (
    <div className="flex min-h-full w-full items-center justify-center">
      <Spin size="default" />
    </div>
  );
}
