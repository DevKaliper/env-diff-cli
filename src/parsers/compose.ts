import { readFile } from 'fs/promises'
import yaml from 'js-yaml'
import type { EnvMap } from '../types.js'
import { ParseError } from '../types.js'

interface DockerComposeService {
  environment?: Record<string, string | number> | string[]
}

interface DockerCompose {
  services?: Record<string, DockerComposeService>
}

export async function parseDockerCompose(filePath: string): Promise<EnvMap> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const compose = yaml.load(content) as DockerCompose

    if (!compose.services) {
      return {}
    }

    const envMap: EnvMap = {}

    for (const [serviceName, service] of Object.entries(compose.services)) {
      if (!service.environment) {
        continue
      }

      // Handle both array and object formats
      if (Array.isArray(service.environment)) {
        for (const envVar of service.environment) {
          const [key, value] = envVar.split('=')
          if (key) {
            envMap[`${serviceName}__${key}`] = value ?? ''
          }
        }
      } else {
        for (const [key, value] of Object.entries(service.environment)) {
          envMap[`${serviceName}__${key}`] = String(value)
        }
      }
    }

    return envMap
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {}
    }
    throw new ParseError(`Failed to parse Docker Compose file: ${filePath}`)
  }
}
