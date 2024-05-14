{
  inputs.canivete.url = github:schradert/canivete;
  outputs = inputs:
    inputs.canivete.lib.mkFlake {inherit inputs;} {
      perSystem = {pkgs, ...}: {
        canivete = {
          devShell.name = "sage";
          devShell.packages = with pkgs; [bun];
          pre-commit = {
            languages.javascript.enable = true;
            # Also run biome on .svelte files
            settings.hooks.biome.types_or = ["svelte"];
            # Allow arbitrary line length in markdown (paragraph wrapping preferred)
            settings.hooks.markdownlint.settings.configuration.MD013.line_length = -1;
            # Remap sveltekit assets to correct folder for static link checking
            settings.hooks.lychee.settings.flags = "--remap 'src/%25sveltekit.assets%25 static'";
          };
        };
      };
    };
}
