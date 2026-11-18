module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: [],
  // PDB2Vector is a self-contained static app with its own style
  ignorePatterns: ['static/pdb2vector/'],
  // add your custom rules here
  rules: {},
}
