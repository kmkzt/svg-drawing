import App from 'next/app'
import { StrictMode } from 'react'
import { ThemeProvider } from 'styled-components'
import theme from '../config/theme'
export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <StrictMode>
        {/** @ts-expect-error */}
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </StrictMode>
    )
  }
}
