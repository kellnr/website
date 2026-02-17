{
  description = "Development environment and deployment for kellnr website";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      allSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      forAllSystems =
        fn: nixpkgs.lib.genAttrs allSystems (system: fn { pkgs = import nixpkgs { inherit system; }; });

    in
    {
      devShells = forAllSystems (
        { pkgs }:
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs_24
              openssh
            ];

            shellHook = ''
              echo "Kellnr website development environment"
              echo ""
              echo "Available commands:"
              echo "  npm install      - Install dependencies"
              echo "  npm run dev      - Start development server"
              echo "  npm run build    - Build for production"
              echo ""
            '';
          };
        }
      );
    };
}
