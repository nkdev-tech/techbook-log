const getBody = <T>(c: Response | Request): Promise<T> => {
  const contentType = c.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return c.json();
  }

  if (contentType && contentType.includes('application/pdf')) {
    return c.blob() as Promise<T>;
  }

  return c.text() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
  const url = new URL(contextUrl);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  return new URL(`${baseUrl}${url.pathname}${url.search}`).toString();
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const request = new Request(getUrl(url), { ...options, credentials: 'include' });
  let response: Response;
  try {
    response = await fetch(request);
  } catch {
    throw new Error('サーバーに接続できませんでした')
  }
  const data = await getBody<T>(response);

  if (!response.ok) {
    const errData = data as { error?: { message?: string } };
    throw {
      status: response.status,
      message: errData?.error?.message ?? 'サーバーエラーが発生しました'
    };
  }

  return { status: response.status, data } as T;
};
