const assert = require("node:assert/strict");
require("reflect-metadata");

assert.match(
  require.resolve("nestjs-kysely"),
  /node_modules[\\/]nestjs-kysely[\\/]dist[\\/]index\.cjs$/,
);

// A rejection is left unhandled on purpose: Node then exits with code 1, which fails run.sh.
void import("./scenario.mjs").then(({ verify }) =>
  verify({
    common: require("@nestjs/common"),
    core: require("@nestjs/core"),
    kysely: require("kysely"),
    Database: require("better-sqlite3"),
    nestjsKysely: require("nestjs-kysely"),
  }),
);
