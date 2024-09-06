import { useProduct } from '@/hooks/useProduct';
import { Button, DatePicker, DatePickerProps, Form, FormProps, Input, InputNumber, Select, Tooltip } from 'antd';
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa6';

type Props = {
  onFilterChange: (filterType: string, values: any) => void;
  setSearch: (value: string) => void;
};

const StockMovementFilter = ({ setSearch, onFilterChange }: Props) => {
  const [dateString, setDateString] = useState<string | string[]>([]);
  const [form] = Form.useForm();

  const { useGetAllProducts } = useProduct();
  const { data: productData, isLoading: isProductLoading } = useGetAllProducts();

  const onFinish: FormProps<any>['onFinish'] = (values) => {
    onFilterChange('name', values.product);
    onFilterChange('date', dateString);
    onFilterChange('movementType', values.movementType);
    onFilterChange('search', values.search);
  };

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDateString(dateString);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setSearch((e.target as HTMLInputElement).value);
  };

  return (
    <div className="no-scrollbar mb-2 overflow-x-scroll">
      <Form name="basic" className="flex items-center gap-5" form={form} onFinish={onFinish} autoComplete="off">
        <Form.Item noStyle className="" name="product">
          <Select
            loading={isProductLoading}
            size="middle"
            style={{ width: '100%' }}
            placeholder="Select name"
            className="w-full"
            showSearch
            allowClear
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={productData?.data.map((product: any) => {
              return { label: product.name, value: product.name };
            })}
          ></Select>
        </Form.Item>
        <Form.Item noStyle className="" name="movementType">
          <Select
            size="middle"
            style={{ width: '100%' }}
            placeholder="Movement"
            className="w-full max-w-[10rem]"
            showSearch
            allowClear
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={[
              { label: 'IN', value: 'IN' },
              { label: 'OUT', value: 'OUT' },
              { label: 'TRANSFER', value: 'TRANSFER' },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item noStyle className="" name="date">
          <DatePicker className="w-full max-w-[10rem]" onChange={onDateChange} />
        </Form.Item>
        <Form.Item noStyle className="" name="search">
          <InputNumber controls={false} type="text" className="w-full max-w-[8rem]" placeholder="Search by ID" />
        </Form.Item>
        <Form.Item noStyle>
          <Button className="" icon={<FaFilter />} type="primary" htmlType="submit">
            Filter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StockMovementFilter;
