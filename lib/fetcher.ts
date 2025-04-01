export async function Fetcher(input: URL | RequestInfo, init?: RequestInit | undefined) {
  try {
    const result = await fetch(input, init);
    const res = await parsedRes(result);

    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function parsedRes(res: Response) {
  try {
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.') as Error & {
        info?: string;
        status?: number;
      };

      if (res.status === 401) {
        error.info = 'Unauthorized';
      }

      if (res.status === 422) {
        error.info = 'params error, sign failed';
      }

      if (!error.info) {
        const resBody = await res.text();
        const errorTip = resBody.length > 100 ? 'Failed: An error occurred' : resBody;
        error.info = errorTip;
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
    console.log(e);
    throw e;
  }
}
