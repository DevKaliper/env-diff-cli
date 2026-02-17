import { parseDotEnv } from '../parsers/dotenv.js'
import { audit } from '../core/auditor.js'
import { reportAudit } from '../core/reporter.js'
import type { AuditOptions, ReporterOptions } from '../types.js'

export async function auditCommand(envFile: string, options: AuditOptions): Promise<void> {
  try {
    const envMap = await parseDotEnv(envFile)
    const auditResults = audit(envMap, options.severity)

    const reporterOptions: ReporterOptions = {
      format: 'text',
      colorEnabled: process.stdout.isTTY,
    }

    const output = reportAudit(auditResults, reporterOptions)
    console.log(output)

    if (auditResults.length > 0) {
      const errorCount = auditResults.filter((r) => r.severity === 'error').length
      if (errorCount > 0) {
        process.exit(1)
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred during audit')
  }
}
