#!/bin/sh
set -eu

dir=$(mktemp -d)
trap 'rm -rf "$dir"' EXIT

tarball="$dir/$(npm pack --silent --pack-destination "$dir")"
npx --yes @arethetypeswrong/cli@0.18.5 "$tarball"

for major in $(node -p 'require("./package.json").peerDependencies["@nestjs/core"].split("||").map((range) => parseInt(range.trim().slice(1))).join(" ")'); do
  echo "NestJS $major"
  # Run outside this repository: inside it, "nestjs-kysely" resolves to the repository itself before node_modules.
  app="$dir/nest$major"
  mkdir "$app"
  echo '{"private":true}' >"$app/package.json"
  cp test/package/require.cjs test/package/import.mjs test/package/scenario.mjs "$app"
  npm install --prefix "$app" --loglevel=error --no-audit --no-fund "$tarball" "@nestjs/common@$major" "@nestjs/core@$major" kysely better-sqlite3
  node "$app/require.cjs"
  node "$app/import.mjs"
done
