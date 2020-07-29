import Link from 'next/link'
import Head from 'next/head'
import { Fragment } from 'react'
import { Flex, Box, Text, Link as RELink } from 'rebass/styled-components'
import styled, { createGlobalStyle } from 'styled-components'
import { MarkGithub } from '@styled-icons/octicons/MarkGithub'

const GlobalStyle = createGlobalStyle`
 body, * {
   margin: 0;
   box-sizing: border-box;
 }

  a {
    color: initial;
    text-decoration: initial;
  }

`

const Wrap = styled.div``
const Layout: React.SFC<{
  title?: string
}> = ({ children, title = '' }) => {
  return (
    <Fragment>
      <Head>
        <title>{`svg-drawing ${title}`}</title>
      </Head>
      <GlobalStyle />
      <Box bg="#fafafa" p="5px">
        <Flex justifyContent="space-between">
          <Box width={3 / 10}>
            <Text
              fontSize={3}
              as="h1"
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              svg-drawing
            </Text>
          </Box>
          <Flex as="nav" alignContent="center" width={6 / 10}>
            <Link href="/drawing">
              <a>
                <Text mr={2}>drawing</Text>
              </a>
            </Link>
            <Text mr={2}>
              <Link href="/animation">
                <a>animation</a>
              </Link>
            </Text>
            <Text mr={2}>
              <Link href="/img-trace">
                <a>img-trace</a>
              </Link>
            </Text>
          </Flex>
          <Box width={1 / 10} style={{ textAlign: 'right' }}>
            <RELink color="#000" href="https://github.com/kmkzt/svg-drawing">
              <MarkGithub size="24" />
            </RELink>
          </Box>
        </Flex>
      </Box>
      <Wrap>{children}</Wrap>
    </Fragment>
  )
}

export default Layout
