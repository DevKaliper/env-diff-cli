# envdiff

CLI tool that compares `.env` files across branches, environments, or commits.

## Features

- **Diff**: Compare `.env` files between two sources (branches, commits, local files)
- **Check**: Detect missing variables relative to a baseline (`.env.example`)
- **Audit**: Flag suspicious values (plaintext passwords, `localhost` in production, empty secrets, weak defaults)
- **Integrations**: Parse Docker Compose, Vercel, Railway configs
- **Multiple formats**: Output as plain text, JSON, or Markdown

## Installation

### From Source

```bash
git clone https://github.com/DevKaliper/env-diff-cli.git
cd env-diff-cli
npm install
npm run build
npm link
```

### Quick Start

After installation, verify it works:

```bash
envdiff --help
```

Run the demo to see all features:

```bash
./demo.sh
```

## Usage

### Compare two environment files

```bash
envdiff diff .env.development .env.production
envdiff diff main:.env HEAD:.env
envdiff diff .env compose:./docker-compose.yml
```

### Check for missing variables

```bash
envdiff check .env.production
envdiff check .env.production --baseline .env.example
```

### Audit for suspicious values

```bash
envdiff audit .env.production
envdiff audit .env.production --severity error
```

## Commands

### `envdiff diff <source-a> <source-b>`

Compare two environment sources.

**Sources can be:**
- File paths: `./apps/api/.env.production`
- Git refs: `main:.env`, `HEAD~1:.env`
- Integration handles: `compose:./docker-compose.yml`, `vercel:`, `railway:`

**Options:**
- `--format <format>` - Output format: text, json, or markdown (default: text)
- `--only-missing` - Show only added/removed variables
- `--only-changed` - Show only changed variables
- `--no-values` - Mask variable values in output

### `envdiff check <env-file>`

Validate environment file against a baseline.

**Options:**
- `--baseline <file>` - Baseline file to compare against (default: .env.example)
- `--only-missing` - Show only missing variables

### `envdiff audit <env-file>`

Detect suspicious values in environment file.

**Options:**
- `--severity <level>` - Filter by severity: warn or error

## Audit Rules

- `SECRET_IN_PLAIN` - Password/secret matches common weak patterns
- `LOCALHOST_IN_PROD` - Production variable contains `localhost` or `127.0.0.1`
- `EMPTY_SECRET` - Secret variable is empty
- `WEAK_DEFAULT` - Value is a common weak default (`password`, `changeme`, etc.)
- `MISSING_REQUIRED` - Variable present in baseline but absent in target

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm test:coverage

# Lint
npm run lint

# Format
npm run format

# Build
npm run build
```

## Examples

```bash
# Compare production and development
envdiff diff .env.production .env.development

# Check if all required vars are set
envdiff check .env.production

# Find security issues
envdiff audit .env.production --severity error

# Compare current branch with main
envdiff diff main:.env HEAD:.env --format markdown

# Compare local file with Docker Compose
envdiff diff .env compose:./docker-compose.yml --no-values
```

## License

MIT
