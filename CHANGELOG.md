# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-17

### Added

#### Core Features
- `diff` command - Compare environment variables between two sources
- `check` command - Validate environment against baseline (e.g., .env.example)
- `audit` command - Detect security issues and suspicious values

#### Parsers
- `.env` file parser with support for standard dotenv format
- `.env.example` parser that extracts variable names even without values
- Docker Compose parser that extracts environment variables from all services
- Vercel configuration parser (vercel.json)
- Railway configuration parser (railway.toml)
- Git integration - load .env files from any git reference (branches, commits)

#### Audit Rules
- `SECRET_IN_PLAIN` - Detects plaintext passwords and weak secrets (error)
- `LOCALHOST_IN_PROD` - Flags localhost/127.0.0.1 in production variables (warn)
- `EMPTY_SECRET` - Identifies secret variables with empty values (error)
- `WEAK_DEFAULT` - Catches common weak defaults like "password", "changeme" (warn)
- `MISSING_REQUIRED` - Reports variables present in baseline but missing in target (error)

#### Output Formats
- Plain text output with optional color support
- JSON output for programmatic consumption
- Markdown output for documentation and reports
- Value masking option (--no-values) for sensitive information

#### CLI Options
- `--format` - Choose output format (text, json, markdown)
- `--only-missing` - Show only added/removed variables
- `--only-changed` - Show only changed variables
- `--no-values` - Mask variable values in output
- `--baseline` - Specify custom baseline file for check command
- `--severity` - Filter audit results by severity (warn, error)

#### Integration Sources
- File paths: `./path/to/.env`
- Git references: `main:.env`, `HEAD~1:.env`
- Docker Compose: `compose:./docker-compose.yml`
- Vercel: `vercel:./vercel.json`
- Railway: `railway:./railway.toml`

#### Developer Experience
- TypeScript strict mode
- Comprehensive unit tests (31 tests across 6 test suites)
- ESLint + Prettier configuration
- Vitest for fast testing
- Full code coverage tracking
- Example fixtures for testing
- Demo script showcasing all features

#### Documentation
- Comprehensive README with usage examples
- EXAMPLES.md with real-world use cases
- CONTRIBUTING.md with development guidelines
- Inline code documentation
- MIT License

### Technical Details
- Node.js 20+ required
- TypeScript 5.3+
- ES2022 modules
- Functional programming style
- Named exports only
- No default exports
- Zero external API dependencies
- Fast execution with minimal overhead

[1.0.0]: https://github.com/DevKaliper/env-diff-cli/releases/tag/v1.0.0
