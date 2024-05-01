module.exports = {
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "google.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "garrosbucket.s3.eu-west-3.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images-ext-1.discordapp.net",
        port: "",
      },
    ],
  },
};
