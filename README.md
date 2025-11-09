# satware.ai Website

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/satwareAG/satware.ai/deploy-live.yml?branch=main-mkdocs&label=Build%20Status)](https://github.com/satwareAG/satware.ai/actions/workflows/deploy-live.yml)
[![MkDocs Material](https://img.shields.io/badge/docs-MkDocs%20Material-blue.svg)](https://squidfunk.github.io/mkdocs-material/)
[![License](https://img.shields.io/github/license/satwareAG/satware.ai)](LICENSE)

A modern, responsive documentation website for satware.ai, built with [MkDocs](https://www.mkdocs.org/) and the beautiful [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme. This repository serves as the source for the static website deployed to GitHub Pages.

## ✨ Features

*   **Clean & Responsive Design**: Powered by Material for MkDocs, ensuring a great experience on any device.
*   **Easy Documentation**: Write content in Markdown, and MkDocs handles the rest.
*   **Local Development with Docker**: Simple setup for local development with live-reloading.
*   **Automated Deployment**: Seamless deployment to GitHub Pages via GitHub Actions.

## 🚀 Getting Started

### Local Development

Developing locally is streamlined using Docker, which encapsulates all necessary dependencies.

**Prerequisites:**

*   [Docker](https://www.docker.com/get-started/) installed and running on your system.

**Steps:**

1.  **Fork the original repository**: Fork the `satwareAG/satware.ai` repository to your GitHub account.
2.  **Clone your fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/satware.ai.git
    cd satware.ai
    ```
    (Replace `YOUR_USERNAME` with your GitHub username.)

3.  **Start the development server**:
    ```bash
    ./mkdocs.sh
    ```
    This command will build the Docker image (if not already built) and start a local development server. The website will be accessible at [http://localhost:8000](http://localhost:8000). Any changes you make to the documentation files (`docs/`) will automatically trigger a live reload in your browser.

### Project Structure

```
.
├── .clinerules/          # Project-specific AI assistant rules (MANDATORY)
│   └── satware-ai-dev.md # Development rules for this project
├── .github/              # GitHub Actions workflows for CI/CD
│   └── workflows/        # Contains deploy-live.yml and deploy-preview.yml
├── .gitignore            # Specifies intentionally untracked files to ignore
├── .repoinsight/          # Configuration for repository insights (if applicable)
├── docker/               # Docker-related files
│   └── mkdocs-material/  # Dockerfile for the MkDocs Material environment
├── docs/                 # Markdown source files for the documentation
│   ├── internal/         # ⚠️ INTERNAL DOCS - NOT PUBLISHED (excluded via mkdocs.yml)
│   ├── index.md          # Homepage content
│   └── ...               # Other documentation pages and assets
├── mkdocs.sh             # Script for local development with Docker
├── mkdocs.yml            # Main MkDocs configuration file
├── overrides/            # Custom theme overrides and assets (e.g., SCSS)
│   └── assets/
│       └── css/
│           └── custom.scss
├── scss_watcher.py       # Python script to watch and compile SCSS
├── tasks.md              # Markdown file for project tasks/notes
└── README.md             # This file
```

### 📁 Internal Documentation Policy

**⚠️ CRITICAL: All internal documentation MUST be placed in `docs/internal/`**

The `docs/internal/` directory is **automatically excluded** from the published website via the `mkdocs-exclude` plugin configured in `mkdocs.yml`. This ensures that internal development notes, analysis documents, and sensitive information are **never published** to satware.ai.

**Rules:**
- ✅ **DO**: Place all internal docs in `docs/internal/`
- ✅ **DO**: Use descriptive filenames (e.g., `dev-ci-parity-analysis.md`, `architecture-notes.md`)
- ❌ **DON'T**: Place internal docs anywhere else in `docs/`
- ❌ **DON'T**: Commit sensitive information even to `docs/internal/`

**Verification:**
```bash
# Test locally before pushing
./mkdocs.sh
# Navigate to http://localhost:8000
# Verify internal docs are NOT listed in navigation or search
```

**What belongs in `docs/internal/`:**
- Development analysis and planning documents
- Architecture decision records (internal)
- CI/CD configuration notes
- Testing strategies and results
- Migration guides (internal)
- Any documentation NOT intended for public consumption

**Enforcement:** The `.clinerules/satware-ai-dev.md` file contains **MANDATORY rules** for AI assistants working on this project to enforce this policy automatically.

## 🛠️ Technologies Used

*   **Static Site Generator**: MkDocs
*   **Theme**: Material for MkDocs (v9.6.14)
*   **Containerization**: Docker
*   **CI/CD**: GitHub Actions
*   **Styling**: SCSS (Sass) with `pysassc`
*   **Language**: Python (v3.13-slim-bullseye in Docker)
*   **SCSS Watcher**: Custom Python script (`scss_watcher.py`)

## 🌐 Deployment

The `satware.ai` website is automatically deployed to GitHub Pages.

**Workflow for your fork (for testing/preview):**

1.  **Push to your fork**: When you push changes to your fork (`https://github.com/YOUR_USERNAME/satware.ai`), specifically to the `main-mkdocs` branch.
2.  **GitHub Pages Setup**: Ensure GitHub Pages is enabled for your fork, building from the `gh-pages` branch.
3.  **GitHub Actions Trigger**: A GitHub Actions workflow (`ci.yml`) is triggered.
4.  **Build & Deploy**: This workflow builds the static website using MkDocs and deploys it to the `gh-pages` branch of your fork.
5.  **Live Website**: The static website becomes available at `https://YOUR_USERNAME.github.io/satware.ai/`.

**Workflow for the main repository (live site):**

*   Changes merged into the `main-mkdocs` branch of the *original* `satwareAG/satware.ai` repository will trigger the live site deployment to `https://satware.ai/`.

## ❓ Troubleshooting

*   **SCSS Changes Not Reflecting**: Ensure the `scss_watcher.py` is running correctly within your Docker container. Check the Docker logs for any errors during SCSS compilation. The `scss_watcher.py` monitors `overrides/assets/css/custom.scss` and compiles it to `docs/assets/css/custom.css`.
*   **Docker Issues**: If you encounter issues with the `./mkdocs.sh` script, verify that Docker is running and that you have the necessary permissions.

## 🐛 Issue Reporting

Found a bug, have a feature request, or experiencing issues with the satware.ai website? Please report all issues to our main repository:

**🎯 [Report Issues Here](https://github.com/satwareAG/satware.ai/issues)**

When reporting issues, please include:

- **Clear description** of the problem or feature request
- **Steps to reproduce** (if applicable)
- **Expected behavior** vs actual behavior
- **Browser/device information** (e.g., Chrome 120, Safari on iOS 17)
- **Screenshots or error messages** (if relevant)
- **URL** where the issue occurs (if specific to a page)

This helps our team address your concerns quickly and effectively. We appreciate your feedback in making satware.ai better for everyone!

## 🤝 Contributing

Contributions are welcome! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any inquiries or support, please contact [info@satware.ai](mailto:info@satware.ai).
