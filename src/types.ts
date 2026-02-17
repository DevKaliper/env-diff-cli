export type EnvMap = Record<string, string | undefined>

export interface DiffResult {
  added: string[]
  removed: string[]
  changed: Array<{ key: string; from: string | undefined; to: string | undefined }>
  unchanged: string[]
}

export interface AuditResult {
  key: string
  value: string
  rule: string
  severity: 'warn' | 'error'
}

export interface ReporterOptions {
  format: 'text' | 'json' | 'markdown'
  maskValues?: boolean
  colorEnabled?: boolean
}

export interface CheckOptions {
  baseline?: string
  onlyMissing?: boolean
}

export interface AuditOptions {
  severity?: 'warn' | 'error'
}

export interface DiffOptions {
  format?: 'text' | 'json' | 'markdown'
  onlyMissing?: boolean
  onlyChanged?: boolean
  noValues?: boolean
}

export class EnvDiffError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvDiffError'
  }
}

export class ParseError extends EnvDiffError {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

export class FileNotFoundError extends EnvDiffError {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`)
    this.name = 'FileNotFoundError'
  }
}
