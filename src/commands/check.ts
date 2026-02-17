import { parseDotEnv, parseDotEnvExample } from '../parsers/dotenv.js'
import { checkMissing } from '../core/differ.js'
import { auditMissing } from '../core/auditor.js'
import { reportAudit } from '../core/reporter.js'
import type { CheckOptions, ReporterOptions } from '../types.js'
import { access } from 'fs/promises'

export async function checkCommand(envFile: string, options: CheckOptions): Promise<void> {
  try {
    const envMap = await parseDotEnv(envFile)

    // Determine baseline file
    let baselineFile = options.baseline
    if (!baselineFile) {
      // Try to find .env.example in the same directory
      const defaultBaseline = envFile.replace(/\.env(\.[^.]+)?$/, '.env.example')
      try {
        await access(defaultBaseline)
        baselineFile = defaultBaseline
      } catch {
        baselineFile = '.env.example'
      }
    }

    const baseline = await parseDotEnvExample(baselineFile)

    if (Object.keys(baseline).length === 0) {
      console.log('No baseline file found or baseline is empty')
      return
    }

    const missing = checkMissing(envMap, baseline)

    if (missing.length === 0) {
      console.log('All required variables are present')
      return
    }

    // Create audit results for missing variables
    const auditResults = auditMissing(envMap, baseline)

    const reporterOptions: ReporterOptions = {
      format: 'text',
      colorEnabled: process.stdout.isTTY,
    }

    const output = reportAudit(auditResults, reporterOptions)
    console.log(output)

    process.exit(1)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred during check')
  }
}
