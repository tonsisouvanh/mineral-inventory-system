import { useProduct } from '@/hooks/useProduct';
import { ProductTableFilterType, ProductType } from '@/types/product.type';
import { Button, DatePicker, DatePickerProps, Form, FormProps, Select } from 'antd';
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa6';

type Props = {
  onFilterChange: (filterType: string, values: any) => void;
  setSearch: (value: string) => void;
};

const ProductFilter = ({ setSearch, onFilterChange }: Props) => {
  const [dateString, setDateString] = useState<string | string[]>([]);
  // ======
  const [form] = Form.useForm();
  const { useGetAllProducts } = useProduct();
  const { data: products, isLoading } = useGetAllProducts();
  const onFinish: FormProps<ProductTableFilterType>['onFinish'] = (values) => {
    onFilterChange('name', values.name);
    onFilterChange('date', dateString);
    onFilterChange('status', values.status);
    // setSearch(values.search);
  };

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDateString(dateString);
  };

  // const handleCategoryChange = (value: number[]) => {
  //   onFilterChange("categories", value);
  // };

  // const handleStatusChange = (value: string[]) => {
  //   onFilterChange("status", value);
  // };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setSearch((e.target as HTMLInputElement).value);
  };

  return (
    <div className="no-scrollbar mb-2 overflow-x-scroll">
      <Form name="basic" className="flex items-center gap-5" form={form} onFinish={onFinish} autoComplete="off">
        <Form.Item noStyle className="" name="name">
          <Select
            loading={isLoading}
            size="middle"
            style={{ width: '100%' }}
            placeholder="Select name"
            className="w-full"
            showSearch
            allowClear
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={products?.data.map((product: ProductType) => {
              return { label: product.name, value: product.name };
            })}
          ></Select>
        </Form.Item>
        <Form.Item noStyle className="" name="status">
          <Select
            loading={isLoading}
            size="middle"
            style={{ width: '100%' }}
            placeholder="Select status"
            className="w-full max-w-[10rem]"
            showSearch
            allowClear
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={[
              { label: 'LOW', value: 'LOW' },
              { label: 'NORMAL', value: 'NORMAL' },
              { label: 'OUT OF STOCK', value: 'OUT_OF_STOCK' },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item noStyle className="" name="date">
          <DatePicker className="w-full max-w-[15rem]" onChange={onDateChange} />
        </Form.Item>
        {/* <Input
          suffix={<FaSearch />}
          name="search"
          allowClear
          onPressEnter={handleSearch}
          placeholder="Type category name"
          className="w-full max-w-xs"
          type="text"
        /> */}
        <Form.Item noStyle>
          <Button
            // loading={isPending}
            // disabled={isPending}
            className=""
            icon={<FaFilter />}
            type="primary"
            htmlType="submit"
          >
            Filter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductFilter;
