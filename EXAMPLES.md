# envdiff Examples

## Basic Comparisons

### Compare two local environment files
```bash
envdiff diff .env.development .env.production
```

### Compare with masked values
```bash
envdiff diff .env.development .env.production --no-values
```

### Show only differences (no unchanged variables)
```bash
envdiff diff .env.development .env.production --only-changed
```

### Show only added/removed variables
```bash
envdiff diff .env.development .env.production --only-missing
```

## Git Integration

### Compare current .env with main branch
```bash
envdiff diff main:.env .env
```

### Compare between two branches
```bash
envdiff diff main:.env develop:.env
```

### Compare with a specific commit
```bash
envdiff diff HEAD~3:.env.production .env.production
```

## Integration Sources

### Compare local .env with Docker Compose
```bash
envdiff diff .env compose:./docker-compose.yml
```

### Compare Vercel and Railway configurations
```bash
envdiff diff vercel:./vercel.json railway:./railway.toml
```

### Compare with specific integration files
```bash
envdiff diff .env compose:./docker/docker-compose.prod.yml
```

## Output Formats

### JSON output
```bash
envdiff diff .env.development .env.production --format json
```

### Markdown output (great for documentation)
```bash
envdiff diff .env.development .env.production --format markdown > env-diff.md
```

## Validation

### Check if all required variables are present
```bash
envdiff check .env.production
```

### Check against a specific baseline
```bash
envdiff check .env.production --baseline .env.required
```

### Check only for missing variables
```bash
envdiff check .env.production --only-missing
```

## Security Auditing

### Audit for security issues
```bash
envdiff audit .env.production
```

### Show only errors (no warnings)
```bash
envdiff audit .env.production --severity error
```

### Audit multiple environments
```bash
envdiff audit .env.development
envdiff audit .env.staging
envdiff audit .env.production
```

## Advanced Use Cases

### Compare production env with example and show as markdown
```bash
envdiff diff .env.example .env.production --format markdown --no-values
```

### Validate and audit in CI/CD pipeline
```bash
#!/bin/bash
# Ensure all required vars are present
envdiff check .env.production --baseline .env.example

# Check for security issues
envdiff audit .env.production --severity error

# Exit with error code if any issues found
if [ $? -ne 0 ]; then
  echo "Environment validation failed!"
  exit 1
fi
```

### Generate environment documentation
```bash
envdiff diff .env.example .env.production \\
  --format markdown \\
  --no-values \\
  > docs/environment-changes.md
```

### Monitor environment changes in git hooks
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check if .env files changed
if git diff --cached --name-only | grep -q "\.env"; then
  echo "Checking environment changes..."
  
  # Compare with main branch
  envdiff diff main:.env.production .env.production
  
  # Audit for issues
  envdiff audit .env.production
  
  # Require manual confirmation if there are errors
  read -p "Continue with commit? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi
```

### Cross-environment comparison matrix
```bash
#!/bin/bash
# Compare all environments against each other

echo "## Development vs Staging"
envdiff diff .env.development .env.staging --format markdown

echo "## Staging vs Production"
envdiff diff .env.staging .env.production --format markdown

echo "## Development vs Production"
envdiff diff .env.development .env.production --format markdown
```

## Integration with Docker

### Check if docker-compose.yml matches .env
```bash
envdiff diff .env compose:./docker-compose.yml
```

### Extract all environment variables from Docker Compose
```bash
envdiff diff compose:./docker-compose.yml compose:./docker-compose.yml --format json
```

## Vercel and Railway Deployments

### Compare local env with Vercel config
```bash
envdiff diff .env vercel:./vercel.json
```

### Sync Railway config with production
```bash
envdiff diff .env.production railway:./railway.toml
```

### Export differences for deployment
```bash
envdiff diff .env railway:./railway.toml --format json > deployment-diff.json
```
