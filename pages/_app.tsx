import { CacheProvider, EmotionCache } from '@emotion/react'
import { Experimental_CssVarsProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import createEmotionCache from '../shared/lib/create-emotion-cache'
import { store } from '../shared/lib/store'
import enMessages from '../shared/localization/en.json'
import { locales } from '../shared/localization/locales'
import ruMessages from '../shared/localization/ru.json'
import topics from '../shared/localization/topics.json'

// eslint-disable-next-line no-console
console.log(topics)

const messages = {
  [locales.EN]: enMessages,
  [locales.RU]: ruMessages,
}

const clientSideEmotionCache = createEmotionCache()

interface MyAppProperties extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp(properties: MyAppProperties) {
  const { locale, defaultLocale } = useRouter()

  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = properties
  return (
    <Provider store={store}>
      <IntlProvider
        locale={locale!}
        defaultLocale={defaultLocale}
        messages={messages[locale!]}
      >
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <Experimental_CssVarsProvider defaultMode="system">
            <CssBaseline />
            <Component {...pageProps} />
          </Experimental_CssVarsProvider>
        </CacheProvider>
      </IntlProvider>
    </Provider>
  )
}

export default MyApp
