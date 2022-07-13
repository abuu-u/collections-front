import { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'

export const config = {
  api: {
    externalResolver: true,
  },
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
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
