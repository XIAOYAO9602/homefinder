module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"rules": {
		"indent": [
			1,
			"tab"
		],
		"linebreak-style": [
			1,
			"unix"
		],
		"quotes": [
			1,
			"double"
		],
		"semi": [
			1,
			"always"
		],
		"no-unused-vars": 1
	}
};
