#!/bin/sh
set -eu

dir=$(mktemp -d)
trap 'rm -rf "$dir"' EXIT

tarball="$dir/$(npm pack --silent --pack-destination "$dir")"
npx --yes @arethetypeswrong/cli@0.18.5 "$tarball"

nest_majors=$(node -p 'require("./package.json").peerDependencies["@nestjs/core"].split("||").map((range) => parseInt(range.trim().slice(1))).join(" ")')
# Each Kysely 0.x minor may break the previous one, so the oldest minor in the peer range is tested as well as the latest.
kysely_oldest=$(node -p 'require("./package.json").peerDependencies.kysely.match(/^>=(\S+)/)[1]')

for major in $nest_majors; do
  for kysely in "$kysely_oldest" latest; do
    echo "NestJS $major, Kysely $kysely"
    # Run outside this repository: inside it, "nestjs-kysely" resolves to the repository itself before node_modules.
    app="$dir/nest$major-kysely$kysely"
    mkdir "$app"
    echo '{"private":true}' >"$app/package.json"
    cp test/package/require.cjs test/package/import.mjs test/package/scenario.mjs "$app"
    npm install --prefix "$app" --loglevel=error --no-audit --no-fund "$tarball" "@nestjs/common@$major" "@nestjs/core@$major" "kysely@$kysely" better-sqlite3
    node "$app/require.cjs"
    node "$app/import.mjs"
  done
done
