import type { EnvMap, AuditResult } from '../types.js'

interface AuditRule {
  id: string
  severity: 'warn' | 'error'
  match: (key: string, value: string) => boolean
}

const rules: AuditRule[] = [
  {
    id: 'SECRET_IN_PLAIN',
    severity: 'error',
    match: (key, value) => {
      const secretKeywords = ['password', 'secret', 'token', 'key', 'api_key', 'private']
      const isSecretKey = secretKeywords.some((kw) => key.toLowerCase().includes(kw))

      if (!isSecretKey) return false

      // Check if value looks like a plaintext password (short, common words)
      const commonWeakValues = ['password', 'secret', 'admin', 'root', '123456', 'qwerty', 'abc123']
      return commonWeakValues.some((weak) => value.toLowerCase().includes(weak))
    },
  },
  {
    id: 'LOCALHOST_IN_PROD',
    severity: 'warn',
    match: (key, value) => {
      const prodKeywords = ['prod', 'production', 'live']
      const isProdKey = prodKeywords.some((kw) => key.toLowerCase().includes(kw))

      if (!isProdKey) return false

      return value.includes('localhost') || value.includes('127.0.0.1')
    },
  },
  {
    id: 'EMPTY_SECRET',
    severity: 'error',
    match: (key, value) => {
      const secretKeywords = ['password', 'secret', 'token', 'key', 'api_key', 'private']
      const isSecretKey = secretKeywords.some((kw) => key.toLowerCase().includes(kw))

      return isSecretKey && (!value || value.trim() === '')
    },
  },
  {
    id: 'WEAK_DEFAULT',
    severity: 'warn',
    match: (_key, value) => {
      const weakValues = [
        'password',
        'secret',
        'changeme',
        'example',
        'test',
        'demo',
        'default',
        '12345',
      ]
      return weakValues.includes(value.toLowerCase())
    },
  },
]

export function audit(envMap: EnvMap, minSeverity?: 'warn' | 'error'): AuditResult[] {
  const results: AuditResult[] = []

  for (const [key, value] of Object.entries(envMap)) {
    if (value === undefined) continue

    for (const rule of rules) {
      if (rule.match(key, value)) {
        results.push({
          key,
          value,
          rule: rule.id,
          severity: rule.severity,
        })
      }
    }
  }

  // Filter by severity if specified
  if (minSeverity === 'error') {
    return results.filter((r) => r.severity === 'error')
  }

  return results.sort((a, b) => {
    // Sort by severity first (error > warn), then by key
    if (a.severity !== b.severity) {
      return a.severity === 'error' ? -1 : 1
    }
    return a.key.localeCompare(b.key)
  })
}

export function auditMissing(target: EnvMap, baseline: EnvMap): AuditResult[] {
  const results: AuditResult[] = []
  const baselineKeys = new Set(Object.keys(baseline))
  const targetKeys = new Set(Object.keys(target))

  for (const key of baselineKeys) {
    if (!targetKeys.has(key)) {
      results.push({
        key,
        value: '',
        rule: 'MISSING_REQUIRED',
        severity: 'error',
      })
    }
  }

  return results.sort((a, b) => a.key.localeCompare(b.key))
}
