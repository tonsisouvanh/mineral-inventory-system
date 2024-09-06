import { Axios } from '@/config/axios.config';
import { SignInFieldType } from '@/types/auth.type';

export const signOutUser = async () => {
  const res = await Axios.post('/auth/sign-out');
  return res.data;
};

export const signin = async (values: SignInFieldType) => {
  const res = await Axios.post(
    '/auth/sign-in',
    { email: values.email, password: values.password },
    { withCredentials: true }
  );
  return res.data;
};

// export const fetchTagById = async (id: number) => {
//   const res = await Axios.get<ResponseTypeSingle>(`/tags/${id}`);
//   return res.data;
// };
