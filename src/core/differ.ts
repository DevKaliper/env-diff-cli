import type { EnvMap, DiffResult } from '../types.js'

export function diff(sourceA: EnvMap, sourceB: EnvMap): DiffResult {
  const keysA = new Set(Object.keys(sourceA))
  const keysB = new Set(Object.keys(sourceB))

  const added: string[] = []
  const removed: string[] = []
  const changed: DiffResult['changed'] = []
  const unchanged: string[] = []

  // Check keys in B that are not in A (added)
  for (const key of keysB) {
    if (!keysA.has(key)) {
      added.push(key)
    }
  }

  // Check keys in A that are not in B (removed)
  for (const key of keysA) {
    if (!keysB.has(key)) {
      removed.push(key)
    }
  }

  // Check keys in both A and B
  for (const key of keysA) {
    if (keysB.has(key)) {
      const valueA = sourceA[key]
      const valueB = sourceB[key]

      if (valueA !== valueB) {
        changed.push({ key, from: valueA, to: valueB })
      } else {
        unchanged.push(key)
      }
    }
  }

  // Sort for consistent output
  added.sort()
  removed.sort()
  changed.sort((a, b) => a.key.localeCompare(b.key))
  unchanged.sort()

  return { added, removed, changed, unchanged }
}

export function checkMissing(target: EnvMap, baseline: EnvMap): string[] {
  const baselineKeys = new Set(Object.keys(baseline))
  const targetKeys = new Set(Object.keys(target))

  const missing: string[] = []

  for (const key of baselineKeys) {
    if (!targetKeys.has(key)) {
      missing.push(key)
    }
  }

  return missing.sort()
}
