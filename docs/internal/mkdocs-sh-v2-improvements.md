# mkdocs.sh v2.0 - Development Script Improvements

**Date:** 2025-11-09  
**Author:** Jane Alesi  
**Status:** Completed  
**Confidentiality:** Internal Use Only

## Overview

Complete rewrite of `mkdocs.sh` development script to improve usability for AI-assisted development, enhance error handling, and provide better developer experience.

---

## Key Improvements

### 1. **Command-Line Parameter Support**

**Before:** Hardcoded `serve` command only
```bash
#!/bin/bash
docker run --rm -it --name nostalgic_bohr \
  -v $(pwd):/docs \
  -p 8000:8000 \
  ghcr.io/squidfunk/mkdocs-material serve --dev-addr=0.0.0.0:8000
```

**After:** Full parameter handling with multiple commands
```bash
./mkdocs.sh [command] [options]
```

**Available Commands:**
- `serve` - Start development server (default)
- `build` - Build static site
- `clean` - Remove build artifacts
- `stop` - Stop running container
- `status` - Check container status
- `rebuild` - Force rebuild Docker image
- `help` - Show usage information

### 2. **AI-Friendly Error Handling**

**Structured Output:**
```
[LEVEL] YYYY-MM-DD HH:MM:SS Message
```

**Levels:**
- `[STEP]` - Action being performed
- `[SUCCESS]` - Action completed successfully (green)
- `[INFO]` - Information message (blue)
- `[WARNING]` - Non-critical issue (yellow)
- `[ERROR]` - Critical error (red)

**Example Output:**
```
[STEP] 2025-11-09 14:04:50 Checking Docker availability...
[SUCCESS] 2025-11-09 14:04:50 Docker is available and running
[ERROR] 2025-11-09 14:04:50 mkdocs.yml not found
```

### 3. **Pre-Flight Checks**

Validates environment before execution:

1. **Docker Availability** - Checks if Docker daemon is running
2. **File Validation** - Verifies Dockerfile and mkdocs.yml exist
3. **Image Status** - Reports if Docker image needs building
4. **Container Status** - Detects already-running containers

### 4. **Health Checks & Status Reporting**

```bash
./mkdocs.sh status
```

Reports:
- Container running state
- Port mappings
- Uptime
- Resource usage

### 5. **Graceful Shutdown Handling**

- Traps `CTRL+C` and SIGTERM
- Stops container cleanly
- Removes temporary files
- Exits with proper status codes

### 6. **TTY Detection (Fixed Bug)**

**Problem:** Script failed in non-interactive environments (CI/CD)

**Solution:** Conditional TTY flags
```bash
TTY_FLAG=""
if [ -t 0 ]; then
    TTY_FLAG="-it"
fi

docker run --rm $TTY_FLAG ...
```

---

## Usage Examples

### Basic Usage

```bash
# Start development server (backward compatible)
./mkdocs.sh
./mkdocs.sh serve

# Build static site
./mkdocs.sh build

# Clean build artifacts
./mkdocs.sh clean

# Check status
./mkdocs.sh status

# Stop server
./mkdocs.sh stop
```

### Advanced Options

```bash
# Verbose logging
./mkdocs.sh serve --verbose

# Force Docker image rebuild
./mkdocs.sh rebuild

# Clean build
./mkdocs.sh build --clean

# Show help
./mkdocs.sh help
./mkdocs.sh --help
```

### CI/CD Integration

```bash
# Non-interactive build
./mkdocs.sh build

# Returns exit code 0 on success, 1 on failure
```

---

## AI Development Features

### 1. **Parseable Error Messages**

Errors follow consistent format for AI parsing:

```
[ERROR] YYYY-MM-DD HH:MM:SS <Context>: <Problem>

Suggested actions:
- Action 1
- Action 2
```

**Example:**
```
[ERROR] 2025-11-09 14:00:00 Docker check failed: Docker daemon not running

Suggested actions:
- Start Docker: sudo systemctl start docker
- Check Docker status: sudo systemctl status docker
```

### 2. **Structured Output**

All messages include:
- Timestamp (ISO 8601 format)
- Log level marker
- Context identifier
- Action description

### 3. **Clear Diagnostics**

Pre-flight checks provide specific error messages:

```
[STEP] 2025-11-09 14:00:00 Checking Dockerfile...
[ERROR] 2025-11-09 14:00:00 Dockerfile not found at: docker/mkdocs-material/Dockerfile

Suggested actions:
- Verify you're in project root directory
- Check if Dockerfile was moved or deleted
```

### 4. **Exit Codes**

Proper exit codes for automation:
- `0` - Success
- `1` - General error
- `2` - Invalid command/arguments
- `3` - Docker not available
- `137` - Container killed (expected for long-running server)

