import { build } from 'rolldown';
import { spawnSync } from 'node:child_process';
await build({input:'scripts/game.test.ts',platform:'node',output:{file:'node_modules/.tmp/game-test.mjs',format:'esm'}});
const result=spawnSync(process.execPath,['node_modules/.tmp/game-test.mjs'],{stdio:'inherit'});
process.exitCode=result.status??1;
if(process.exitCode===0)process.exitCode=spawnSync(process.execPath,['scripts/api.test.mjs'],{stdio:'inherit'}).status??1;
