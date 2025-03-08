# GitHub Repository Explorer

&#x20; &#x20;

## 🚀 Overview

GitHub Repository Explorer is a web application built with React and Vite that allows users to search and explore GitHub repositories with a clean and user-friendly interface. The application fetches repository data using the GitHub API and presents detailed information about repositories.

## 📌 Features

- 🔍 **Search GitHub users** by username
- 📄 **View repository details** including stars, forks, issues, and contributors
- ⚡ **Optimized performance** using React + Vite

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Router
- **State Management:** Redux Toolkit
- **Build Tool:** Vite
- **API Integration:** Axios (GitHub REST API)
- **Testing:** Vitest, React Testing Library
- **Deployment:** GitHub Pages

## 📂 Project Structure

```plaintext
├── src/
│   ├── components/    # Reusable UI components
│   ├── features/      # Redux slices & business logic
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── styles/        # Tailwind global styles
│   ├── App.tsx        # Main App component
│   ├── main.tsx       # Entry point
│   └── index.css      # Global CSS
├── public/            # Static assets
├── tests/             # Unit & integration tests
├── dist/              # Production build
├── .github/workflows/ # CI/CD pipeline
├── vite.config.ts     # Vite configuration
└── package.json       # Project dependencies & scripts
```

## 🏗️ Setup & Installation

### Prerequisites

- **Node.js** v20+
- **npm** v10+

### Installation Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/riannurulh/GitHub-repositories-explorer.git
   cd GitHub-repositories-explorer
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
4. Open the application in your browser:
   ```sh
   http://localhost:5173
   ```

## 🚀 Deployment

### GitHub Pages

To deploy the project to GitHub Pages:

```sh
npm run build
npm run deploy
```

Make sure the `homepage` field in `package.json` is correctly set:

```json
"homepage": "https://riannurulh.github.io/GitHub-repositories-explorer"
```

## ✅ Testing

Run unit and integration tests using Vitest:

```sh
npm run test
```

Run tests with coverage report:

```sh
npm run test:coverage
```