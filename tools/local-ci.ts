import { execSync, spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { testShards } from './test/shards.js';
import { getMatchingShards } from './test-shards.js';

const isTTY = process.stdout.isTTY ?? false;
const CLEAR_LINE = '\x1b[2K';
const MOVE_UP = (n: number): string => `\x1b[${n}A`;
const WAITING = '⏳';
const SPINNER_FRAMES = [
  '⠋',
  '⠙',
  '⠹',
  '⠸',
  '⠼',
  '⠴',
  '⠦',
  '⠧',
  '⠇',
  '⠏',
] as const;

function groupConsecutiveNumbers(numbers: number[]): string[] {
  if (numbers.length === 0) {
    return [];
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = sorted[i];
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges;
}

interface CheckResult {
  name: string;
  success: boolean;
  duration: number;
  output: string;
}

interface CoverageInfo {
  file: string;
  percentage: number;
  uncoveredLines: string[];
}

const FIX_CHECKS = [
  { name: 'eslint-fix', cmd: 'pnpm', args: ['eslint-fix'] },
  { name: 'prettier-fix', cmd: 'pnpm', args: ['prettier-fix'] },
];

const FIXABLE_CHECKS = [
  { name: 'eslint', cmd: 'pnpm', args: ['eslint'] },
  { name: 'prettier', cmd: 'pnpm', args: ['prettier'] },
];

const OTHER_CHECKS = [
  { name: 'ls-lint', cmd: 'pnpm', args: ['ls-lint'] },
  { name: 'git-check', cmd: 'pnpm', args: ['git-check'] },
  { name: 'markdown-lint', cmd: 'pnpm', args: ['markdown-lint'] },
  { name: 'doc-fence-check', cmd: 'pnpm', args: ['doc-fence-check'] },
  { name: 'test-schema', cmd: 'pnpm', args: ['test-schema'] },
  { name: 'type-check', cmd: 'pnpm', args: ['type-check'] },
];

function parseCliArgs(): {
  noTests: boolean;
  noFix: boolean;
  allTests: boolean;
  verbose: boolean;
  base: string;
} {
  const { values } = parseArgs({
    options: {
      'no-tests': { type: 'boolean', default: false },
      'no-fix': { type: 'boolean', default: false },
      'all-tests': { type: 'boolean', default: false },
      verbose: { type: 'boolean', short: 'v', default: false },
      base: { type: 'string', default: 'main' },
    },
  });

  return {
    noTests: values['no-tests'] ?? false,
    noFix: values['no-fix'] ?? false,
    allTests: values['all-tests'] ?? false,
    verbose: values.verbose ?? false,
    base: values.base ?? 'main',
  };
}

function getChangedFiles(base: string): string[] {
  const files = new Set<string>();

  function addFromGitCommand(cmd: string): void {
    try {
      const output = execSync(cmd, { encoding: 'utf8' });
      for (const f of output.trim().split('\n')) {
        if (f) {
          files.add(f);
        }
      }
    } catch {
      // ignore
    }
  }

  // Committed changes vs base branch (with fallback for when on main)
  addFromGitCommand(`git diff --name-only ${base}...HEAD`);
  if (files.size === 0) {
    addFromGitCommand(`git diff --name-only ${base}`);
  }

  // Uncommitted changes (staged + unstaged in one command)
  addFromGitCommand('git diff --name-only HEAD');

  return Array.from(files);
}

function runCommand(
  cmd: string,
  args: string[],
  env?: Record<string, string>,
): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...env },
    });

    let output = '';
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });
    proc.stderr.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ success: code === 0, output });
    });

    proc.on('error', (err) => {
      resolve({ success: false, output: err.message });
    });
  });
}

function formatDuration(seconds: number): string {
  const secs = Math.round(seconds);
  if (secs < 60) {
    return `${secs}s`;
  }
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  return `${mins}m ${remSecs}s`;
}

const CHECK_NAME_WIDTH = 36;

function formatCheckLine(
  name: string,
  success: boolean,
  duration: number,
): string {
  const nameCol = `${name} `.padEnd(CHECK_NAME_WIDTH, '.');
  const status = success ? '✓' : '✗';
  return `  ${nameCol} ${status}  ${formatDuration(duration)}`;
}

function formatRunningLine(name: string, spinner: string): string {
  const nameCol = `${name} `.padEnd(CHECK_NAME_WIDTH, '.');
  return `  ${nameCol} ${spinner}`;
}

function formatWaitingLine(name: string): string {
  const nameCol = `${name} `.padEnd(CHECK_NAME_WIDTH, '.');
  return `  ${nameCol} ${WAITING}`;
}

