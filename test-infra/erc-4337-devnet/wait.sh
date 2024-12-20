#!/bin/bash

PROXY_URL="http://localhost:8545"
PM_URL="http://localhost:43371"
while true; do
    # Check Bundler HTTP server is ready.
    BUNDLER_REQ='{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_supportedEntryPoints",
        "params": []
    }'
    BUNDLER_RESP=$(curl -s -X POST -H "Content-Type: application/json" --data "$BUNDLER_REQ" "$PROXY_URL")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to make bundler request. Checking again soon..."
        sleep 3
        continue  
    elif ! [[ $BUNDLER_RESP == *"0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"* ]]; then
        echo $BUNDLER_RESP
        echo "Error: Bundler response is not valid JSON. Checking again soon..."
        sleep 3
        continue
    fi
    READY=true

    # Check all supported EntryPoint contracts are deployed.
    SUPPORTED_ENTRYPOINTS=("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789")
    for ENTRYPOINT in "${SUPPORTED_ENTRYPOINTS[@]}"; do
        NODE_REQ="{
            \"jsonrpc\": \"2.0\",
            \"id\": 1,
            \"method\": \"eth_getCode\",
            \"params\": [\"$ENTRYPOINT\", \"latest\"]
        }"
        NODE_RESP=$(curl -s -X POST -H "Content-Type: application/json" --data "$NODE_REQ" "$PROXY_URL")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to make node request. Checking again soon..."
            READY=false
            break
        fi

        # Check Stackup Paymaster v0.6 is ready.
        STACKUP_PM_REQ="{
            \"jsonrpc\": \"2.0\",
            \"id\": 1,
            \"method\": \"pm_accounts\",
            \"params\": [\"$ENTRYPOINT\"]
        }"
        STACKUP_PM_RESP=$(curl -s -X POST -H "Content-Type: application/json" --data "$STACKUP_PM_REQ" "$PM_URL")
        if [ $? -ne 0 ]; then
            echo "Error: Failed to make paymaster request. Checking again soon..."
            READY=false
            break
        elif ! [[ $STACKUP_PM_RESP == *"0x42051Fa8F6c012102899c902aA214f1e97bD8aDb"* ]]; then
            echo $STACKUP_PM_RESP
            echo "Error: Paymaster response is not valid JSON. Checking again soon..."
            READY=false
            break
        fi
    done

    # Check if devnet is ready.
    if [ "$READY" == "true" ]; then
        echo "ERC-4337 Devnet is ready."
        exit 0;
    fi
    sleep 3
done
