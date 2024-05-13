{
  inputs.canivete.url = github:schradert/canivete;
  outputs = inputs:
    inputs.canivete.lib.mkFlake {inherit inputs;} {
      perSystem = {pkgs, ...}: {
        canivete = {
          devShell.name = "sage";
          devShell.packages = with pkgs; [bun nodejs_22];
          pre-commit = {
            languages.javascript.enable = true;
            # Remap sveltekit assets to correct folder for static link checking
            settings.hooks.lychee.settings.flags = "--remap 'src/%25sveltekit.assets%25 static'";
          };
        };
      };
    };
}
