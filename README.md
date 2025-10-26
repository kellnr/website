# Kellnr Website

This repo is the code for the [kellnr.io](https://kellnr.io) webpage.

## Development Setup

### With Nix (Recommended)

Enter the development shell with all required tools:

```sh
nix develop
```

This provides all needed tools for development.

### Development Commands

```sh
# Install dependencies
npm install
# Compile and Hot-Reload for Development
npm run dev
# Type-Check, Compile and Minify for Production
npm run build
```

## Deploy new website version

Every push to the `main` branch automatically triggers a deployment via GitHub Actions.

To manually deploy, use Nix:

```sh
nix run .#deploy -- YOUR_PASSWORD
```
