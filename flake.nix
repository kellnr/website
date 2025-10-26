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
      apps = forAllSystems (
        { pkgs }:
        {
          deploy = {
            type = "app";
            program = toString (
              pkgs.writeShellScript "deploy-website" ''
                set -euo pipefail

                REMOTE_HOST="kellnr.io"
                REMOTE_USER="root"
                REMOTE_TARGET_DIR="/var/www/html/kellnr/dist"
                REMOTE_PASSWORD="$1"

                if [ -z "$REMOTE_PASSWORD" ]; then
                  echo "Error: Password argument is required"
                  echo "Usage: nix run .#deploy -- yourpassword"
                  exit 1
                fi

                echo "Building website..."
                ${pkgs.nodejs_24}/bin/npm install
                ${pkgs.nodejs_24}/bin/npm run build

                echo "Deploying to $REMOTE_USER@$REMOTE_HOST:$REMOTE_TARGET_DIR..."
                ${pkgs.sshpass}/bin/sshpass -p "$REMOTE_PASSWORD" \
                  ${pkgs.openssh}/bin/ssh -F /dev/null -o StrictHostKeyChecking=no \
                  $REMOTE_USER@$REMOTE_HOST \
                  "rm -rf $REMOTE_TARGET_DIR && mkdir -p $REMOTE_TARGET_DIR"

                ${pkgs.sshpass}/bin/sshpass -p "$REMOTE_PASSWORD" \
                  ${pkgs.rsync}/bin/rsync -avz --delete \
                  -e "${pkgs.openssh}/bin/ssh -F /dev/null -o StrictHostKeyChecking=no" \
                  dist/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_TARGET_DIR/

                echo "Restarting nginx..."
                ${pkgs.sshpass}/bin/sshpass -p "$REMOTE_PASSWORD" \
                  ${pkgs.openssh}/bin/ssh -F /dev/null -o StrictHostKeyChecking=no \
                  $REMOTE_USER@$REMOTE_HOST \
                  "sudo systemctl restart nginx" || echo "Warning: Failed to restart nginx"

                echo "Deployment completed!"
              ''
            );
          };
        }
      );

      devShells = forAllSystems (
        { pkgs }:
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              git
              nodejs_24
              openssh
              rsync
              sshpass
            ];

            shellHook = ''
              echo "Kellnr website development environment"
              echo ""
              echo "Available commands:"
              echo "  npm install      - Install dependencies"
              echo "  npm run dev      - Start development server"
              echo "  npm run build    - Build for production"
              echo "  nix build        - Build with Nix"
              echo "  nix run .#deploy - Deploy to remote server"
              echo ""
              echo "Deployment usage:"
              echo "  nix run .#deploy -- yourpassword"
            '';
          };
        }
      );
    };
}
