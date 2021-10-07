import { Path, Svg, createCommand } from './svg'
import { kebab2camel } from './utils'
import type { Command, CommandType } from './types'

export const parseSVGString = (svgStr: string): Svg => {
  const svgEl: SVGSVGElement | null = new DOMParser()
    .parseFromString(svgStr, 'image/svg+xml')
    .querySelector('svg')

  return svgEl ? parseSVGElement(svgEl) : new Svg({ width: 0, height: 0 })
}

export const parseSVGElement = (svgEl: SVGSVGElement): Svg => {
  const width = Number(svgEl.getAttribute('width'))
  const height = Number(svgEl.getAttribute('height'))

  const svg = new Svg({ width, height })
  svgEl.querySelectorAll('path').forEach((pEl) => {
    svg.addPath(parsePathElement(pEl))
  })

  return svg
}

export const parsePathElement = (pathEl: SVGPathElement): Path => {
  const path = new Path()
  for (let i = 0; i < pathEl.attributes.length; i += 1) {
    const attr: Attr | null = pathEl.attributes.item(i)
    if (!attr || !attr.value) continue
    if (attr.name === 'd') {
      path.addCommand(parseCommandString(attr.value))
      continue
    }

    path.updateAttributes({
      [kebab2camel(attr.name)]: attr.value,
    })
  }

  return path
}

export const parseCommandString = (d: string): Command[] => {
  const commandsTypes = 'mlsqlhvcsqaz'
  // expect ['M 0 0 ', 'M', ' 0 0 ', ...]
  const regexp = new RegExp(`([${commandsTypes}])([^${commandsTypes}]*)`, 'gi')

  return Array.from(d.matchAll(regexp) || []).reduce(
    (acc: Command<any>[], match: RegExpMatchArray, i) => {
      const values: number[] =
        match[2]
          ?.split(/[\,\s]/)
          ?.reduce(
            (acc: number[], str) => (str === '' ? acc : [...acc, +str]),
            []
          ) || []
      return [...acc, createCommand(match[1] as CommandType, values)]
    },
    []
  )
}
