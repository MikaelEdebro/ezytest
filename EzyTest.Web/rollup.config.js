import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import string from 'rollup-plugin-string';

export default {
    entry: 'ui/app/entry.js',
    dest: 'ui/bundle/scripts.bundle.js',
    format: 'iife',
    sourceMap: 'inline',
    plugins: [
        string({
            // Required to be specified
            include: '**/*.html',

            // Undefined by default
            exclude: ['**/index.html']
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        commonjs(),
        eslint({
            exclude: ['src/styles/**']
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        (process.env.NODE_ENV === 'production' && uglify())
    ]
}