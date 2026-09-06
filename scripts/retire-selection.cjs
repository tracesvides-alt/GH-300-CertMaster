const fs=require('fs');let p=fs.readFileSync('lib/learning.ts','utf8');p="import { allocateQuestionsByDomain } from './selection';\n"+p;const a=p.indexOf('export function allocate('),b=p.indexOf('export function streak(',a);p=p.slice(0,a)+`// Compatibility export; all allocation is owned by the selection engine.
export function allocate(total:number){return allocateQuestionsByDomain(total);}
`+p.slice(b);fs.writeFileSync('lib/learning.ts',p);
p=fs.readFileSync('tests/core.test.ts','utf8').replace('allocate, selectWeak, streak','allocate, streak');const c=p.indexOf("  it('excludes recent questions"),d=p.indexOf("  it('counts local calendar",c);p=p.slice(0,c)+p.slice(d);fs.writeFileSync('tests/core.test.ts',p);
