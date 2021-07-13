/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { readFileSync } = require('fs');
const webpack = require('webpack');

module.exports = {
    webpack: (config, { dev, vendor }) => {
        config.resolve.extensions.push('.ts');
        config.resolve.extensions.push('.tsx');

        if (dev) {
            config.devtool = 'inline-source-map';
        } else {
            config.optimization = {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {
                            format: {
                                comments: false,
                            },
                        },
                    }),
                ],
            };
        }

        config.entry = generateWebpackEntry();

        config.module.rules.push({
            test: /\.tsx?$/,
            use: [
                'ts-loader',
                {
                    loader: require.resolve('webpack-preprocessor-loader'),
                    options: {
                        debug: dev,
                        directives: {
                            blink_only: vendor !== 'firefox',
                            firefox_only: vendor === 'firefox',
                        },
                    },
                },
            ],
            exclude: [/node_modules/],
        });

        config.plugins.push(
            new webpack.DefinePlugin({
                __VENDOR__: JSON.stringify(vendor),
            })
        );

        config.plugins.find((p) => p.constructor.name === 'WebextensionPlugin').autoreload = false;

        // Important: return the modified config
        return config;
    },
    copyIgnore: ['**/*.js', '**/*.json', '**/*.ts', '**/*.tsx'],
};

function generateWebpackEntry() {
    const entryPoints = getEntryPoints();

    const regex = new RegExp(`^${resolve('app')}/(.*).tsx?$`);

    return Object.fromEntries(
        entryPoints.map((entryPoint) => {
            console.assert(regex.test(entryPoint));

            const outputFile = entryPoint.replace(regex, '$1');
            return [outputFile, entryPoint];
        })
    );
}

function getEntryPoints() {
    const entryPoints = [];
    entryPoints.push(resolve('app/src/background.ts'));
    entryPoints.push(...getContentScriptPathsFromManifest());
    entryPoints.push(...getEntryPointsFromJson());
    return entryPoints;
}

function getContentScriptPathsFromManifest() {
    const manifest = JSON.parse(readFileSync('app/manifest.json', { encoding: 'utf-8' }));
    const jsFiles = [];
    for (const contentScript of manifest.content_scripts) {
        if (contentScript.js) {
            jsFiles.push(...contentScript.js);
        }
    }
    return jsFiles.map((f) => resolve('app', f).replace(/.js$/, '.ts'));
}

function getEntryPointsFromJson() {
    const entryPoints = JSON.parse(readFileSync('entry-points.json', { encoding: 'utf-8' }));
    return entryPoints.map((f) => resolve('app', f));
}
