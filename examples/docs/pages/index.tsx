import { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'
import { markdownToHtml } from '../lib/markdownToHtml'
// @ts-ignore
import readme from '!!raw-loader!../../../README.md'
import styled from 'styled-components'

const MarkdownWrap = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 24px 0 8px;
  }

  pre {
    margin: 8px 0;
  }

  code {
    background: #ccc;
  }
  code.hljs {
    background: #272822;
    padding: 12px 16px;
  }

  table {
    border-collapse: collapse;
  }

  th {
    background: #999;
  }
  td {
    background: #eee;
  }

  th,
  td {
    border: 1px solid #fff;
    padding: 4px 8px;
  }

  a:link {
    color: #16f;
  }
`
interface Props {
  content: any
}
const Top: NextPage<Props> = ({ content }) => {
  return (
    <Layout>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/monokai.min.css"
        />
      </Head>
      <MarkdownWrap>
        <div
          // className={markdownStyles['markdown']}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </MarkdownWrap>
    </Layout>
  )
}

// Top.getInitialProps() {
//   const content = await markdownToHtml(readme)
//   return {
//     content
//   }
// }

export async function getStaticProps() {
  const content = await markdownToHtml(readme)

  return {
    props: {
      content,
    },
  }
}
// }

export default Top
