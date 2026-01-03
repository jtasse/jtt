# AI File Placement Rules

## Source Code Location

All source code files MUST be created or modified under:

/src

### Exceptions

Files may exist outside /src ONLY if they are:

- Project configuration files (e.g. package.json, tsconfig.json)
- Tooling configuration (e.g. .eslintrc, .prettierrc)
- Documentation files (e.g. README.md)

## Prohibited Behavior

- Do NOT create duplicate files in the project root
- Do NOT recreate files that already exist under /src
- If a file already exists, ALWAYS update it in place

## If Unsure

If you are unsure where a file belongs:

- Ask before creating a new file
- Prefer modifying an existing file under /src
