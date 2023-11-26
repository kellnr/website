# Kellnr Website

This repo is the code for the [kellnr.io](https://kellnr.io) webpage.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Deploy

Run the following command once to provision the server:

```bash
cd ansible
ansible-playbook -i inventory.yaml -u root playbooks/provision.yaml
```

To deploy the new website version run:

```bash
cd ansible
ansible-playbook -i inventory.yaml -u root playbooks/deploy.yaml
```
