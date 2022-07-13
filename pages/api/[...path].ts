import axios, { AxiosRequestHeaders } from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.url === '/api/images') {
    const { data } = await axios.post(
      'http://152.67.78.133/collections/images',
      request,
      {
        responseType: 'stream',
        headers: {
          ...(request.headers as AxiosRequestHeaders),
          'Content-Type': request.headers['content-type']!,
        },
      },
    )
    data.pipe(response)
  } else {
    return httpProxyMiddleware(request, response, {
      target: 'http://152.67.78.133/collections',
      pathRewrite: [
        {
          patternStr: '^/api',
          replaceStr: '',
        },
      ],
    })
  }
}
