import Link from 'next/link'
import Head from 'next/head'
import { Fragment } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
 * {
   margin: 0;
 }
`
const Header = styled.header``
const Content = styled.div``
const Layout: React.SFC<{
  title?: string
}> = ({ children, title = '' }) => {
  return (
    <Fragment>
      <Head>
        <title>{`svg-drawing ${title}`}</title>
      </Head>
      <GlobalStyle />
      <Header>
        <h1>svg-drawing</h1>
        <nav>
          <Link href="/">
            <a>drawing</a>
          </Link>
          |
          <Link href="/img-trace">
            <a>img-trace</a>
          </Link>
          |
          <Link href="/react">
            <a>react</a>
          </Link>
          |<a href="https://github.com/kmkzt/svg-drawing">GitHub</a>
        </nav>
      </Header>
      <Content>{children}</Content>
    </Fragment>
  )
}

export default Layout
