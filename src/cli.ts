#!/usr/bin/env node

import { Command } from 'commander'
import { diffCommand } from './commands/diff.js'
import { checkCommand } from './commands/check.js'
import { auditCommand } from './commands/audit.js'
import { error } from './core/reporter.js'
import type { DiffOptions, CheckOptions, AuditOptions } from './types.js'

const program = new Command()

program
  .name('envdiff')
  .description('CLI tool that compares .env files across branches, environments, or commits')
  .version('1.0.0')

program
  .command('diff')
  .description('Compare two environment sources')
  .argument('<source-a>', 'First source (file path, git ref, or integration handle)')
  .argument('<source-b>', 'Second source (file path, git ref, or integration handle)')
  .option('--format <format>', 'Output format: text, json, or markdown', 'text')
  .option('--only-missing', 'Show only added/removed variables')
  .option('--only-changed', 'Show only changed variables')
  .option('--no-values', 'Mask variable values in output')
  .action(async (sourceA: string, sourceB: string, options: DiffOptions) => {
    try {
      await diffCommand(sourceA, sourceB, options)
    } catch (err) {
      error(err instanceof Error ? err.message : 'Unknown error')
      process.exit(1)
    }
  })

program
  .command('check')
  .description('Validate environment file against a baseline')
  .argument('<env-file>', 'Environment file to check')
  .option('--baseline <file>', 'Baseline file to compare against (default: .env.example)')
  .option('--only-missing', 'Show only missing variables')
  .action(async (envFile: string, options: CheckOptions) => {
    try {
      await checkCommand(envFile, options)
    } catch (err) {
      error(err instanceof Error ? err.message : 'Unknown error')
      process.exit(1)
    }
  })

program
  .command('audit')
  .description('Detect suspicious values in environment file')
  .argument('<env-file>', 'Environment file to audit')
  .option('--severity <level>', 'Filter by severity: warn or error')
  .action(async (envFile: string, options: AuditOptions) => {
    try {
      await auditCommand(envFile, options)
    } catch (err) {
      error(err instanceof Error ? err.message : 'Unknown error')
      process.exit(1)
    }
  })

program.parse()
