#!/usr/bin/env bash
# AI-SLOP-Detector UI Audit Runner
# Automatically scans UI and frontend source code for AI-generated slop, stubs, and code smells.

set -euo pipefail

TARGET_DIR="${1:-src}"

# Find slop-detector binary
SLOP_BIN=""
if command -v slop-detector >/dev/null 2>&1; then
    SLOP_BIN="slop-detector"
elif [ -x "$HOME/Library/Python/3.9/bin/slop-detector" ]; then
    SLOP_BIN="$HOME/Library/Python/3.9/bin/slop-detector"
elif [ -x "$HOME/.local/bin/slop-detector" ]; then
    SLOP_BIN="$HOME/.local/bin/slop-detector"
else
    # Fallback to python3 module
    SLOP_BIN="python3 -m ai_slop_detector.cli"
fi

echo "========================================================"
echo "  AI-SLOP-DETECTOR: Auditing UI Codebase at '${TARGET_DIR}'"
echo "========================================================"

CONFIG_FLAG=""
if [ -f ".slopconfig.yaml" ]; then
    CONFIG_FLAG="-c .slopconfig.yaml"
fi

# Run scan on project with JS/TS AST support
$SLOP_BIN --project "${TARGET_DIR}" --js ${CONFIG_FLAG}

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ [PASS] UI codebase passed anti-slop audit with zero critical deficits!"
else
    echo ""
    echo "❌ [FAIL] AI slop detected! Resolve flagged stubs or deficits before proceeding."
fi

exit $EXIT_CODE
