import mkdirp from 'mkdirp';
import fs from 'fs';
import { basename } from 'path';

async function transform() {
  const p = require('../package.json');

  for (const key of ['main', 'module', 'unpkg', 'types']) {
    p[key] = basename(p[key]);
  }

  p.source = undefined;

  p.scripts = {};

  await mkdirp('dist');

  return JSON.stringify(p, null, 2);
}

transform().then(s => fs.createWriteStream('dist/package.json').write(s));
