import { cp, mkdir, rm } from 'node:fs/promises'

await rm('dist', { recursive: true, force: true })
await mkdir('dist', { recursive: true })
await cp('index.html', 'dist/index.html')
await cp('src', 'dist/src', { recursive: true })
await mkdir('dist/_experiments/idea-card', { recursive: true })
await cp('index.html', 'dist/_experiments/idea-card/index.html')
await mkdir('dist/_experiments/idea-card-2', { recursive: true })
await cp('_experiments/idea-card-2', 'dist/_experiments/idea-card-2', { recursive: true })
