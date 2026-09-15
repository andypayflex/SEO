import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'site-config.js', 'robots.txt', 'public']) {
  await cp(file, `dist/${file}`, { recursive: true });
}
console.log('Built static website in dist/. Update the placeholder contact email and robots.txt before launch.');
