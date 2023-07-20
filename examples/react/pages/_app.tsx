import App from 'next/app'
import Head from 'next/head'
import { StrictMode } from 'react'
import { ThemeProvider } from 'styled-components'
import theme from '../config/theme'

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <StrictMode>
        <>
          <Head>
            <meta charSet="utf-8" />
            <meta
              key="viewport"
              name="viewport"
              content="width=device-width, initial-scale=1.0, user-scalable=no"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </>
      </StrictMode>
    )
  }
}
