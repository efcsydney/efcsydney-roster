**Purpose**: Generate a reviewable HTML email from sample data using the project's email utils.

**Prerequisites**
- Node.js installed (LTS recommended).
- You do NOT need to install the whole project's dependencies. The steps below show a lightweight way to test safely.

**Quick run (if your environment already has project deps)**
From the repository root, run:

```bash
node test_email_gen.js
```

This produces `test_output.html` in the repository root.

**Safe/test-env run (recommended if modules are missing or to avoid altering the repo)**
1. Create a temporary test node_modules folder and install only required packages:

```bash
mkdir test-env
cd test-env
npm init -y
npm install mjml@3.3.5 lodash moment nodemailer config winston@2.4.4 winston-daily-rotate-file js-yaml --force
cd ..
```

2. Point Node to the test env modules and run the generator from repo root:

```bash
export NODE_PATH=$(pwd)/test-env/node_modules
node test_email_gen.js
```

3. Open `test_output.html` in your browser or editor to review the generated email HTML.

**Notes & troubleshooting**
- If `mjml` or other modules are missing, follow the Safe/test-env run to avoid touching the project's main `node_modules`.
- The test runner is `test_email_gen.js` (repo root). Edit it if you want different mock data.
- Clean up by removing `test-env` when finished: `rm -rf test-env`.
