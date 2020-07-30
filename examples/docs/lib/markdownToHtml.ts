import remark from 'remark'
import html from 'remark-html'
// @ts-expect-error
import highlight from 'remark-highlight.js'

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).use(highlight).process(markdown)
  return result.toString()
}