function parseCoverageJson(
  coverageDir: string,
  changedFiles: string[],
): CoverageInfo[] {
  const coverageFile = resolve(coverageDir, 'coverage-final.json');
  if (!existsSync(coverageFile)) {
    return [];
  }

  try {
    const coverage = JSON.parse(readFileSync(coverageFile, 'utf8')) as Record<
      string,
      {
        statementMap: Record<
          string,
          { start: { line: number }; end: { line: number } }
        >;
        s: Record<string, number>;
      }
    >;

    const results: CoverageInfo[] = [];

    for (const changedFile of changedFiles) {
      if (!changedFile.endsWith('.ts') || changedFile.endsWith('.spec.ts')) {
        continue;
      }

      const absPath = resolve(process.cwd(), changedFile);
      const coverageEntry = coverage[absPath];

      if (!coverageEntry) {
        continue;
      }

      const { statementMap, s: statementCoverage } = coverageEntry;
      const totalStatements = Object.keys(statementMap).length;
      if (totalStatements === 0) {
        continue;
      }

      const coveredStatements = Object.values(statementCoverage).filter(
        (count) => count > 0,
      ).length;
      const percentage = (coveredStatements / totalStatements) * 100;

      const uncoveredLineSet = new Set<number>();
      for (const [stmtId, count] of Object.entries(statementCoverage)) {
        if (count === 0) {
          const stmt = statementMap[stmtId];
          if (stmt) {
            for (let line = stmt.start.line; line <= stmt.end.line; line++) {
              uncoveredLineSet.add(line);
            }
          }
        }
      }

      results.push({
        file: changedFile,
        percentage,
        uncoveredLines: groupConsecutiveNumbers(Array.from(uncoveredLineSet)),
      });
    }

    return results;
  } catch {
    return [];
  }
}

interface ParallelCheck {
  name: string;
  cmd: string;
  args: string[];
  shard?: string;
}

interface CheckResultWithCoverage {
  result: CheckResult;
  coverage?: CoverageInfo[];
}

async function runParallelChecksWithTests(
  checks: ParallelCheck[],
  changedFiles: string[],
  globalStartTime: number,
  totalLines: number,
): Promise<CheckResultWithCoverage[]> {
  const results: (CheckResultWithCoverage | null)[] = checks.map(() => null);
  const displayLines = totalLines + 3; // checks + blank line + "Total:" + "Checks:" header

  if (!isTTY) {
    const allResults = await Promise.all(
      checks.map(async (check) => {
        const start = Date.now();
        const env = check.shard ? { TEST_SHARD: check.shard } : undefined;
        const { success, output } = await runCommand(
          check.cmd,
          check.args,
          env,
        );
        const duration = (Date.now() - start) / 1000;

        const result: CheckResult = {
          name: check.name,
          success,
          duration,
          output,
        };
        const coverage = check.shard
          ? parseCoverageJson(`./coverage/shard/${check.shard}`, changedFiles)
          : undefined;

        console.log(
          formatCheckLine(result.name, result.success, result.duration),
        );
        return { result, coverage };
      }),
    );
    return allResults;
  }

  let spinnerFrame = 0;
  let allDone = false;

  const promises = checks.map(async (check, idx) => {
    const start = Date.now();
    const env = check.shard ? { TEST_SHARD: check.shard } : undefined;
    const { success, output } = await runCommand(check.cmd, check.args, env);
    const duration = (Date.now() - start) / 1000;

    const result: CheckResult = { name: check.name, success, duration, output };
    const coverage = check.shard
      ? parseCoverageJson(`./coverage/shard/${check.shard}`, changedFiles)
      : undefined;

    results[idx] = { result, coverage };
    return { result, coverage };
  });

  const spinnerInterval = setInterval(() => {
    if (allDone) {
      return;
    }

    spinnerFrame = (spinnerFrame + 1) % SPINNER_FRAMES.length;
    const spinner = SPINNER_FRAMES[spinnerFrame];
    const elapsed = Math.round((Date.now() - globalStartTime) / 1000);

    process.stdout.write(MOVE_UP(displayLines));

    for (let i = 0; i < checks.length; i++) {
      process.stdout.write(CLEAR_LINE);
      const entry = results[i];
      if (entry) {
        console.log(
          formatCheckLine(
            entry.result.name,
            entry.result.success,
            entry.result.duration,
          ),
        );
      } else {
        console.log(formatRunningLine(checks[i].name, spinner));
      }
    }

    process.stdout.write(CLEAR_LINE);
    console.log('');
    process.stdout.write(CLEAR_LINE);
    console.log(`Total: ${elapsed}s`);
  }, 80);

  await Promise.all(promises);
  allDone = true;
  clearInterval(spinnerInterval);

  process.stdout.write(MOVE_UP(displayLines));
  for (const entry of results) {
    process.stdout.write(CLEAR_LINE);
    console.log(
      formatCheckLine(
        entry!.result.name,
        entry!.result.success,
        entry!.result.duration,
      ),
    );
  }
  process.stdout.write(CLEAR_LINE);
  console.log('');
  process.stdout.write(CLEAR_LINE);

  return results as CheckResultWithCoverage[];
}

