// eslint:disable
const exec = require('child_process').exec

const targetsArg = process.argv[2]
const chunkSizeArg = process.argv[3]
const headRef = isGitHash(process.argv[4]) ? process.argv[4] : `origin/${process.argv[4]}`
const baseRef = isGitHash(process.argv[5]) ? process.argv[5] : `origin/${process.argv[5]}`
const excludeApps = extractListParams(process.argv, 'excludeApps')
const buildLibraries = process.argv.includes('--build-libraries')
const nxArgs = headRef !== baseRef ? ` --head=${headRef} --base=${baseRef}` : '--all'

main()

async function main() {
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
}

async function getTasksPerTarget(target, chunkSize, nxArgs) {
  const printAffectedCmd = JSON.parse(
    await execAsync(
      `node --max-old-space-size=6000 ./node_modules/@nrwl/cli/bin/nx.js print-affected --target=${target} ${nxArgs}`
    )
  )

  const affectedApps = (
    await execAsync(`node --max-old-space-size=6000 ./node_modules/@nrwl/cli/bin/nx.js affected:apps --plain ${nxArgs}`)
  )
    .trim('\n')
    .split(' ')

  const sortedTasks = getSortedTasks(printAffectedCmd)

  return sortedTasks
    .filter(project => target !== 'build' || buildLibraries || affectedApps.includes(project))
    .filter(project => !excludeApps.includes(project))
    .reduce((res, task, i, tasks) => [...res, ...(i % chunkSize ? [] : [tasks.slice(i, i + chunkSize)])], [])
    .reduce((res, tasksChunk) => [...res, `${target}:${tasksChunk}`], [])
}

function getSortedTasks(printAffectedCmd) {
  if (!printAffectedCmd) {
    return []
  }

  const targetProjects = printAffectedCmd.tasks.map(task => task.target.project)

  const depsTree = Object.fromEntries(
    Object.entries(printAffectedCmd.projectGraph.dependencies)
      .filter(([key]) => !key.startsWith('npm'))
      .map(([key, deps]) => [
        key,
        deps
          .map(({ target }) => target)
          .filter(target => !target.startsWith('npm'))
          .sort()
      ])
  )

  return [...new Set(Object.entries(depsTree).flat(2))]
    .map(project => [project, getDepth(project, depsTree)])
    .filter(([project]) => targetProjects.includes(project))
    .sort(([, depthA], [, depthB]) => depthA - depthB)
    .map(([project]) => project)
}

function getDepth(project, tree, depth = []) {
  return tree[project]
    ? tree[project]
        .filter(dep => !depth.includes(dep))
        .reduce((max, dep) => Math.max(max, getDepth(dep, tree, [...depth, dep])), depth.length)
    : depth.length
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

function isGitHash(hash) {
  return /^[0-9a-f]{7,40}$/i.test(hash)
}

function extractListParams(argv, paramName) {
  const paramHeader = `--${paramName}=`
  const param = argv.find(item => item.startsWith(paramHeader))
  return param ? param.split(paramHeader)[1].split(' ')[0].split(',') : []
}
