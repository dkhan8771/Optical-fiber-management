module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.node = {
                net: 'empty'
            };
        }
        return config;
    }
}