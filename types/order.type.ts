export type OrderType = {
  id: string;
  order_code: string;
  order_amount: string;
  payment_amount: null;
  payment_status: string;
  shipping_fee: null;
  shipping_amount: string;
  shipping_village: null;
  shipping_district: null;
  shipping_province: null;
  shipping_phone: string;
  shipping_name: null;
  gift_rule: null;
  supplier_id: null;
  created_at: Date;
  updated_at: Date;
  user_id: null;
  orderdetails: Orderdetail[];
};

export interface Orderdetail {
  id: number;
  order_id: string;
  product_id: number;
  quantity: number;
  price: string;
  total_price: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderTableFilterType {
  name?: string;
  date?: Date | null;
  status?: string;
}
