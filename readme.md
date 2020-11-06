## Setup
### Setup the project
1.
```sh
git init
nvm install node
nvm use node
node -v > .nvmrc
npm init -y
```

### [Add Typescript](https://github.com/microsoft/TypeScript-Babel-Starter)
1. install required packages
```sh
npm i -D typescript @babel/core @babel/cli @babel/register @babel/plugin-proposal-class-properties @babel/preset-env @babel/preset-typescript @types/node
```
2. create `babel.config.js`
```js
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: ['@babel/proposal-class-properties']
};
```
3. create `./src/index.js`
```js
require('@babel/register')({ extensions: ['.js', '.ts'] });
// import all other files after the babel hook
// const app = require('./app');
```
4. add `tsconfig.json`
```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "noEmit": true,
    "moduleResolution": "node",
    "strict": true,
    "alwaysStrict": true,
    "typeRoots": [
      "./node_modules/@types"
    ],
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "resolveJsonModule": true,
    "removeComments": false,
    "skipLibCheck": true,
    "target": "esnext",
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "./src/**/*"
  ]
}
```
5. create `lib/`
```sh
mkdir ./lib
```
6. install `nodemon` for dev
```sh
npm i -D nodemon
```
7. add scripts to `package.json`
```json
{
  "scripts": {
    "dev": "DEV_ENV=true nodemon ./src/index.js",
    "start": "node ./lib/index.js",
    "type-check": "tsc --noEmit",
    "build": "babel src --out-dir lib --copy-files --extensions '.ts,.js'",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### [Eslint and Prittier](https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb)
1. install required packages
```sh
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm i -D eslint-plugin-import
npm i -D prettier eslint-config-prettier eslint-plugin-prettier
```
2. create `.eslintrc.js`
```js
module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends:  [
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
  },
  env: {
    node: true,
    jest: true
  },
  rules:  {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      'vars': 'all',
      'args': 'after-used',
      'ignoreRestSiblings': false
    }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-namespace': 'off', 
    'comma-dangle': [
      'error',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'never'
      }
    ],
    'no-bitwise': 'off'
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  settings:  {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
```
3. create `.prettierrc.js`
```js
module.exports =  {
  semi:  true,
  trailingComma:  'es5',
  singleQuote:  true,
  printWidth:  100,
  tabWidth:  2,
};
```

### [jest](https://medium.com/@miiny/unit-test-next-js-with-jest-and-enzyme-5b305a8e29fe)
1. install required packages
```sh
npm i -D jest babel-jest
npm i -D @types/jest
```
2. add scripts in `package.json`
```json
{
  "scripts": {
    "test": "tsc & jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
}
```
3. create `jest.config.js`
```js
module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
  globals: {
    NODE_ENV: 'test',
  },
  transform: {
    '^.+\\.(j|t)s$': 'babel-jest',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'jest.setup.js',
    '<rootDir>/configs/',
    'jest.config.js',
    '.json',
    '.snap',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/mocks.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/mocks.js',
  },
};
```

### [gRPC](https://medium.com/blokur/how-to-implement-a-grpc-client-and-server-in-typescript-fa3ac807855e)
1. install required packages
```sh
npm i -S @grpc/grpc-js @grpc/proto-loader
npm i -D grpc-tools grpc_tools_node_protoc_ts
```
2. create `proto/`
```sh
mkdir ./proto
```
3. create `script/build_proto.sh`
```sh
#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

PROTO_DEST=${1:-./src/proto}

mkdir -p ${PROTO_DEST}

# grpc-js
# JavaScript code generating
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:${PROTO_DEST} \
--grpc_out=grpc_js:${PROTO_DEST} \
-I ./proto \
proto/*.proto

grpc_tools_node_protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=grpc_js:${PROTO_DEST} \
-I ./proto \
proto/*.proto
```
4. add script to `package.json`
```json
"scripts": {
  "build-proto": "sh ./script/build_proto.sh"
}
```