function isRelevantTestLine(line: string): boolean {
  if (line.includes('❯') || line.includes('FAIL') || line.includes('×')) {
    return true;
  }

  if (
    line.includes('Test Files') ||
    line.includes('Tests') ||
    line.includes('Start at') ||
    line.includes('Duration') ||
    line.includes('⎯') ||
    line.includes('Error') ||
    line.includes('expected') ||
    line.includes('Received') ||
    line.includes('Expected')
  ) {
    return true;
  }

  return false;
}

function filterTestOutput(output: string): string {
  const lines = output.split('\n');
  const filtered: string[] = [];
  let capturing = false;

  for (const line of lines) {
    // Skip passing test lines
    if (line.includes('✓') && !line.includes('failed')) {
      capturing = false;
      continue;
    }

    if (isRelevantTestLine(line)) {
      capturing = true;
    }

    if (capturing || line.trim() === '') {
      filtered.push(line);
    }
  }

  return filtered.join('\n').trim();
}

async function main(): Promise<void> {
  const startTime = Date.now();
  const args = parseCliArgs();

  const changedFiles = getChangedFiles(args.base);

  let shardsToRun: string[] = [];
  if (!args.noTests) {
    shardsToRun = args.allTests
      ? Object.keys(testShards)
      : getMatchingShards(changedFiles);
  }

  const lintChecks: ParallelCheck[] = args.noFix
    ? [...FIXABLE_CHECKS, ...OTHER_CHECKS]
    : [...FIX_CHECKS, ...OTHER_CHECKS];

  const testChecks: ParallelCheck[] = shardsToRun.map((shard) => ({
    name: `test (${shard})`,
    cmd: 'pnpm',
    args: ['vitest'],
    shard,
  }));

  const allChecks = [...lintChecks, ...testChecks];

  console.log('Checks:');
  if (isTTY) {
    for (const check of allChecks) {
      console.log(formatWaitingLine(check.name));
    }
    console.log('');
    console.log('Total: 0s');
  }

  const resultsWithCoverage = await runParallelChecksWithTests(
    allChecks,
    changedFiles,
    startTime,
    allChecks.length,
  );

  let hasFailure = false;
  const coverageByFile = new Map<string, CoverageInfo>();

  for (const { result, coverage } of resultsWithCoverage) {
    if (coverage) {
      for (const info of coverage) {
        const existing = coverageByFile.get(info.file);
        if (!existing || info.percentage > existing.percentage) {
          coverageByFile.set(info.file, info);
        }
      }
    }
    if (!result.success) {
      hasFailure = true;
    }
  }

  const allCoverage = Array.from(coverageByFile.values());

  if (allCoverage.length > 0) {
    console.log('Coverage:');

    const minDots = 3;
    const longestPath = Math.max(...allCoverage.map((c) => c.file.length));
    const coverageWidth = Math.max(CHECK_NAME_WIDTH, longestPath + 1 + minDots);

    for (const info of allCoverage) {
      const pct = Math.round(info.percentage);
      const hasGaps = info.uncoveredLines.length > 0;
      const status = hasGaps ? '✗' : '✓';
      const nameCol = `${info.file} `.padEnd(coverageWidth, '.');
      console.log(`  ${nameCol} ${status}  ${pct}%`);

      if (hasGaps) {
        const lineRefs = info.uncoveredLines.map((l) => `L${l}`).join(', ');
        console.log(`    ${lineRefs}`);
      }
    }
  }

  for (const { result } of resultsWithCoverage) {
    if (!result.success && result.output.trim()) {
      const filteredOutput = result.name.startsWith('test (')
        ? filterTestOutput(result.output)
        : result.output;
      console.log('');
      console.log(`--- ${result.name} output ---`);
      console.log(filteredOutput);
      console.log(`--- end ${result.name} ---`);
    } else if (args.verbose && result.output.trim()) {
      console.log('');
      console.log(`--- ${result.name} output ---`);
      console.log(result.output);
      console.log(`--- end ${result.name} ---`);
    }
  }

  const totalDuration = (Date.now() - startTime) / 1000;
  console.log('');
  console.log(`Total: ${formatDuration(totalDuration)}`);

  if (hasFailure) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
