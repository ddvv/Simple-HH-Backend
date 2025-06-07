/** @type {import('jest').Config} */
const config = {
    verbose: true,
    rootDir: './tests',
    setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
}

module.exports = config;