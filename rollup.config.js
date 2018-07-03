/**
 * rollup config js
 */
import uglify from 'rollup-plugin-uglify'

export default [
  {
    input: './src/computed/index.js',
    output: {
      file: './lib/react-computed.js',
      format: 'umd',
      name: 'react-computed'
    }
  }, {
    input: './src/computed/index.js',
    output: {
      file: './lib/react-computed-esm.js',
      format: 'es',
      name: 'react-computed-esm'
    }
  }, {
    input: './src/computed/index.js',
    output: {
      file: './lib/react-computed-min.js',
      format: 'umd',
      name: 'react-computed'
    },
    plugins: [
      uglify({
        output: {
        }
      }),
    ],
  }
]