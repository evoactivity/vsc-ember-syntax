/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check
'use strict';

/** @type {string} */
const buildName = process.env.npm_lifecycle_event;

// @ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path');

const nodeClientConfig = /** @type WebpackConfig */ {
  context: path.join(__dirname),
  mode: 'none',
  target: 'node',
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'out'),
    libraryTarget: 'commonjs',
  },
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'], // support ts-files and js-files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  externals: {
    vscode: 'commonjs vscode', // ignored because it doesn't exist
  },
  performance: {
    hints: false,
  },
  // devtool: 'source-map',
};

const browserClientConfig = /** @type WebpackConfig */ {
  context: path.join(__dirname),
  mode: 'none',
  target: 'webworker', // web extensions run in a webworker context
  entry: {
    worker: './src/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'out'),
    libraryTarget: 'commonjs',
  },
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'], // support ts-files and js-files
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  externals: {
    vscode: 'commonjs vscode', // ignored because it doesn't exist
  },
  performance: {
    hints: false,
  },
  // devtool: 'source-map',
};

const bundles = [
  { name: 'web:package', config: browserClientConfig },
  { name: 'node:package', config: nodeClientConfig },
];

module.exports = bundles.filter(({ name }) => name.startsWith(buildName)).map((e) => e.config);
