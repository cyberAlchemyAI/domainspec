#!/usr/bin/env node
'use strict';

const { startApi } = require('./server.cjs');

function parseArguments(argv) {
  if (argv.length === 0) return { port: 8787 };
  if (argv.length !== 2 || argv[0] !== '--port' || !/^\d+$/.test(argv[1])) {
    const error = new Error('usage: main.cjs [--port 0-65535]');
    error.code = 'ARGUMENT_INVALID';
    throw error;
  }
  const port = Number(argv[1]);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    const error = new Error('port must be an integer from 0 through 65535');
    error.code = 'PORT_INVALID';
    throw error;
  }
  return { port };
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  const api = await startApi(options);
  process.stdout.write(`Craft Consultation API listening at ${api.url}\n`);

  let closing = false;
  async function shutdown() {
    if (closing) return;
    closing = true;
    try {
      await api.close();
    } catch (error) {
      process.stderr.write(`Craft Consultation API shutdown failed: ${error.code || 'UNKNOWN'}\n`);
      process.exitCode = 1;
    }
  }

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  return api;
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`Craft Consultation API failed: ${error.code || 'UNKNOWN'}\n`);
    process.exitCode = 1;
  });
}

module.exports = Object.freeze({ main, parseArguments });
