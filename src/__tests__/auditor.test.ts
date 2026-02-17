import { describe, it, expect } from 'vitest'
import { audit, auditMissing } from '../core/auditor.js'
import type { EnvMap } from '../types.js'

describe('auditor', () => {
  describe('audit', () => {
    it('should detect weak default values', () => {
      const envMap: EnvMap = {
        API_KEY: 'password',
        SECRET: 'changeme',
      }

      const results = audit(envMap)

      expect(results.length).toBeGreaterThan(0)
      expect(results.some((r) => r.rule === 'WEAK_DEFAULT')).toBe(true)
    })

    it('should detect empty secrets', () => {
      const envMap: EnvMap = {
        API_KEY: '',
        SECRET_TOKEN: '   ',
        PASSWORD: '',
      }

      const results = audit(envMap)

      const emptySecrets = results.filter((r) => r.rule === 'EMPTY_SECRET')
      expect(emptySecrets.length).toBeGreaterThan(0)
    })

    it('should detect plaintext secrets', () => {
      const envMap: EnvMap = {
        PASSWORD: 'password',
        SECRET_KEY: 'secret',
      }

      const results = audit(envMap)

      const plainSecrets = results.filter((r) => r.rule === 'SECRET_IN_PLAIN')
      expect(plainSecrets.length).toBeGreaterThan(0)
      expect(plainSecrets.every((r) => r.severity === 'error')).toBe(true)
    })

    it('should detect localhost in production', () => {
      const envMap: EnvMap = {
        PRODUCTION_URL: 'http://localhost:3000',
        PROD_DATABASE: 'postgresql://127.0.0.1:5432/db',
      }

      const results = audit(envMap)

      const localhostIssues = results.filter((r) => r.rule === 'LOCALHOST_IN_PROD')
      expect(localhostIssues.length).toBeGreaterThan(0)
      expect(localhostIssues.every((r) => r.severity === 'warn')).toBe(true)
    })

    it('should filter by severity', () => {
      const envMap: EnvMap = {
        PASSWORD: 'password', // error
        PRODUCTION_URL: 'http://localhost:3000', // warn
      }

      const results = audit(envMap, 'error')

      expect(results.every((r) => r.severity === 'error')).toBe(true)
    })

    it('should sort results by severity then key', () => {
      const envMap: EnvMap = {
        Z_PASSWORD: 'password', // error
        A_PROD_URL: 'http://localhost:3000', // warn
        B_API_KEY: '', // error
      }

      const results = audit(envMap)

      // Errors should come first
      expect(results[0].severity).toBe('error')
      expect(results[1].severity).toBe('error')
      expect(results[results.length - 1].severity).toBe('warn')
    })
  })

  describe('auditMissing', () => {
    it('should detect missing variables', () => {
      const target: EnvMap = { KEY1: 'value1' }
      const baseline: EnvMap = { KEY1: 'value1', KEY2: 'value2', KEY3: 'value3' }

      const results = auditMissing(target, baseline)

      expect(results.length).toBe(2)
      expect(results.every((r) => r.rule === 'MISSING_REQUIRED')).toBe(true)
      expect(results.every((r) => r.severity === 'error')).toBe(true)
      expect(results.map((r) => r.key)).toEqual(['KEY2', 'KEY3'])
    })

    it('should return empty array when all variables are present', () => {
      const target: EnvMap = { KEY1: 'value1', KEY2: 'value2' }
      const baseline: EnvMap = { KEY1: 'value1', KEY2: 'value2' }

      const results = auditMissing(target, baseline)

      expect(results).toEqual([])
    })
  })
})
