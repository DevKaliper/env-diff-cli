import { readFile } from 'fs/promises'
import type { EnvMap } from '../types.js'
import { ParseError } from '../types.js'

interface RailwayConfig {
  variables?: Record<string, string | number | boolean>
}

export async function parseRailway(filePath: string): Promise<EnvMap> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const config = parseToml(content)

    const envMap: EnvMap = {}

    if (config.variables) {
      for (const [key, value] of Object.entries(config.variables)) {
        envMap[key] = String(value)
      }
    }

    return envMap
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {}
    }
    throw new ParseError(`Failed to parse Railway config: ${filePath}`)
  }
}

// Simple TOML parser for [variables] section
function parseToml(content: string): RailwayConfig {
  const lines = content.split('\n')
  const config: RailwayConfig = {}
  let currentSection = ''

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    // Section header
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentSection = trimmed.slice(1, -1)
      if (currentSection === 'variables') {
        config.variables = {}
      }
      continue
    }

    // Key-value pair
    if (currentSection === 'variables' && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').trim()

      if (key && config.variables) {
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '')
        config.variables[key.trim()] = cleanValue
      }
    }
  }

  return config
}
