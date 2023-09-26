module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        // Enforce semicolons at the end of statements.
        semi: ["error", "always"],
            
        // Enforce single quotes for string literals.
        quotes: ["error", "single"],
        
        // Error on unused variables.
        "no-unused-vars": "error",
        
        // Warn about using console.log and similar.
        "no-console": "warn",
        
        // Prefer using const for variables that don't reassign.
        "prefer-const": "error",
        
        // Disallow trailing commas in object and array literals.
        "comma-dangle": ["error", "never"],
        
        // Enforce spacing in object literals.
        "object-curly-spacing": ["error", "always"],
        
        // Enforce spacing in array literals.
        "array-bracket-spacing": ["error", "always"],
        
        // Disallow unnecessary semicolons.
        "no-extra-semi": "error",
        
        // Disallow empty blocks.
        "no-empty": "error",
        
        // Enforce at most 2 empty lines.
        "no-multiple-empty-lines": ["error", { max: 2 }],
        
        // Error on unused variables (TypeScript-specific).
        "@typescript-eslint/no-unused-vars": "error",
        
        // Error usage of 'any' type.
        "@typescript-eslint/no-explicit-any": "warn",
        
        // Turn off linebreak style checking.
        "linebreak-style": "off",
        
        // Turn off import cycle checking.
        "import/no-cycle": "off",
        
        // Enforce a maximum line length of 100 characters.
        "max-len": ["error", { code: 100 }],
        
        // Turn off the restriction on using 'await' inside loops.
        "no-await-in-loop": "off"
    }
}
