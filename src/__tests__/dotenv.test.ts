import { describe, it, expect } from 'vitest'
import { parseDotEnv, parseDotEnvExample } from '../parsers/dotenv.js'
import { resolve } from 'path'

const fixturesDir = resolve(__dirname, 'fixtures')

describe('dotenv parser', () => {
  describe('parseDotEnv', () => {
    it('should parse valid .env file', async () => {
      const result = await parseDotEnv(resolve(fixturesDir, '.env.test'))

      expect(result.API_KEY).toBe('test-api-key-12345')
      expect(result.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/db')
      expect(result.DEBUG).toBe('true')
      expect(result.NODE_ENV).toBe('development')
    })

    it('should throw FileNotFoundError for missing file', async () => {
      await expect(parseDotEnv(resolve(fixturesDir, 'nonexistent.env'))).rejects.toThrow(
        'File not found'
      )
    })
  })

  describe('parseDotEnvExample', () => {
    it('should parse .env.example file', async () => {
      const result = await parseDotEnvExample(resolve(fixturesDir, '.env.example'))

      expect(Object.keys(result)).toContain('API_KEY')
      expect(Object.keys(result)).toContain('DATABASE_URL')
      expect(Object.keys(result)).toContain('PORT')
      expect(Object.keys(result)).toContain('REDIS_URL')
    })

    it('should return empty object for missing file', async () => {
      const result = await parseDotEnvExample(resolve(fixturesDir, 'nonexistent.env.example'))

      expect(result).toEqual({})
    })
  })
})
