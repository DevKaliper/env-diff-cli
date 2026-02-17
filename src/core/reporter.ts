import pc from 'picocolors'
import type { DiffResult, AuditResult, ReporterOptions } from '../types.js'

export function reportDiff(
  result: DiffResult,
  options: ReporterOptions = { format: 'text' }
): string {
  switch (options.format) {
    case 'json':
      return reportDiffJson(result)
    case 'markdown':
      return reportDiffMarkdown(result, options)
    default:
      return reportDiffText(result, options)
  }
}

function reportDiffText(result: DiffResult, options: ReporterOptions): string {
  const { colorEnabled = false, maskValues = false } = options
  const lines: string[] = []

  const color = colorEnabled
    ? { green: pc.green, red: pc.red, yellow: pc.yellow, dim: pc.dim }
    : {
        green: (s: string) => s,
        red: (s: string) => s,
        yellow: (s: string) => s,
        dim: (s: string) => s,
      }

  if (result.added.length > 0) {
    lines.push(color.green('Added:'))
    for (const key of result.added) {
      lines.push(color.green(`  + ${key}`))
    }
    lines.push('')
  }

  if (result.removed.length > 0) {
    lines.push(color.red('Removed:'))
    for (const key of result.removed) {
      lines.push(color.red(`  - ${key}`))
    }
    lines.push('')
  }

  if (result.changed.length > 0) {
    lines.push(color.yellow('Changed:'))
    for (const { key, from, to } of result.changed) {
      const fromVal = maskValues ? '***' : (from ?? '')
      const toVal = maskValues ? '***' : (to ?? '')
      lines.push(color.yellow(`  ~ ${key}: ${color.dim(fromVal)} → ${toVal}`))
    }
    lines.push('')
  }

  if (result.unchanged.length > 0) {
    lines.push(color.dim(`Unchanged: ${result.unchanged.length} variables`))
  }

  return lines.join('\n')
}

function reportDiffJson(result: DiffResult): string {
  return JSON.stringify(result, null, 2)
}

function reportDiffMarkdown(result: DiffResult, options: ReporterOptions): string {
  const { maskValues = false } = options
  const lines: string[] = []

  lines.push('# Environment Diff Report\n')

  if (result.added.length > 0) {
    lines.push('## Added\n')
    for (const key of result.added) {
      lines.push(`- **${key}**`)
    }
    lines.push('')
  }

  if (result.removed.length > 0) {
    lines.push('## Removed\n')
    for (const key of result.removed) {
      lines.push(`- ~~${key}~~`)
    }
    lines.push('')
  }

  if (result.changed.length > 0) {
    lines.push('## Changed\n')
    lines.push('| Variable | From | To |')
    lines.push('|----------|------|-----|')
    for (const { key, from, to } of result.changed) {
      const fromVal = maskValues ? '`***`' : `\`${from ?? ''}\``
      const toVal = maskValues ? '`***`' : `\`${to ?? ''}\``
      lines.push(`| **${key}** | ${fromVal} | ${toVal} |`)
    }
    lines.push('')
  }

  if (result.unchanged.length > 0) {
    lines.push(`_Unchanged: ${result.unchanged.length} variables_\n`)
  }

  return lines.join('\n')
}

export function reportAudit(
  results: AuditResult[],
  options: ReporterOptions = { format: 'text' }
): string {
  switch (options.format) {
    case 'json':
      return reportAuditJson(results)
    case 'markdown':
      return reportAuditMarkdown(results, options)
    default:
      return reportAuditText(results, options)
  }
}

function reportAuditText(results: AuditResult[], options: ReporterOptions): string {
  const { colorEnabled = false, maskValues = false } = options
  const lines: string[] = []

  const color = colorEnabled
    ? { red: pc.red, yellow: pc.yellow, bold: pc.bold }
    : { red: (s: string) => s, yellow: (s: string) => s, bold: (s: string) => s }

  if (results.length === 0) {
    lines.push(color.bold('No issues found'))
    return lines.join('\n')
  }

  lines.push(color.bold(`Found ${results.length} issue(s):\n`))

  for (const result of results) {
    const severityColor = result.severity === 'error' ? color.red : color.yellow
    const value = maskValues ? '***' : result.value
    lines.push(severityColor(`[${result.severity.toUpperCase()}] ${result.rule}`))
    lines.push(severityColor(`  Variable: ${result.key}`))
    if (value) {
      lines.push(severityColor(`  Value: ${value}`))
    }
    lines.push('')
  }

  return lines.join('\n')
}

function reportAuditJson(results: AuditResult[]): string {
  return JSON.stringify(results, null, 2)
}

function reportAuditMarkdown(results: AuditResult[], options: ReporterOptions): string {
  const { maskValues = false } = options
  const lines: string[] = []

  lines.push('# Environment Audit Report\n')

  if (results.length === 0) {
    lines.push('**No issues found**\n')
    return lines.join('\n')
  }

  lines.push(`Found **${results.length}** issue(s):\n`)
  lines.push('| Severity | Rule | Variable | Value |')
  lines.push('|----------|------|----------|-------|')

  for (const result of results) {
    const severity = result.severity === 'error' ? '🔴 ERROR' : '⚠️  WARN'
    const value = maskValues ? '`***`' : `\`${result.value}\``
    lines.push(`| ${severity} | ${result.rule} | **${result.key}** | ${value} |`)
  }

  return lines.join('\n')
}

export function warn(message: string) {
  console.warn(pc.yellow(`Warning: ${message}`))
}

export function error(message: string) {
  console.error(pc.red(`Error: ${message}`))
}
