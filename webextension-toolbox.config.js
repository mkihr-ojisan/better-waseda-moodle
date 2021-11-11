/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    webpack: (config, { dev }) => {
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
            use: ['ts-loader'],
            exclude: [/node_modules/],
        });

        config.plugins.push(new Dotenv());

        config.plugins.find((p) => p.constructor.name === 'WebextensionPlugin').autoreload = false;

        // Important: return the modified config
        return config;
    },
    copyIgnore: ['**/*.js', '**/*.json', '**/*.ts', '**/*.tsx'],
};

function generateWebpackEntry() {
    const entryPoints = [
        'app/src/background.ts',
        'app/src/auto-login/auto-login-page.tsx',
        'app/src/course-overview/content-script.tsx',
        'app/src/others/syllabus-link-fix/content-script.ts',
        'app/src/options-page/options.tsx',
        'app/src/quiz/remind-unanswered-questions/content-script.tsx',
        'app/src/others/check-session/content-script.tsx',
        'app/src/others/check-notes-on-submitting/content-script.ts',
        'app/src/browser-action-popup/popup.tsx',
        'app/src/common/todo-list/add-todo-item-page/add-todo-item-page.tsx',
        'app/src/others/maintenance-info/content-script.tsx',
    ].map((f) => resolve(f));

    const regex = new RegExp(`^${resolve('app')}/(.*).tsx?$`);

    return Object.fromEntries(
        entryPoints.map((entryPoint) => {
            console.assert(regex.test(entryPoint));

            const outputFile = entryPoint.replace(regex, '$1');
            return [outputFile, entryPoint];
        })
    );
}
