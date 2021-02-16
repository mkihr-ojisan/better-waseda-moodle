const { resolve } = require('path');
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebextensionPlugin = require('webpack-webextension-plugin');

module.exports = {
    webpack: (config, { dev, vendor }) => {
    // Add typescript loader. supports .ts and .tsx files as entry points
        config.resolve.extensions.push('.ts');
        config.resolve.extensions.push('.tsx');

        config.devtool = 'inline-source-map';
        config.entry = GlobEntriesPlugin.getEntries(
            [
                resolve('app', '?(src)/background.ts'),
                resolve('app', '?(src)/?(autoLogin)/myWasedaLoginPage.ts'),
                resolve('app', '?(src)/?(autoLogin)/autoLoginPage.ts'),
                resolve('app', '?(src)/?(options)/options.ts')
            ]
        );

        config.module.rules.push({
            test: /\.tsx?$/,
            loader: 'ts-loader'
        });

        if (process.env.NODE_ENV === 'production') {
            config.optimization = {
                minimize: true,
                minimizer: [new TerserPlugin({
                    terserOptions: {
                        ecma: 6,
                        compress: {
                            //drop_console: true,
                        },
                        output: {
                            comments: false,
                            beautify: false
                        },
                        sourceMap: true,
                    }
                })]
            };
        }

        config.plugins.find(p => p instanceof WebextensionPlugin).autoreload = false;


        // Important: return the modified config
        return config;
    },
    copyIgnore: [ '**/*.js', '**/*.json', '**/*.ts', '**/*.tsx' ]
};