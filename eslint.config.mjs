import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),
  {
    rules: {
      // 'Image' is defined but never used 무시
      '@typescript-eslint/no-unused-vars': 'off',
      // console.log 같은 거 무시하고 싶으면 아래 추가
      'no-console': 'off',
      'react/jsx-key': 'error',
      // ✅ import 순서 정리 (선택)
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external', 'internal']],
          'newlines-between': 'always',
        },
      ],
    },
  },
  // 테스트 파일은 규칙 완화 (mock 함수 any 타입, display-name 등)
  {
    files: ['src/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off',
      'import/order': 'off',
      'prettier/prettier': 'off',
    },
  },
];

export default eslintConfig;
