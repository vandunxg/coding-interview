import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const docsRoot = path.resolve('docs')
const translationRoot = path.join(docsRoot, 'vi')

async function markdownFiles(directory, relative = '') {
  const entries = await readdir(path.join(directory, relative), {
    withFileTypes: true,
  })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(relative, entry.name)

    if (entry.isDirectory()) {
      if (entry.name !== '.vitepress' && entry.name !== 'vi') {
        files.push(...await markdownFiles(directory, entryPath))
      }
      continue
    }

    if (/\.mdx?$/.test(entry.name)) {
      files.push(entryPath)
    }
  }

  return files
}

function stripCodeFences(markdown) {
  const lines = markdown.split('\n')
  let inFence = false

  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence
        return ''
      }
      return inFence ? '' : line
    })
    .join('\n')
}

function linkTargets(markdown) {
  return [...stripCodeFences(markdown).matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)]
    .map((match) => match[1])
}

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

const sourceFiles = await markdownFiles(docsRoot)
const missingFiles = []
const brokenLinks = []

for (const sourceFile of sourceFiles) {
  const targetFile = path.join(translationRoot, sourceFile)

  try {
    const markdown = await readFile(targetFile, 'utf8')

    for (const target of linkTargets(markdown)) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target) || target.startsWith('#')) {
        continue
      }

      const targetPath = target.split(/[?#]/, 1)[0]
      const resolved = target.startsWith('/')
        ? path.join(docsRoot, targetPath)
        : path.resolve(path.dirname(targetFile), targetPath)

      if (!(await exists(resolved))) {
        brokenLinks.push(`${path.join('docs/vi', sourceFile)} -> ${target}`)
      }
    }
  } catch {
    missingFiles.push(sourceFile)
  }
}

if (missingFiles.length > 0) {
  console.error('Missing Vietnamese mirrors:')
  for (const file of missingFiles) console.error(`- docs/vi/${file}`)
  process.exit(1)
}

if (brokenLinks.length > 0) {
  console.error('Broken Vietnamese links/assets:')
  for (const link of brokenLinks) console.error(`- ${link}`)
  process.exit(1)
}

console.log(`Validated ${sourceFiles.length} Vietnamese mirrors and their relative links/assets.`)
