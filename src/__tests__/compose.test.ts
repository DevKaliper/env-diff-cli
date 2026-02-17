import { describe, it, expect } from 'vitest'
import { parseDockerCompose } from '../parsers/compose.js'
import { resolve } from 'path'

const fixturesDir = resolve(__dirname, 'fixtures')

describe('compose parser', () => {
  it('should parse docker-compose.yml with environment arrays', async () => {
    const result = await parseDockerCompose(resolve(fixturesDir, 'docker-compose.yml'))

    expect(result['web__PORT']).toBe('80')
    expect(result['web__HOST']).toBe('localhost')
    expect(result['worker__QUEUE_URL']).toBe('redis://localhost:6379')
    expect(result['worker__WORKERS']).toBe('4')
  })

  it('should parse docker-compose.yml with environment objects', async () => {
    const result = await parseDockerCompose(resolve(fixturesDir, 'docker-compose.yml'))

    expect(result['api__NODE_ENV']).toBe('production')
    expect(result['api__API_KEY']).toBe('api-key-123')
    expect(result['api__DATABASE_URL']).toBe('postgresql://localhost:5432/db')
  })

  it('should return empty object for missing file', async () => {
    const result = await parseDockerCompose(resolve(fixturesDir, 'nonexistent.yml'))

    expect(result).toEqual({})
  })

  it('should prefix keys with service name', async () => {
    const result = await parseDockerCompose(resolve(fixturesDir, 'docker-compose.yml'))

    const keys = Object.keys(result)
    expect(keys.every((key) => key.includes('__'))).toBe(true)
  })
})
