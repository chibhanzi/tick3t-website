import { defineConfig, devices } from "@playwright/test";
import { execSync } from "child_process";

/**
 * Playwright config for Tick3t e2e tests.
 * The app runs via the dev workflow on localhost:80 (base path "/").
 * We inject mock auth via localStorage so tests never hit the /auth redirect.
 *
 * Uses the NixOS system Chromium browser so no extra browser install is needed.
 */

// Resolve the system Chromium path (installed via nix: `nix-env -iA nixpkgs.chromium`)
let systemChromium: string | undefined;
try {
  systemChromium = execSync("which chromium", { encoding: "utf8" }).trim();
} catch {
  // Fall back to Playwright's downloaded browser
}

const launchOptions = systemChromium
  ? { executablePath: systemChromium, args: ["--no-sandbox"] }
  : { args: ["--no-sandbox"] };

export default defineConfig({
  testDir: ".",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  retries: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],

  webServer: [
    {
      command: "pnpm --filter @workspace/api-server run dev",
      url: "http://localhost:8080/api/healthz",
      timeout: 60_000,
      reuseExistingServer: true,
      env: {
        PORT: "8080",
      },
    },
    {
      command: "pnpm --filter @workspace/tick3t run dev",
      port: 24122,
      timeout: 60_000,
      reuseExistingServer: true,
      env: {
        PORT: "24122",
        BASE_PATH: "/",
      },
    },
  ],

  use: {
    /* The tick3t dev server runs on port 24122; the Replit proxy exposes it on 80 */
    baseURL: "http://localhost:24122",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    /* Inject organizer session before every test */
    storageState: "./e2e/auth-state.json",
    launchOptions,
  },

  projects: [
    {
      name: "setup",
      testMatch: "**/auth.setup.ts",
      use: { launchOptions },
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions,
      },
      dependencies: ["setup"],
    },
  ],
});
