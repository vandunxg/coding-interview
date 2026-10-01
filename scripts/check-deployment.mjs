import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

const base = '/coding-interview/'
const distRoot = path.resolve('docs/.vitepress/dist')
const pages = ['index.html', 'vi/index.html', 'coding-interview.html', 'vi/coding-interview.html']
const brokenUrls = []

for (const page of pages) {
  const html = await readFile(path.join(distRoot, page), 'utf8')
  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1])

  for (const url of urls) {
    if (url.startsWith('/') && !url.startsWith(base)) {
      brokenUrls.push(`${page} -> ${url}`)
    }
  }
}

try {
  await access(path.join(distRoot, 'assets'))
} catch {
  throw new Error('The build must contain an assets directory.')
}

if (brokenUrls.length > 0) {
  console.error(`Expected all local deployment URLs to use ${base}:`)
  for (const url of brokenUrls) console.error(`- ${url}`)
  process.exit(1)
}

console.log(`Validated GitHub Pages base path ${base}.`)
