import { describe, it, expect } from 'vitest'
import { parseRailway } from '../parsers/railway.js'
import { resolve } from 'path'

const fixturesDir = resolve(__dirname, 'fixtures')

describe('railway parser', () => {
  it('should parse railway.toml with variables', async () => {
    const result = await parseRailway(resolve(fixturesDir, 'railway.toml'))

    expect(result.API_KEY).toBe('railway-api-key')
    expect(result.DATABASE_URL).toBe('postgresql://railway-db:5432/db')
    expect(result.PORT).toBe('8080')
    expect(result.NODE_ENV).toBe('production')
  })

  it('should return empty object for missing file', async () => {
    const result = await parseRailway(resolve(fixturesDir, 'nonexistent.toml'))

    expect(result).toEqual({})
  })
})
