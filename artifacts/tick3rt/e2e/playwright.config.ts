import { defineConfig, devices } from "@playwright/test";
import { execSync } from "child_process";

/**
 * Playwright config for Tick3rt e2e tests.
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

  use: {
    /* The tick3rt dev server is proxied to port 80 */
    baseURL: "http://localhost:80",
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
