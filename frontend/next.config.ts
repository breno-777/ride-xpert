import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   output: 'standalone',
   
  sassOptions: {
    additionalData: `$var: red;`,
    silenceDeprecations: ["legacy-js-api"],
  },

  experimental: {
    turbo: {
      rules: {
        "*.scss": {
          loaders: ["sass-loader"],
          as: "*.css",
        },
      }
    }
  }
};

export default nextConfig;
