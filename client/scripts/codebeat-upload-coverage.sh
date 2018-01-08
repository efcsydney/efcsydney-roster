#!/bin/bash

CODECLIMATE_API_HOST=https://codebeat.co/webhooks/code_coverage \
CODECLIMATE_REPO_TOKEN=cc9d8f32-ad80-4083-9822-89232d127763 \
node_modules/codeclimate-test-reporter/bin/codeclimate.js < coverage/lcov.info

