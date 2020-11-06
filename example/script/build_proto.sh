#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

PROTO_DEST=${1:-./src/proto}

mkdir -p ${PROTO_DEST}

# grpc-js
# JavaScript code generating
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:${PROTO_DEST} \
--grpc_out=grpc_js:${PROTO_DEST} \
-I ./proto \
proto/*.proto

grpc_tools_node_protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=grpc_js:${PROTO_DEST} \
-I ./proto \
proto/*.proto
