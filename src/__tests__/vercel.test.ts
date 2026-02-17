import { describe, it, expect } from 'vitest'
import { parseVercel } from '../parsers/vercel.js'
import { resolve } from 'path'

const fixturesDir = resolve(__dirname, 'fixtures')

describe('vercel parser', () => {
  it('should parse vercel.json with env variables', async () => {
    const result = await parseVercel(resolve(fixturesDir, 'vercel.json'))

    expect(result.API_KEY).toBe('vercel-api-key')
    expect(result.DATABASE_URL).toBe('postgresql://vercel-db:5432/db')
  })

  it('should parse build env variables with prefix', async () => {
    const result = await parseVercel(resolve(fixturesDir, 'vercel.json'))

    expect(result['BUILD__BUILD_FLAG']).toBe('production')
    expect(result['BUILD__OPTIMIZE']).toBe('true')
  })

  it('should return empty object for missing file', async () => {
    const result = await parseVercel(resolve(fixturesDir, 'nonexistent.json'))

    expect(result).toEqual({})
  })
})
