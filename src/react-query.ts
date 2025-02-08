import { QueryClient, useMutation } from '@tanstack/react-query';

// تعریف نوع داده‌ها (برای مثال فرض می‌کنیم داده‌ها از نوع any هستند؛ شما می‌توانید نوع دقیق‌تری تعیین کنید)
interface ApiResponse {
  id: number;
  name: string;
}

// تعریف نوع پارامترهای baseQueryFn
interface BaseQueryFnParams {
  queryKey: [string]; // URL که به عنوان queryKey ارسال می‌شود
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // نوع متد درخواست
  body?: any; // بدنه (body) که برای POST یا PUT ارسال می‌شود
  searchParams?: Record<string, any>; // پارامترهای جستجو که در URL قرار می‌گیرند
}

export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: {
        onError: (error) => {
          console.error("Mutation Error: ", error);
        },
      },
    },
  });


// تعریف baseQueryFn برای ارسال درخواست‌ها
export const baseQueryFn = async <T>({
  queryKey,
  method = 'POST',
  body = null,
  searchParams = {}, // برای ارسال پارامترهای جستجو در URL
}: BaseQueryFnParams): Promise<T> => {
  const login = localStorage.getItem('login');
  const accessToken = login && (JSON.parse(login)?.data?.access_token || '');

  const headers: HeadersInit = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  // ایجاد URLSearchParams برای پارامترهای جستجو
  const urlParams = new URLSearchParams(searchParams).toString();

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null, // Include body for POST, PUT, DELETE
  };

  // ارسال درخواست به URL همراه با پارامترهای جستجو در URL
  const res = await fetch(
    `http://37.32.27.143:8080/api/${queryKey[0]}${urlParams ? `?${urlParams}` : ''}`,
    config
  );

  if (!res.ok) {
    throw new Error(`Network response was not ok: ${res.statusText}`);
  }

  return res.json() as T; // تبدیل پاسخ به نوع T
};