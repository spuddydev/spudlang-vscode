<div align="center">
  <img src="docs/syntax-highlighted.png" alt="Sample highlighted ask statement reading 'want to start tempalting?'" width="650">
  <br>
  <h1>spudlang VSCode</h1>
</div>

Syntax highlighting and IntelliSense for **spudlang**, the domain-specific language used by [spudplate](https://github.com/spuddydev/spudplate), a template scaffolding system. You write a `.spud` file, install it once, and run it whenever you want to scaffold a new project, answering prompts as it goes.

## Features

**Syntax**

- Keyword highlighting (`ask`, `let`, `mkdir`, `file`, `copy`, `include`, `run`, `repeat`, `if`, `when`, etc.)
- Clause keywords (`from`, `into`, `in`, `as`, `content`, `mode`, `verbatim`, `append`, `default`, `options`, `timeout`)
- Type annotations (`string`, `int`, `bool`)
- Version pins on `include` (`include dep@2`)
- String literals with `{interpolation}` support
- `# comments`
- Logical/comparison operators (`and`, `or`, `not`, `==`, `!=`, etc.)
- Arithmetic operators (`+`, `-`, `*`, `/`)
- Built-in functions (`lower`, `upper`, `trim`, `replace`)
- Line continuation (`\` at end of line)
- Code folding for `repeat`...`end` and `if`...`end` blocks
- Auto-indent support

**IntelliSense**

- Path completion after `mkdir`, `file`, `copy`, `from`, `into`, `in`. Suggestions are read from the filesystem relative to the open `.spud` file, both unquoted and inside `"..."`. Selecting a directory keeps the popup open so you can drill in.
- Variable completion for names declared with `ask`, `let`, or an `as` binding (`mkdir … as foo`, `repeat n as week`). Works in expressions and inside `{…}` interpolations, with the declaring line shown as docs.

## File Extensions

`.spud`, `.spudplate`

## Installation

1. Build the extension bundle:

   ```bash
   npm install
   npm run compile
   ```

2. Copy or symlink this folder into your VS Code extensions directory:

   ```bash
   ln -s /path/to/spudlang-vscode ~/.vscode/extensions/spudlang-vscode
   ```

3. Reload VS Code (`Cmd+Shift+P` → "Developer: Reload Window")

4. Open any `.spud` or `.spudplate` file - highlighting and IntelliSense activate automatically.

## Development

- `npm run watch` rebuilds the bundle on change.
- `npm run typecheck` runs the TypeScript compiler without emitting.
- Use VS Code's "Run Extension" debug target (or copy the folder to your extensions dir and reload) to test changes.

## Syntax Reference

See the full [spudlang language reference](https://github.com/spuddydev/spudplate/tree/main/docs/lang) in the main spudplate repo.

## Customising

- To add new keywords or built-in functions, edit `syntaxes/spudplate.tmLanguage.json`. The grammar uses standard TextMate scopes, so any VS Code colour theme will work.
- To change which keywords trigger path completion, or to extend the set of variable-binding patterns, see `src/completion/paths.ts` and `src/completion/variables.ts`.
