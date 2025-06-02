# Contributing to satware.ai Website

We welcome contributions to the `satware.ai` website! Your help is invaluable in making our documentation better. Please take a moment to review this document to understand how to contribute.

## How to Contribute

1.  **Fork the Repository**: Start by forking the `satwareAG-ironMike/satware.ai` repository to your GitHub account.

2.  **Clone Your Fork**: Clone your forked repository to your local machine:
    ```bash
    git clone https://github.com/YOUR_USERNAME/satware.ai.git
    cd satware.ai
    ```

3.  **Create a New Branch**: Create a new branch for your feature or bug fix. Use a descriptive name (e.g., `feature/add-new-page`, `fix/broken-link`):
    ```bash
    git checkout -b feature/your-feature-name
    ```

4.  **Set up Local Development**: Follow the "Local Development" instructions in the `README.md` to get the website running locally.
    ```bash
    ./mkdocs.sh
    ```
    This will start a live-reloading server at `http://localhost:8000`.

5.  **Make Your Changes**:
    *   **Documentation**: Most content is written in Markdown files located in the `docs/` directory.
    *   **Styling**: Custom styles are defined in `overrides/assets/css/custom.scss`. Changes to this file will be automatically compiled to `docs/assets/css/custom.css` by the `scss_watcher.py` script running in your Docker container.
    *   **Configuration**: The main configuration is in `mkdocs.yml`.

6.  **Test Your Changes**: Before submitting, ensure your changes work as expected by viewing them on your local development server.

7.  **Commit Your Changes**: Write clear and concise commit messages.
    ```bash
    git add .
    git commit -m "feat: Add new section on AI agents"
    ```
    (Consider using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.)

8.  **Push to Your Fork**:
    ```bash
    git push origin feature/your-feature-name
    ```

9.  **Create a Pull Request**: Go to your forked repository on GitHub and create a new Pull Request targeting the `main-mkdocs` branch of the `satwareAG-ironMike/satware.ai` repository.
    *   Provide a clear title and description of your changes.
    *   Reference any related issues.

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## Security Policy

If you discover any security vulnerabilities, please report them responsibly by following our [Security Policy](SECURITY.md).

Thank you for contributing!
