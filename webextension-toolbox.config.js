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
const { readdir, readFile } = require("fs/promises");

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
        // よくわからないけどeagerにしないとchunkが分割される
        config.module.parser = {
            javascript: {
                dynamicImportMode: "eager",
            },
        };

        // CSS
        config.module.rules.push({
            test: /\.css$/i,
            exclude: /\.module\.css$/i,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                    },
                },
            ],
        });

        // CSS Modules
        config.module.rules.push({
            test: /\.module\.css$/i,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                    },
                },
            ],
        });

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
                "src/check-notes-on-submitting/content.ts",
                "src/fix-syllabus-link/content.ts",
                "src/auto-session-extension/content.ts",
                "src/launcher/launcher.ts",
                "src/assignment-filename/content.ts",
                "src/common/auto-login/auto-login-checkbox.ts",
                "src/word-counter/content.ts",
                "src/faster-back-and-forward/content.ts",
                "src/fix-portal-link/content.ts",
                ...(vendor === "chrome" ? ["src/common/api/moodle/qrlogin/qr-scanner.ts"] : []),
            ].map((entry) => {
                return [
                    entry.replace(/^src\//, "").replace(/\.[^.]+$/, ""),
                    [
                        "src/common/error-log.ts", // すべてのエントリーポイントでエラーログを有効にする
                        resolve(__dirname, entry),
                    ],
                ];
            })
        );

        if (!dev && !process.env.SKIP_MESSAGE_CHECK) {
            (async () => {
                const locales = await readdir(resolve(__dirname, "src", "_locales"));

                const messages = await Promise.all(
                    locales.map(async (locale) => {
                        const messages = await readFile(
                            resolve(__dirname, "src", "_locales", locale, "messages.json"),
                            "utf-8"
                        );
                        return [locale, Object.keys(JSON.parse(messages))];
                    })
                );

                const allMessages = new Set(messages.map(([, messages]) => messages).flat());

                for (const [locale, localeMessages] of messages) {
                    for (const message of allMessages) {
                        if (!localeMessages.includes(message)) {
                            throw Error(`Missing message '${message}' in locale '${locale}'`);
                        }
                    }
                }
            })();
        }

        config.target = ["web"];

        config.module.rules.push({
            test: /\.[jt]sx?$/,
            use: [
                {
                    loader: "webpack-preprocessor-loader",
                    options: {
                        params: {
                            DEV: dev,
                            VENDOR: vendor,
                        },
                    },
                },
            ],
        });

        config.plugins.push(
            new webpack.ProvidePlugin({
                errorLog: "src/common/error-log",
            })
        );

        // Important: return the modified config
        return config;
    },
    copyIgnore: ["**/*.ts", "**/*.tsx"],
};
