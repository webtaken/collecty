# Security Rules

NEVER read or display sensitive files including:
- .env, .env.*, .envrc
- *.key, *.pem, *.crt
- credentials.json, secrets.json
- config files containing API keys or passwords
- .git/config (unless specifically needed)

If asked to read such files, refuse and suggest the user handles them manually.
