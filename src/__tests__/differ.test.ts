import { describe, it, expect } from 'vitest'
import { diff, checkMissing } from '../core/differ.js'
import type { EnvMap } from '../types.js'

describe('differ', () => {
  describe('diff', () => {
    it('should detect added variables', () => {
      const sourceA: EnvMap = { KEY1: 'value1' }
      const sourceB: EnvMap = { KEY1: 'value1', KEY2: 'value2' }

      const result = diff(sourceA, sourceB)

      expect(result.added).toEqual(['KEY2'])
      expect(result.removed).toEqual([])
      expect(result.changed).toEqual([])
      expect(result.unchanged).toEqual(['KEY1'])
    })

    it('should detect removed variables', () => {
      const sourceA: EnvMap = { KEY1: 'value1', KEY2: 'value2' }
      const sourceB: EnvMap = { KEY1: 'value1' }

      const result = diff(sourceA, sourceB)

      expect(result.added).toEqual([])
      expect(result.removed).toEqual(['KEY2'])
      expect(result.changed).toEqual([])
      expect(result.unchanged).toEqual(['KEY1'])
    })

    it('should detect changed variables', () => {
      const sourceA: EnvMap = { KEY1: 'value1' }
      const sourceB: EnvMap = { KEY1: 'value2' }

      const result = diff(sourceA, sourceB)

      expect(result.added).toEqual([])
      expect(result.removed).toEqual([])
      expect(result.changed).toEqual([{ key: 'KEY1', from: 'value1', to: 'value2' }])
      expect(result.unchanged).toEqual([])
    })

    it('should detect unchanged variables', () => {
      const sourceA: EnvMap = { KEY1: 'value1', KEY2: 'value2' }
      const sourceB: EnvMap = { KEY1: 'value1', KEY2: 'value2' }

      const result = diff(sourceA, sourceB)

      expect(result.added).toEqual([])
      expect(result.removed).toEqual([])
      expect(result.changed).toEqual([])
      expect(result.unchanged).toEqual(['KEY1', 'KEY2'])
    })

    it('should handle empty sources', () => {
      const result = diff({}, {})

      expect(result.added).toEqual([])
      expect(result.removed).toEqual([])
      expect(result.changed).toEqual([])
      expect(result.unchanged).toEqual([])
    })

    it('should sort results alphabetically', () => {
      const sourceA: EnvMap = { Z_KEY: 'z', A_KEY: 'a' }
      const sourceB: EnvMap = { Z_KEY: 'changed', B_KEY: 'b' }

      const result = diff(sourceA, sourceB)

      expect(result.added).toEqual(['B_KEY'])
      expect(result.removed).toEqual(['A_KEY'])
      expect(result.changed[0].key).toBe('Z_KEY')
    })
  })

  describe('checkMissing', () => {
    it('should detect missing variables', () => {
      const target: EnvMap = { KEY1: 'value1' }
      const baseline: EnvMap = { KEY1: 'value1', KEY2: 'value2', KEY3: 'value3' }

      const missing = checkMissing(target, baseline)

      expect(missing).toEqual(['KEY2', 'KEY3'])
    })

    it('should return empty array when all variables are present', () => {
      const target: EnvMap = { KEY1: 'value1', KEY2: 'value2' }
      const baseline: EnvMap = { KEY1: 'value1', KEY2: 'value2' }

      const missing = checkMissing(target, baseline)

      expect(missing).toEqual([])
    })

    it('should handle empty baseline', () => {
      const target: EnvMap = { KEY1: 'value1' }
      const baseline: EnvMap = {}

      const missing = checkMissing(target, baseline)

      expect(missing).toEqual([])
    })
  })
})
