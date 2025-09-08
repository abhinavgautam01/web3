#!/bin/bash

set -e

# Use the Alchemy RPC endpoint you provided
export SOLANA_URL="https://solana-devnet.g.alchemy.com/v2/Jdx7kejFF8h5mR4WqH0Ji"

echo "Building optimized release binary..."
cargo build --release
BINARY="./target/release/solana-tss"

# Function to execute everything as fast as possible
execute_mcp() {
    local attempt=$1
    echo "=== ATTEMPT $attempt ==="
    
    # Step 1: Generate messages in parallel (pre-stage this)
    echo "Generating messages..."
    $BINARY agg-send-step-one 41X46diCpQ1sZrBVLnFDvVjPDmHodW9bknKYjyaw3Ck9zHnGk2oHanMoxh9H42NCqct4MErmqoNwdm5sbY1exREL > /tmp/step1_1.txt &
    $BINARY agg-send-step-one 5kJWiUzvqXgpPZHkNYWnCkiNXY8KU1MqyAuQarKgtbLunPLeKo8sxKk1turp5SfkMHwast1ze71vxeQDvrVKULdi > /tmp/step1_2.txt &
    wait
    
    MESSAGE_1=$(grep "Message 1:" /tmp/step1_1.txt | awk '{print $3}')
    SECRET_1=$(grep "Secret state:" /tmp/step1_1.txt | awk '{print $3}')
    MESSAGE_2=$(grep "Message 1:" /tmp/step1_2.txt | awk '{print $3}')
    SECRET_2=$(grep "Secret state:" /tmp/step1_2.txt | awk '{print $3}')
    
    echo "Messages ready, starting time-critical section..."
    
    # CRITICAL TIME SECTION - everything from here must be FAST
    local critical_start=$(date +%s.%N)
    
    # Get blockhash
    BLOCKHASH=$($BINARY recent-block-hash | grep "recent block hash:" | awk '{print $4}')
    local hash_time=$(date +%s.%N)
    local hash_duration=$(echo "$hash_time - $critical_start" | bc)
    echo "Blockhash $BLOCKHASH in ${hash_duration}s"
    
    # Generate signatures immediately in parallel
    $BINARY agg-send-step-two --keypair 41X46diCpQ1sZrBVLnFDvVjPDmHodW9bknKYjyaw3Ck9zHnGk2oHanMoxh9H42NCqct4MErmqoNwdm5sbY1exREL --amount 1 --to 8XPovF32Ya1aJcoxbJLNrNGToRwvAQMzkTuQY81pk857 --recent-block-hash $BLOCKHASH --keys 8qX8ChaXS89xfeiKzP2UfXE8A2cLkhSqWQnRykHPYRpG 3GMY4iT8We5FRkM2njYmsusGqe7VYSmUag92szECCeMJ --first-messages $MESSAGE_2 --secret-state $SECRET_1 > /tmp/sig1.txt &
    
    $BINARY agg-send-step-two --keypair 5kJWiUzvqXgpPZHkNYWnCkiNXY8KU1MqyAuQarKgtbLunPLeKo8sxKk1turp5SfkMHwast1ze71vxeQDvrVKULdi --amount 1 --to 8XPovF32Ya1aJcoxbJLNrNGToRwvAQMzkTuQY81pk857 --recent-block-hash $BLOCKHASH --keys 8qX8ChaXS89xfeiKzP2UfXE8A2cLkhSqWQnRykHPYRpG 3GMY4iT8We5FRkM2njYmsusGqe7VYSmUag92szECCeMJ --first-messages $MESSAGE_1 --secret-state $SECRET_2 > /tmp/sig2.txt &
    wait
    
    SIG_1=$(grep "Partial signature:" /tmp/sig1.txt | awk '{print $3}')
    SIG_2=$(grep "Partial signature:" /tmp/sig2.txt | awk '{print $3}')
    
    local sig_time=$(date +%s.%N)
    local sig_duration=$(echo "$sig_time - $hash_time" | bc)
    echo "Signatures ready in ${sig_duration}s"
    
    # Broadcast immediately
    $BINARY aggregate-signatures-and-broadcast --signatures $SIG_1 $SIG_2 --amount 1 --to 8XPovF32Ya1aJcoxbJLNrNGToRwvAQMzkTuQY81pk857 --recent-block-hash $BLOCKHASH --net devnet --keys 8qX8ChaXS89xfeiKzP2UfXE8A2cLkhSqWQnRykHPYRpG 3GMY4iT8We5FRkM2njYmsusGqe7VYSmUag92szECCeMJ
    
    local end_time=$(date +%s.%N)
    local critical_duration=$(echo "$end_time - $critical_start" | bc)
    echo "SUCCESS! Critical section took ${critical_duration}s"
    
    return 0
}

# Retry with exponential backoff
SUCCESS=false
for attempt in {1..8}; do
    if execute_mcp $attempt; then
        echo "TRANSACTION SUCCESSFUL!"
        SUCCESS=true
        break
    else
        echo "Attempt $attempt failed"
        if [ $attempt -lt 8 ]; then
            local wait_time=$((attempt * 2))
            echo "Waiting ${wait_time}s before retry..."
            sleep $wait_time
        fi
    fi
done

if [ "$SUCCESS" = false ]; then
    echo "All attempts failed. The blockhash expiration window is too small for this MCP process."
    echo "Consider:"
    echo "1. Using mainnet (longer blockhash validity)"
    echo "2. Optimizing the TSS library for faster execution"
    echo "3. Using a dedicated high-performance RPC endpoint"
    exit 1
fi

# Cleanup
rm -f /tmp/step1_1.txt /tmp/step1_2.txt /tmp/sig1.txt /tmp/sig2.txt
echo "Complete!"