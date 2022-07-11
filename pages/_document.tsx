import createEmotionServer from '@emotion/server/create-instance'
import { getInitColorSchemeScript } from '@mui/material/styles'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import createEmotionCache from 'shared/lib/create-emotion-cache'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          {getInitColorSchemeScript()}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (context) => {
  const originalRenderPage = context.renderPage

  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  context.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(properties) {
          return <App emotionCache={cache} {...properties} />
        },
    })

  const initialProperties = await Document.getInitialProps(context)
  const emotionStyles = extractCriticalToChunks(initialProperties.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProperties,
    emotionStyleTags,
  }
}
