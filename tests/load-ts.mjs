import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const modules = new Map();
async function moduleUrl(filename) {
    const absolute = path.resolve(filename);
    if (modules.has(absolute)) return modules.get(absolute);
    const source = await readFile(absolute, 'utf8');
    let code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    const imports = [...code.matchAll(/from\s+['"]([^'"]+)['"]/g)];
    for (const match of imports) {
        const name = match[1];
        const resolved = name.startsWith('.') ? await moduleUrl(path.resolve(path.dirname(absolute), name + '.ts')) : pathToFileURL(require.resolve(name)).href;
        code = code.replace(match[0], 'from ' + JSON.stringify(resolved));
    }
    const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
    modules.set(absolute, url);
    return url;
}
export async function loadTs(filename) {
    return import(await moduleUrl(filename));
}
