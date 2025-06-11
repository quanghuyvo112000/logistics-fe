Logistics Frontend
This project is the frontend for the Logistics Management System, built with React, TypeScript, and Vite, providing a modern development environment with fast refresh, modular code structure, and strong type safety.


🛠️ Project Setup
This template offers a minimal and extensible setup for working with React and Vite. It includes:

Hot Module Replacement (HMR)

ESLint integration

TypeScript configuration for scalable development


⚙️ Plugins
Two official Vite plugins are supported:

@vitejs/plugin-react – Uses Babel for Fast Refresh

@vitejs/plugin-react-swc – Uses SWC for improved performance

You can choose either based on your performance needs and compatibility.


✅ ESLint Configuration
For production-grade applications, we recommend extending the ESLint configuration to support type-aware rules for better type safety and code quality.

ts
Copy
Edit
export default tseslint.config({
  extends: [
    // Use type-aware rules
    ...tseslint.configs.recommendedTypeChecked,
    // Optionally use stricter or stylistic rules
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})


🔍 Recommended Plugins
For improved linting tailored to React projects, consider installing the following plugins:

bash
Copy
Edit
npm install eslint-plugin-react-x eslint-plugin-react-dom --save-dev
Then update your eslint.config.js:

ts
Copy
Edit
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})


📦 Recommended Practices
Maintain separate TypeScript config files for different targets (e.g., tsconfig.app.json for application code).

Keep the ESLint configuration modular and extendable to scale with the application.

Use strict linting rules in CI/CD pipelines to ensure code consistency and quality.

