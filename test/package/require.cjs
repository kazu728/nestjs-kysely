const assert = require("node:assert/strict");
require("reflect-metadata");

assert.match(require.resolve("nestjs-kysely"), /dist[\\/]index\.cjs$/);

import("./scenario.mjs").then(({ verify }) =>
  verify({
    common: require("@nestjs/common"),
    core: require("@nestjs/core"),
    kysely: require("kysely"),
    Database: require("better-sqlite3"),
    nestjsKysely: require("nestjs-kysely"),
  })
);
