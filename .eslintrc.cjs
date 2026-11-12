module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: ['airbnb', 'airbnb/hooks', 'plugin:react/jsx-runtime'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { 'import/resolver': { node: { extensions: ['.js', '.jsx'] } } },
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs', 'vite.config.js', 'cypress.config.cjs', 'storybook-static'],
  overrides: [
    {
      files: ['src/**/*.test.{js,jsx}', 'src/tests/**', 'src/stories/**', 'cypress/**'],
      rules: { 'import/no-extraneous-dependencies': 'off', 'no-undef': 'off' },
    },
  ],
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
    'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never' }],
    'import/prefer-default-export': 'off',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    'react/require-default-props': ['error', { functions: 'defaultArguments' }],
  },
};
