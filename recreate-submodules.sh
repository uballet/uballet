#!/bin/bash

SUBTREE_PATH="test-infra/erc-4337-devnet/modular-account"

if [ -f "$SUBTREE_PATH/.gitmodules" ]; then
  cd $SUBTREE_PATH

  # Initialize and update all submodules
  git submodule init
  git submodule update --init --recursive
else
  echo "No .gitmodules file found in $SUBTREE_PATH"
fi
