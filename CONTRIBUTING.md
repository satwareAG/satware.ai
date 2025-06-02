# Contributing to satware.ai Website

We welcome contributions to the `satware.ai` website! Your help is invaluable in making our documentation better. Please take a moment to review this document to understand how to contribute.

## 🐛 Issue Reporting

**Before contributing code**, please check if there's an existing issue for your concern:

**🎯 [Check & Report Issues Here](https://github.com/satwareAG/satware.ai/issues)**

### When to Report an Issue

- Found a bug or error on the website
- Have a feature request or suggestion
- Experiencing technical difficulties
- Notice inconsistencies in documentation

### How to Report Issues

When creating an issue, please include:

1. **Clear, descriptive title**
2. **Detailed description** of the problem or request
3. **Steps to reproduce** (for bugs)
4. **Expected vs. actual behavior**
5. **Screenshots** (if applicable)
6. **Browser/device information**
7. **URL** where the issue occurs

This helps our team address your concerns quickly and ensures no duplicate work.

## How to Contribute

### 1. Fork the Repository
Start by forking the `satwareAG/satware.ai` repository to your GitHub account.

### 2. Clone Your Fork
Clone your forked repository to your local machine:
```bash
git clone https://github.com/YOUR_USERNAME/satware.ai.git
cd satware.ai
```

### 3. Create a New Branch
Create a new branch for your feature or bug fix. Use a descriptive name (e.g., `feature/add-new-page`, `fix/broken-link`):
```bash
git checkout -b feature/your-feature-name
```

### 4. Set up Local Development
Follow the "Local Development" instructions in the `README.md` to get the website running locally:
```bash
./mkdocs.sh
```
This will start a live-reloading server at `http://localhost:8000`.

### 5. Make Your Changes

- **Documentation**: Most content is written in Markdown files located in the `docs/` directory.
- **Styling**: Custom styles are defined in `overrides/assets/css/custom.scss`. Changes to this file will be automatically compiled to `docs/assets/css/custom.css` by the `scss_watcher.py` script running in your Docker container.
- **Configuration**: The main configuration is in `mkdocs.yml`.

### 6. Test Your Changes
Before submitting, ensure your changes work as expected by viewing them on your local development server.

### 7. Commit Your Changes
Write clear and concise commit messages:
```bash
git add .
git commit -m "feat: Add new section on AI agents"
```
(Consider using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.)

### 8. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 9. Create a Pull Request
Go to your forked repository on GitHub and create a new Pull Request targeting the `main-mkdocs` branch of the `satwareAG/satware.ai` repository.

- **Provide a clear title and description** of your changes
- **Reference any related issues** (e.g., "Fixes #123")
- **Explain the impact** of your changes
- **Include screenshots** for visual changes

## Repository Workflow

### Development Flow
1. **Issues** are created and discussed in the main repository: `satwareAG/satware.ai`
2. **Development** happens in individual forks
3. **Pull Requests** are submitted to the main repository
4. **Review and merge** happen in the main repository

### Branch Strategy
- **Main branch**: `main-mkdocs`
- **Feature branches**: `feature/description`
- **Bug fix branches**: `fix/description`
- **Documentation branches**: `docs/description`

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## Security Policy

If you discover any security vulnerabilities, please report them responsibly by following our [Security Policy](SECURITY.md).

Thank you for contributing!