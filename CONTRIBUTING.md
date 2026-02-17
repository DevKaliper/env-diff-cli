# Contributing to envdiff

Thank you for considering contributing to envdiff! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/env-diff-cli.git
   cd env-diff-cli
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Project Structure

```
src/
  cli.ts           # Commander setup, command registration
  commands/
    diff.ts        # diff two env sources
    check.ts       # validate against a baseline
    audit.ts       # suspicious value detection
  parsers/
    dotenv.ts      # .env and .env.example
    compose.ts     # docker-compose.yml environment blocks
    vercel.ts      # vercel.json + .vercel/output
    railway.ts     # railway.toml
  core/
    differ.ts      # diff logic, set operations on variable maps
    auditor.ts     # suspicious value rules
    reporter.ts    # format output (text | json | markdown)
  types.ts         # shared types
  __tests__/       # unit tests
    fixtures/      # test data
```

## Code Style

- **TypeScript strict mode** - All code must pass strict type checking
- **Functional style** - Prefer pure functions over classes
- **Named exports only** - No default exports
- **Async/await** - Use async functions for all I/O operations
- **No `any` type** - Use `unknown` and narrow explicitly
- **ESLint + Prettier** - Code must pass linting and formatting checks

Run formatting and linting:
```bash
npm run format
npm run lint
```

## Adding New Features

### Adding a New Parser

To add support for a new configuration format:

1. Create a new parser in `src/parsers/yourformat.ts`
2. Implement the parser function that returns `Promise<EnvMap>`
3. Add test fixtures in `src/__tests__/fixtures/`
4. Write unit tests in `src/__tests__/yourformat.test.ts`
5. Update the `loadSource` function in `src/commands/diff.ts`
6. Update README.md and EXAMPLES.md with usage examples

Example parser structure:
```typescript
import { readFile } from 'fs/promises'
import type { EnvMap } from '../types.js'
import { ParseError } from '../types.js'

export async function parseYourFormat(filePath: string): Promise<EnvMap> {
  try {
    const content = await readFile(filePath, 'utf-8')
    // Parse content and return EnvMap
    return {}
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {}
    }
    throw new ParseError(`Failed to parse: ${filePath}`)
  }
}
```

### Adding a New Audit Rule

To add a new security audit rule:

1. Add the rule to the `rules` array in `src/core/auditor.ts`
2. Write tests in `src/__tests__/auditor.test.ts` (positive and negative cases)
3. Update README.md with the new rule description

Example rule:
```typescript
{
  id: 'YOUR_RULE_ID',
  severity: 'warn' | 'error',
  match: (key: string, value: string) => {
    // Return true if the rule should trigger
    return false
  }
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests once (no watch mode)
npm run test:run

# Run with coverage
npm run test:coverage
```

### Writing Tests

- Place tests in `src/__tests__/`
- Use descriptive test names
- Test both positive and negative cases
- Use fixtures in `src/__tests__/fixtures/` for test data
- Avoid mocking the filesystem - use real files in temp directories

Example test:
```typescript
import { describe, it, expect } from 'vitest'
import { yourFunction } from '../your-module.js'

describe('yourFunction', () => {
  it('should handle valid input', () => {
    const result = yourFunction('input')
    expect(result).toBe('expected')
  })
  
  it('should throw on invalid input', () => {
    expect(() => yourFunction('')).toThrow()
  })
})
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run format:check
   npm run test:run
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of the changes
   - Link to any related issues
   - Ensure all CI checks pass

## Commit Message Convention

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for Kubernetes ConfigMaps
fix: handle empty environment files correctly
docs: update installation instructions
test: add tests for audit rules
```

## Questions or Issues?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
