import { transform } from '@swc/core';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default {
  process(src, filename) {
    // Skip non-JS/TS files
    if (!/\.(js|jsx|ts|tsx)$/.test(filename)) {
      return { code: src };
    }

    // Transform source code
    return transform(src, {
      filename,
      jsc: {
        target: 'es2022',
        parser: {
          syntax: filename.endsWith('.ts') || filename.endsWith('.tsx') ? 'typescript' : 'ecmascript',
          tsx: filename.endsWith('.tsx'),
          jsx: filename.endsWith('.jsx'),
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
      module: {
        type: 'es6',
      },
    })
      .then(({ code }) => ({
        code: code,
      }));
  },
};