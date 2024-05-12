{
  inputs = {
    canivete.url = github:schradert/canivete;
    supabase.url = github:supabase-community/supabase-kubernetes;
    supabase.flake = false;
    penpot.url = github:codechem/helm;
    penpot.flake = false;
  };
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
          kubenix.clusters.local = {
            k3d = true;
            modules.main.kubernetes.helm.releases = {
              supabase.chart = "${inputs.supabase}/charts/supabase";
              penpot.chart = "${inputs.penpot}/charts/penpot";
            };
          };
        };
      };
    };
}
