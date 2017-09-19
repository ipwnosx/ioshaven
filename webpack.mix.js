let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('packages/resource/project.js', 'assets/js')
   .sass('packages/resource/project.scss', 'assets/css')
   .sass('packages/resource/bootstrap.scss', 'assets/css')
