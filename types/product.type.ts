export interface ProductType {
  id?: number;
  product_number?: number;
  name?: string;
  short_description?: string;
  long_description?: string;
  price?: string;
  sku?: null;
  images?: null;
  size?: string;
  category_id?: null;
  supplier_id?: null;
  quantity?: number;
  reorder_level?: number;
  active_at?: Date;
  pack?: number;
  type?: string;
  created_at?: Date;
  updated_at?: Date;
  category?: null;
}

export interface ProductTableFilterType {
  name?: string;
  date?: Date | null;
  status?: string;
  search?: string;
}
