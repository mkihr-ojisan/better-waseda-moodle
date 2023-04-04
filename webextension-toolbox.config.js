/* eslint-disable */
const { resolve } = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    webpack: (config, { dev, vendor }) => {
        if (vendor !== "firefox" && vendor !== "chrome") {
            // FirefoxとChrome以外は対応したくないという意思
            throw new Error("this extension only supports firefox and chrome");
        }

        if (vendor === "chrome") {
            // Chromeの場合はwebextension-polyfillを使う

            config.plugins.push(
                new webpack.ProvidePlugin({
                    browser: require.resolve("webextension-polyfill"),
                    "browser.contentScripts.register": [
                        "src/common/polyfills/content-script-register",
                        "registerContentScript",
                    ],
                })
            );

            config.module.rules.push({
                test: /webextension-polyfill[\\/]+dist[\\/]+browser-polyfill\.js$/,
                loader: require.resolve("string-replace-loader"),
                options: {
                    search: 'typeof browser === "undefined"',
                    replace:
                        'typeof window.browser === "undefined" || Object.getPrototypeOf(window.browser) !== Object.prototype',
                },
            });
        }

        // Webpackのchunkをロードする機能が拡張機能では動作しないので、chunkを1つにまとめる
        config.plugins.push(
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1,
            })
        );

        if (dev) {
            config.devtool = "inline-source-map";
            // config.plugins.push(new ESLintPlugin({ extensions: ["ts", "tsx", "js", "jsx"] }));
        } else {
            config.optimization = {
                minimize: true,
                minimizer: [
                    new TerserPlugin(),
                    new HtmlMinimizerPlugin(),
                    new JsonMinimizerPlugin(),
                    new CssMinimizerPlugin(),
                    new ImageMinimizerPlugin({
                        minimizer: {
                            implementation: ImageMinimizerPlugin.imageminMinify,
                            options: {
                                plugins: [
                                    ["optipng", { optimizationLevel: 7 }],
                                    ["svgo", { plugins: [{ name: "preset-default" }] }],
                                ],
                            },
                        },
                    }),
                ],
                ...config.optimization,
            };
        }

        config.entry = Object.fromEntries(
            [
                "src/background.ts",
                "src/content.ts",
                "src/common/auto-login/auto-login-page.ts",
                "src/block-xhr-requests/content.ts",
                "src/block-xhr-requests/inject.js",
                "src/check-notes-on-submitting/content.ts",
                "src/fix-syllabus-link/content.ts",
                "src/fix-syllabus-link/inject.js",
                "src/popup/popup.tsx",
                "src/auto-session-extension/content.ts",
                "src/launcher/launcher.ts",
                "src/assignment-filename/content.ts",
                "src/assignment-filename/inject.ts",
                "src/common/auto-login/auto-login-checkbox.ts",
            ].map((entry) => {
                return [entry.replace(/^src\//, "").replace(/\.[^.]+$/, ""), resolve(__dirname, entry)];
            })
        );

        config.target = ["web"];

        // Important: return the modified config
        return config;
    },
};
