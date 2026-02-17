import { readFile } from 'fs/promises'
import type { EnvMap } from '../types.js'
import { ParseError } from '../types.js'

interface VercelConfig {
  env?: Record<string, string | string[]>
  build?: {
    env?: Record<string, string | string[]>
  }
}

export async function parseVercel(filePath: string): Promise<EnvMap> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const config = JSON.parse(content) as VercelConfig

    const envMap: EnvMap = {}

    // Parse top-level env
    if (config.env) {
      for (const [key, value] of Object.entries(config.env)) {
        envMap[key] = Array.isArray(value) ? value[0] : value
      }
    }

    // Parse build env
    if (config.build?.env) {
      for (const [key, value] of Object.entries(config.build.env)) {
        const envKey = `BUILD__${key}`
        envMap[envKey] = Array.isArray(value) ? value[0] : value
      }
    }

    return envMap
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {}
    }
    if (error instanceof SyntaxError) {
      throw new ParseError(`Failed to parse Vercel config: ${filePath}`)
    }
    throw error
  }
}
