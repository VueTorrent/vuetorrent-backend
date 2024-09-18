export function assert_env() {
  for (const key of ['CONFIG_PATH', 'QBIT_BASE']) {
    if (!process.env[key]) {
      throw new Error(`${ key } environment variable is missing`)
    }
  }
}
