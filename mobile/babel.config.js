// eslint-disable-next-line unicorn/prefer-module
module.exports = function babelConfig(api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: ["inline-dotenv"],
	};
};
