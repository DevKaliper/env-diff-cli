import { execFile } from 'child_process'
import { promisify } from 'util'
import type { EnvMap } from '../types.js'
import { parseDotEnv } from '../parsers/dotenv.js'
import { parseDockerCompose } from '../parsers/compose.js'
import { parseVercel } from '../parsers/vercel.js'
import { parseRailway } from '../parsers/railway.js'
import { diff } from '../core/differ.js'
import { reportDiff, warn } from '../core/reporter.js'
import type { DiffOptions, ReporterOptions } from '../types.js'

const execFileAsync = promisify(execFile)

export async function diffCommand(
  sourceA: string,
  sourceB: string,
  options: DiffOptions
): Promise<void> {
  try {
    const envA = await loadSource(sourceA)
    const envB = await loadSource(sourceB)

    let result = diff(envA, envB)

    // Apply filters
    if (options.onlyMissing) {
      result = {
        ...result,
        changed: [],
        unchanged: [],
      }
    } else if (options.onlyChanged) {
      result = {
        ...result,
        added: [],
        removed: [],
        unchanged: [],
      }
    }

    const reporterOptions: ReporterOptions = {
      format: options.format ?? 'text',
      maskValues: options.noValues ?? false,
      colorEnabled: process.stdout.isTTY,
    }

    const output = reportDiff(result, reporterOptions)
    console.log(output)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred during diff')
  }
}

async function loadSource(source: string): Promise<EnvMap> {
  // Check for integration handles
  if (source.startsWith('compose:')) {
    const filePath = source.slice(8) || './docker-compose.yml'
    return parseDockerCompose(filePath)
  }

  if (source === 'vercel:' || source.startsWith('vercel:')) {
    const filePath = source.slice(7) || './vercel.json'
    return parseVercel(filePath)
  }

  if (source === 'railway:' || source.startsWith('railway:')) {
    const filePath = source.slice(8) || './railway.toml'
    return parseRailway(filePath)
  }

  // Check for git refs (e.g., "main:.env", "HEAD~1:.env")
  if (source.includes(':') && !source.startsWith('/') && !source.startsWith('./')) {
    return loadFromGit(source)
  }

  // Default: treat as file path
  return parseDotEnv(source)
}

async function loadFromGit(gitRef: string): Promise<EnvMap> {
  try {
    const [ref, filePath] = gitRef.split(':')
    if (!ref || !filePath) {
      throw new Error(`Invalid git reference format: ${gitRef}`)
    }

    const { stdout } = await execFileAsync('git', ['show', `${ref}:${filePath}`])

    // Parse the content directly
    const lines = stdout.split('\n')
    const envMap: EnvMap = {}

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex > 0) {
          const key = trimmed.slice(0, eqIndex)
          const value = trimmed.slice(eqIndex + 1)
          envMap[key] = value
        }
      }
    }

    return envMap
  } catch (error) {
    warn(`Failed to load from git: ${gitRef}`)
    return {}
  }
}
