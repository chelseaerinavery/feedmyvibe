module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        // Include the existing fallback for 'path'
        "path": require.resolve("path-browserify"),
    };
    return config;
};
