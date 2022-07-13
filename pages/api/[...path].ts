import httpProxy from 'http-proxy'
const API_URL = process.env.NEXT_PUBLIC_API // The actual URL of your API
const proxy = httpProxy.createProxyServer()
// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = (request: any, response: any) => {
  if (process.env.NODE_ENV === 'production') {
    proxy.web(request, response, { target: API_URL, changeOrigin: true })
  }
}

export default handler
