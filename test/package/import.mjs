import assert from "node:assert/strict";
import "reflect-metadata";
import * as common from "@nestjs/common";
import * as core from "@nestjs/core";
import * as kysely from "kysely";
import Database from "better-sqlite3";
import * as nestjsKysely from "nestjs-kysely";
import { verify } from "./scenario.mjs";

assert.match(
  import.meta.resolve("nestjs-kysely"),
  /node_modules\/nestjs-kysely\/dist\/index\.mjs$/,
);

await verify({ common, core, kysely, Database, nestjsKysely });
