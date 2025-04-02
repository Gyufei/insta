export async function Fetcher<T = unknown>(
  input: URL | RequestInfo,
  init?: RequestInit | undefined
): Promise<T> {
  try {
    const result = await fetch(input, init);
    const res = await parsedRes(result);

    return res;
  } catch (e: unknown) {
    console.log(e);
    throw e;
  }
}

async function parsedRes(res: Response) {
  try {
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.') as Error & {
        status?: number;
      };
      

      if (res.status === 401) {
        error.message = 'Unauthorized';
      }

      if (!error.message) {
        const resBody = await res.text();
        console.log(resBody);
        const errorTip = resBody.length > 100 ? 'Failed: An error occurred' : resBody;
        error.message = errorTip;
      }

      error.status = res.status;

      throw error;
    }

    const json = await res.json();

    if (json.code === 500) {
      throw new Error('Internal server error');
    }

    return json?.data || json;
  } catch (e) {
    throw e;
  }
}
