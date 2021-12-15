import rehypeHighlight from 'rehype-highlight'
import { unified } from 'unified'
import remarkRehype from 'remark-rehype'

export async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkRehype)
    .use(rehypeHighlight)
    .process(markdown)

  return result.toString()
}
