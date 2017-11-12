#!/bin/sh

cd benchmarks
yarn && yarn upgrade -D express-physical
node index.js