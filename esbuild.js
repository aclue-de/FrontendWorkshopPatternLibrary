const esbuild = require('esbuild');

esbuild
    .build({
        entryPoints: ['src/index.js'],
        outdir: 'dist',
        bundle: true, // default
        sourcemap: true, // for debugging
        minify: true, // false for debugging
        target: ['esnext'] // default
    })
    .catch(() => process.exit(1));
