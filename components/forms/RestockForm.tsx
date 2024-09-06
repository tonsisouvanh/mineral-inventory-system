'use client';
import { useProduct } from '@/hooks/useProduct';
import { Button, DatePicker, Form, FormProps, InputNumber, Select, Skeleton } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';

type FieldType = {
  movement_type: string;
  quantity: number;
  remarks?: string;
  created_at?: any;
};

type Props = {
  id: number | null;
  handleCloseModal: () => void;
};

const RestockForm = ({ id, handleCloseModal }: Props) => {
  const [form] = Form.useForm();
  const [dateString, setDateString] = useState<string | string[]>([]);
  const { useRestockProduct } = useProduct();
  const { useGetProduct } = useProduct();
  const { data: productData, isLoading, isError: isGetError } = useGetProduct(id as number);
  const { mutateAsync: mutateRestockProduct, isPending, isSuccess, reset: RestockProductReset } = useRestockProduct();
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    mutateRestockProduct({
      ...values,
      created_at: values.created_at ? dayjs(values.created_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
      id: id as number,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      handleCloseModal();
      RestockProductReset();
    }
  }, [isSuccess, form, handleCloseModal, RestockProductReset]);

  if (isLoading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton.Input block style={{ width: '100%' }} active size="small" />
          <Skeleton.Input block style={{ width: '100%' }} active size="small" />
          <Skeleton.Input style={{ width: '50%' }} active size="small" />
        </div>
      </>
    );
  }

  if (isGetError) {
    return <div>Error</div>;
  }
  return (
    <div className="w-full space-y-5">
      <div>
        <h1>
          Product:
          <span className="ml-1 text-gray-500">{productData?.data.name}</span>
        </h1>
        <div className="flex items-center gap-2">
          <p>
            Current quantity:
            <span className="ml-1 text-gray-500">{productData?.data.quantity}</span>
          </p>
          <p>
            Pack:
            <span className="ml-1 text-gray-500">{productData?.data.pack}</span>
          </p>
        </div>
      </div>
      <Form
        layout="vertical"
        name="edit-tag"
        initialValues={{
          movement_type: 'IN',
          quantity: 1,
          created_at: dayjs(),
        }}
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        labelAlign="left"
        autoComplete="off"
      >
        <div className="flex w-full items-center gap-2">
          <Form.Item
            // noStyle
            labelCol={{ span: 20 }}
            className="w-full"
            layout="vertical"
            label="Stock movement"
            name="movement_type"
            rules={[{ required: true, message: 'Field required!' }]}
          >
            <Select
              size="middle"
              style={{ width: '100%' }}
              placeholder="Stock movement"
              //   onChange={handleStatusChange}
              options={[
                { label: 'IN', value: 'IN' },
                { label: 'OUT', value: 'OUT' },
                { label: 'TRANSFER', value: 'TRANSFER' },
              ]}
            />
          </Form.Item>
          <Form.Item
            // noStyle
            labelCol={{ span: 20 }}
            className="w-full"
            layout="vertical"
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Field required!' }]}
          >
            <InputNumber className="w-full" min={1} max={1000} />
          </Form.Item>
        </div>
        <Form.Item name="created_at" label="Restock Date">
          <DatePicker format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          // noStyle
          labelCol={{ span: 20 }}
          className="w-full"
          layout="vertical"
          label="Remarks"
          name="remarks"
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={isPending}
            disabled={isPending}
            icon={<FaSave />}
            type="primary"
            htmlType="submit"
            className="mt-4"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RestockForm;
