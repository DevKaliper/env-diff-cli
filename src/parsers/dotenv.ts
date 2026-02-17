import { readFile } from 'fs/promises'
import { parse } from 'dotenv'
import type { EnvMap } from '../types.js'
import { FileNotFoundError, ParseError } from '../types.js'

export async function parseDotEnv(filePath: string): Promise<EnvMap> {
  try {
    const content = await readFile(filePath, 'utf-8')
    return parse(content)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new FileNotFoundError(filePath)
    }
    throw new ParseError(`Failed to parse .env file: ${filePath}`)
  }
}

export async function parseDotEnvExample(filePath: string): Promise<EnvMap> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const parsed = parse(content)

    // For .env.example, we want to extract variable names even if they have no value
    const lines = content.split('\n')
    const keys = new Set<string>()

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=/)
        if (match) {
          keys.add(match[1])
        }
      }
    }

    // Merge with parsed to ensure all keys are present
    const result: EnvMap = {}
    for (const key of keys) {
      result[key] = parsed[key] ?? ''
    }

    return result
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {}
    }
    throw new ParseError(`Failed to parse .env.example file: ${filePath}`)
  }
}