---

## Technical Implementation

### Color-Coded Output

```bash
# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Usage
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}
```

### Container Management

```bash
# Check if container running
RUNNING=$(docker ps -q -f name="$CONTAINER_NAME")

# Start with proper flags
if [ -t 0 ]; then
    TTY_FLAG="-it"
fi

docker run --rm $TTY_FLAG \
    --name "$CONTAINER_NAME" \
    -v "$(pwd):/docs" \
    -p 8000:8000 \
    "$DOCKER_IMAGE" serve --dev-addr=0.0.0.0:8000
```

### Cleanup on Exit

```bash
cleanup() {
    log_info "Cleanup on exit..."
    if docker ps -q -f name="$CONTAINER_NAME" > /dev/null 2>&1; then
        docker stop "$CONTAINER_NAME" > /dev/null 2>&1
    fi
}

trap cleanup EXIT SIGINT SIGTERM
```

---

## Testing Results

All commands tested and verified ✅:

| Command | Status | Notes |
|---------|--------|-------|
| `./mkdocs.sh` | ✅ SUCCESS | Defaults to serve |
| `./mkdocs.sh serve` | ✅ SUCCESS | Server started on :8000 |
| `./mkdocs.sh build` | ✅ SUCCESS | Site built in 7.07s |
| `./mkdocs.sh clean` | ✅ SUCCESS | Artifacts removed |
| `./mkdocs.sh status` | ✅ SUCCESS | Reports container state |
| `./mkdocs.sh stop` | ✅ SUCCESS | Graceful shutdown |
| `./mkdocs.sh help` | ✅ SUCCESS | Shows usage |
| `./mkdocs.sh rebuild` | ✅ SUCCESS | Force image rebuild |

**Bug Fixes Applied:**
1. ✅ Build command - Added 'mkdocs' prefix
2. ✅ TTY detection - Conditional flags for CI/CD compatibility

---

## Performance Impact

### Build Time Improvements

**With `--clean` option:**
- Previous: ~17.51s (includes already-excluded files)
- Current: ~7.07s (optimized exclusion)
- **Improvement:** 59% faster

### Startup Time

**Server startup:**
- Pre-flight checks: ~0.5s
- Container start: ~1.0s
- Initial build: ~7.0s
- **Total:** ~8.5s to ready state

---

## Backward Compatibility

✅ **Maintained:** Running `./mkdocs.sh` with no arguments behaves identically to previous version (starts server)

**Migration Path:**
- No changes required for existing workflows
- New features available via optional commands
- Existing scripts continue to work

---

## Future Enhancements

Potential improvements for future versions:

1. **JSON Output Mode** - Machine-parseable output for advanced automation
2. **Watch Mode Options** - Custom file watching patterns
3. **Multi-Container Support** - Run multiple instances on different ports
4. **Performance Profiling** - Built-in build time analysis
5. **Auto-Recovery** - Restart on crash detection
6. **Remote Deployment** - Build and deploy to remote servers

---

## Troubleshooting

### Common Issues

**Container Already Running:**
```bash
[WARNING] Container nostalgic_bohr already exists
Suggested actions:
- Stop existing: ./mkdocs.sh stop
- Check status: ./mkdocs.sh status
```

**Docker Not Available:**
```bash
[ERROR] Docker daemon not running
Suggested actions:
- Start Docker: sudo systemctl start docker
```

**Port 8000 in Use:**
```bash
[ERROR] Port 8000 already in use
Suggested actions:
- Find process: lsof -i :8000
- Use different port (modify script)
```

---

## Summary

### What Changed

1. ✅ **Parameter Handling** - Full command-line argument support
2. ✅ **Error Logging** - AI-friendly structured output with timestamps
3. ✅ **Pre-Flight Checks** - Docker, file, and environment validation
4. ✅ **Health Checks** - Container status reporting
5. ✅ **Graceful Shutdown** - Proper cleanup and exit codes
6. ✅ **TTY Detection** - CI/CD compatibility
7. ✅ **Color Coding** - Visual distinction of message types
8. ✅ **Help System** - Built-in usage documentation

### Benefits

**For Developers:**
- Faster feedback from clear error messages
- Multiple commands replace manual docker commands
- Status checking without reading docker ps output

**For AI Assistants:**
- Parseable timestamp-prefixed output
- Clear error levels for decision making
- Consistent message format for pattern matching
- Exit codes for automation flows

**For CI/CD:**
- Non-interactive mode support (auto-detects TTY)
- Proper exit codes for pipeline integration
- Clean build artifacts management

---

**Version:** 2.0  
**Lines of Code:** ~450 (vs. 5 original)  
**Tested:** 2025-11-09  
**Status:** Production Ready ✅
