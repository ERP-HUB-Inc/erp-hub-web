module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "modules": true,
            "experimentalObjectRestSpread": true
        },
        "allowImportExportEverywhere": true
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "object-curly-newline": ["error", {
            "ImportDeclaration": {
                "multiline": true,
                "minProperties": 2
            }
        }],
        "no-trailing-whitespace": 0,
        // "eslint-disable no-script-url": true,
        // "indent": [
        //     "error",
        //     2
        // ],
    }
};
