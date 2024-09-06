'use client';
import React, { useEffect } from 'react';
import { Layout, Button, Typography, Form, Input, Switch, FormProps, theme } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SignInFieldType } from '@/types/auth.type';
const { Title, Paragraph } = Typography;
const { Content } = Layout;

const SignInForm: React.FC = () => {
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const { useSignin } = useAuth();
  const { mutate: signinMutate, isPending, isSuccess } = useSignin();

  const onFinish: FormProps<SignInFieldType>['onFinish'] = (values) => {
    signinMutate(values);
  };

  const onChange = (checked: boolean) => {
    form.setFieldValue('remember', checked);
  };

  useEffect(() => {
    if (isSuccess) {
      router.push('/');
    }
  }, [isSuccess, router]);

  return (
    <Content
      style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Form
        name="sign_in"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className="space-y-4"
        autoComplete="off"
        form={form}
      >
        <div className="mb-8">
          <Title className="text-3xl font-extrabold">Sign in</Title>
          <Paragraph className="mt-4 text-sm leading-relaxed">Sign in to your account</Paragraph>
        </div>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input
            type="email"
            placeholder="Enter email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-color-2"
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password
            placeholder="Enter password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-color-2"
          />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <div className="flex items-center">
            <Switch defaultChecked onChange={onChange} />
            <label className="ml-3 block text-sm">Remember me</label>
          </div>
        </Form.Item>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm">
            <Link href={'#'} className="font-semibold text-color-2 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>
        <Form.Item>
          <Button
            disabled={isPending}
            loading={isPending}
            type="primary"
            htmlType="submit"
            className="w-full rounded-lg bg-color-2 px-4 py-3 text-sm tracking-wide text-white shadow-xl hover:bg-blue-700 focus:outline-none"
          >
            Log in
          </Button>
        </Form.Item>
        <Paragraph className="!mt-8 text-center text-sm">
          Do not have an account{' '}
          <Link href="#">
            <span className="ml-1 whitespace-nowrap font-semibold text-color-2 hover:underline">Register here</span>
          </Link>
        </Paragraph>
      </Form>
    </Content>
  );
};

export default SignInForm;
