module.exports = {
      root: true,
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended'
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      settings: {
        react: {
          version: 'detect'
        }
      },
      plugins: ['react-refresh'],
      rules: {
        'react-refresh/only-export-components': 'warn',
        'no-unused-vars': 'warn',
        'react/prop-types': 'off'
      }
    };
