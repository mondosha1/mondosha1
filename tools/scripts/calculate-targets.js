// tslint:disable
// eslint:disable
const exec = require('child_process').exec

const targetsArg = process.argv[2]
const chunkSizeArg = process.argv[3]
const headRef = process.argv[4]
const baseRef = process.argv[5]
const nxArgs = headRef !== baseRef ? ` --head=origin/${headRef} --base=origin/${baseRef}` : '--all'

;(async function main() {
  const targets = targetsArg.split(',')

  const chunkSize = chunkSizeArg.split(',').map(Number)
  if (chunkSize.length > 1 && chunkSize.length !== targets.length) {
    console.error(
      `Expected ${targets.length === 1 ? '1' : `1 or ${targets.length}`} chunk sizes, given ${chunkSize.length}.`
    )
    process.exit(1)
  }

  const tasksPerTarget = targets.map((target, i) =>
    getTasksPerTarget(target, chunkSize.length > 1 ? chunkSize[i] : chunkSize[0], nxArgs)
  )
  const allTasks = await Promise.all(tasksPerTarget)
  console.log(JSON.stringify({ tasks: allTasks.flat() }))
})()

async function getTasksPerTarget(target, chunkSize, nxArgs) {
  const printAffectedCmd = (await execAsync(
    `node --max-old-space-size=8000 ./node_modules/@nrwl/cli/bin/nx.js print-affected --target=${target} --select=tasks.target.project ${nxArgs}`
  )).trim('\n')

  return printAffectedCmd
    ? printAffectedCmd
        .split(',')
        .map(task => task.trim())
        .filter(task => task !== '')
        .reduce((res, task, i, tasks) => [...res, ...(i % chunkSize ? [] : [tasks.slice(i, i + chunkSize)])], [])
        .reduce((res, tasksChunk) => [...res, `${target}:${tasksChunk}`], [])
    : []
}

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout ? stdout : stderr)
      }
    })
  })
}
