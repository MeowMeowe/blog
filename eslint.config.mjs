import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
    ...nextVitals,
    ...nextTypeScript,
    prettier,
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@next/next/no-img-element': 'off',
            'react-hooks/set-state-in-effect': 'off'
        }
    },
    globalIgnores(['.next/**', 'node_modules/**', 'dist/**', 'coverage/**', 'eslint/**', 'next-env.d.ts'])
]);
