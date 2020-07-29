import { NextPage } from 'next'
import Layout from '../components/Layout'
import markdownToHtml from '../lib/markdownToHtml'
// @ts-ignore
import readme from '!!raw-loader!../../../README.md'

interface Props {
  content: any
}
const Top: NextPage<Props> = ({ content }) => {
  return (
    <Layout>
      <div
        // className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
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
