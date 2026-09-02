/*
 * Find and launch the machine's own Chrome for the scripts that need a real
 * renderer. `puppeteer-core` is used rather than `puppeteer` so nothing
 * downloads a second browser — the point of measuring in Chrome is to see
 * what a visitor sees, and the installed one is that.
 *
 * Override the binary with CHROME=/path/to/chrome when it lives elsewhere.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const CANDIDATES = [
  // macOS
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  // Windows
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  join(process.env.LOCALAPPDATA ?? '', 'Google/Chrome/Application/chrome.exe'),
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  // Linux
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

export function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const hit = CANDIDATES.find((p) => p && existsSync(p));
  if (!hit) {
    throw new Error(
      'No Chrome or Edge found. Install one, or point CHROME=/path/to/binary at it.',
    );
  }
  return hit;
}

/** Launch headless Chrome through puppeteer-core. Caller closes it. */
export async function launch() {
  const { default: puppeteer } = await import('puppeteer-core');
  return puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ['--hide-scrollbars', '--force-device-scale-factor=1', '--disable-gpu'],
  });
}
