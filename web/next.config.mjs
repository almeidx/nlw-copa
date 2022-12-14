/* eslint-disable tsdoc/syntax */

/** @type {import('next').NextConfig} */
export default {
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		fallbackNodePolyfills: false,
	},
	reactStrictMode: true,
	swcMinify: true,
};
