import { cp, mkdir, rm } from 'node:fs/promises'

const outputDirectory = 'dist-idea-card-5'
const experimentDirectory = `${outputDirectory}/_experiments/idea-card-5`

await rm(outputDirectory, { recursive: true, force: true })
await mkdir(experimentDirectory, { recursive: true })
await cp('_experiments/idea-card-5', experimentDirectory, { recursive: true })
