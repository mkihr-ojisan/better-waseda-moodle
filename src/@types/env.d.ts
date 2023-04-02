export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            VENDOR: "firefox" | "chrome" | "edge" | "opera";
            NODE_ENV: "development" | "production";
        }
    }
}
