import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const docsRoot = path.resolve('docs/vi')
const hanCharacters = /[\u3400-\u9fff]/
const violations = []

async function requireFile(file) {
  try {
    await access(file)
  } catch {
    violations.push(`missing localized asset: ${file}`)
  }
}

async function markdownFiles(directory, relative = '') {
  const entries = await readdir(path.join(directory, relative), { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(relative, entry.name)
    if (entry.isDirectory()) {
      files.push(...await markdownFiles(directory, entryPath))
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(entryPath)
    }
  }

  return files
}

for (const relativeFile of await markdownFiles(docsRoot)) {
  const lines = (await readFile(path.join(docsRoot, relativeFile), 'utf8')).split('\n')
  let inFence = false

  for (const [index, line] of lines.entries()) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }

    if (!inFence) continue

    if (hanCharacters.test(line)) {
      violations.push(`${path.join('docs/vi', relativeFile)}:${index + 1}`)
    }
  }
}

const interviewMirror = await readFile(path.join(docsRoot, 'coding-interview.md'), 'utf8')
await requireFile(path.join(docsRoot, 'images/odd-even.svg'))
if (!interviewMirror.includes('./images/odd-even.svg')) {
  violations.push('docs/vi/coding-interview.md must reference the Vietnamese odd-even asset')
}

if (violations.length > 0) {
  console.error('Han characters remain in Vietnamese mirrors:')
  for (const violation of violations) console.error(`- ${violation}`)
  process.exit(1)
}

console.log('Validated Vietnamese mirrors contain no Han characters.')
