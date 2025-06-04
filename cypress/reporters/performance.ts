import { resolve } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

interface Test {
  title: string;
  state: 'passed' | 'failed' | 'pending';
  duration?: number;
  error?: Error;
}

interface Suite {
  title: string;
  tests: Test[];
  suites?: Suite[];
  file?: string;
}

interface TestResultOutput {
  results: Suite[];
  stats: {
    suites: number;
    tests: number;
    passes: number;
    failures: number;
    duration: number;
  };
  failedTests: Test[];
}

/**
 * Custom Cypress reporter for performance analysis
 */
export default class PerformanceReporter {
  private results: Suite[] = [];
  private startTime: number = Date.now();
  private stats = {
    suites: 0,
    tests: 0,
    passes: 0,
    failures: 0,
    duration: 0,
  };
  private failedTests: Test[] = [];

  constructor(runner: any) {
    this.setupEventListeners(runner);
  }

  private setupEventListeners(runner: any): void {
    runner.on('suite', () => this.stats.suites++);
    
    runner.on('pass', (test: Test) => {
      this.stats.passes++;
      this.stats.tests++;
    });

    runner.on('fail', (test: Test) => {
      this.stats.failures++;
      this.stats.tests++;
      this.failedTests.push(test);
    });

    runner.on('end', () => this.onTestsComplete());
  }

  private onTestsComplete(): void {
    this.stats.duration = Date.now() - this.startTime;

    const output: TestResultOutput = {
      results: this.results,
      stats: this.stats,
      failedTests: this.failedTests
    };

    this.saveResults(output);
  }

  private saveResults(output: TestResultOutput): void {
    const reportsDir = resolve(process.cwd(), 'cypress', 'reports');
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = resolve(reportsDir, `performance-${timestamp}.json`);

    try {
      mkdirSync(reportsDir, { recursive: true });
      writeFileSync(filePath, JSON.stringify(output, null, 2));
      console.log(`Performance report saved to: ${filePath}`);
    } catch (error) {
      console.error('Error saving performance report:', error);
    }
  }

  /**
   * Adds a test suite to the results
   */
  public addSuite(suite: Suite): void {
    this.results.push(suite);
  }
}
