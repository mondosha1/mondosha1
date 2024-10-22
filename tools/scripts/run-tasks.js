// tslint:disable
// eslint:disable
const execSync = require('child_process').execSync

const tasks = process.argv[2]
const [target, projects] = tasks.split(':')

console.log(`Projects to ${target}: ${projects}.`)
const remainingArgs = process.argv
  .slice(3)
  .map(a => `"${a}"`)
  .join(' ')
execSync(
  `node --max-old-space-size=6000 ./node_modules/@nrwl/cli/bin/nx.js run-many --target=${target} --projects=${projects} --parallel ${remainingArgs}`,
  { stdio: 'inherit' }
)
