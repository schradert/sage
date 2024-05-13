# Sage

## Contributing

It is **recommended** to use the [Nix development shell](#nix-development-shell) instructions to have access to all repository tooling, but the core application can be developed without this. Here are the simple instructions to begin:

1. (*optional*) if `bun` is not provided by `nix`, [install `bun`](https://bun.sh) first
2. `bun install` to install all javascript dependencies
3. `bun run dev -- --open` to begin developing with hot reload, which will auto-open the app in the browser

## Tools

1. [`typescript`](https://www.typescriptlang.org/) as scripting language
2. [`sveltekit`](https://kit.svelte.dev/) as full-stack application framework
3. [`svelte`](https://svelte.dev/) as component framework
4. [`vite`](https://vitejs.dev/) as javascript module bundler
5. [`bun`](https://bun.sh/) as server runtime and package manager
6. [`xyflow`](https://svelteflow.dev/) as flowchart component library
7. [`tailwind`](https://tailwindcss.com/) as component styling framework
8. [`shadcn-svelte`](https://www.shadcn-svelte.com/) as component repository
9. [`playwright`](https://playwright.dev/) as end-to-end testing framework
10. [`vitest`](https://vitest.dev/) as unit testing framework
11. [`svelte-persisted-store`](https://github.com/joshnuss/svelte-persisted-store) as temporary(!) data storage layer
12. [`quill`](https://quilljs.com/) or [`TipTap`](https://tiptap.dev/) as WYSIWYG editor component
13. [`renovate`](https://github.com/renovatebot/renovate) as dependency automation tool
14. [`elkjs`](https://github.com/kieler/elkjs) as flowchart layout algorithm

### Nix development shell

As with many of @schradert's code repositories, this one uses the [`nix: package manager`](https://nixos.org/) as a metatool for accessing, building, and running any other software reproducibly. To access the tools in this section (required for final approval on merging pull requests into `trunk`), please follow the instructions below.

#### Installing Nix

1. Follow the [installation instructions](https://nixos.org/download/) for your runtime preference.
2. Activate necessary experimental features

```bash
mkdir -p ~/.config/nix
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

What this does is allow you to use the `nix` command directly on a "flake", which are essentially standard nowadays

#### Activating the development environment

Because the `nix-command` and `flakes` features are active now, simply run `nix develop` from within the project directory and watch the magic happen. This will take a while to complete but by the end, you will enter an interactive shell with all of the tools you need to work on the project.

This development environment is configurable from within the project, but it does not hot reload by default without a separate tool: `direnv`. To enable this autoloading feature, install the necessary tools like so:

``` bash
nix profile install nixpkgs#direnv nixpkgs#nix-direnv
```

[direnv](https://direnv.net/) is a simple but effective tool that will run code in every `.envrc` in an entered directory and its ancestors. We include the `nix-direnv` library to support building the project's development shell using Nix.

After running this command, a prompt will instruct you to allow the project's environment to evaluate by running `direnv allow`. Now any process that enters any of this project's directories will be sure to operate within the development environment.

If there are issues with code not autoloading, `direnv reload` will force the environment to reevaluate.

#### Nix Tooling

1. [`canivete`](https://github.com/schradert/canivete) as repository framework
2. [`pre-commit`](https://pre-commit.com/) as git hook framework
3. [`commitizen`](https://commitizen-tools.github.io/commitizen/) as release management tool
4. [`gitleaks`](https://github.com/gitleaks/gitleaks) as secret exposure prevention tool
5. [`lychee`](https://lychee.cli.rs/) as hyperlink validator
6. [`markdownlint`](https://github.com/DavidAnson/markdownlint) as markdown linter
7. [`mdsh`](https://github.com/zimbatm/mdsh) as markdown shell preprocessor
8. [`tagref`](https://github.com/stepchowfun/tagref) as code annotation framework
9. [`typos`](https://github.com/crate-ci/typos) as spell checker
10. [`alejandra`](https://github.com/kamadorueda/alejandra) as nix formatter
11. [`deadnix`](https://github.com/astro/deadnix) as nix linter for dead code
12. [`statix`](https://github.com/nerdypepper/statix) as general nix linter
13. [`biome`](https://biomejs.dev/) as javascript linter and formatter
