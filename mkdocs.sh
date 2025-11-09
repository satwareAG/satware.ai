#!/bin/bash
# mkdocs.sh - Enhanced MkDocs development server script
# Improved for AI development with better error handling and logging
# Version: 2.0 (2025-11-09)

set -o pipefail  # Exit on pipe failures

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_NAME=$(basename "$0")
CONTAINER_NAME="nostalgic_bohr"
DOCKER_IMAGE="squidfunk/mkdocs-material-custom"
DOCKER_BUILD_CONTEXT="${PWD}/docker/mkdocs-material"
HOST_PORT=8000
CONTAINER_PORT=8000

# ============================================================================
# COLOR CODES FOR OUTPUT
# ============================================================================

if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    GRAY='\033[0;90m'
    NC='\033[0m' # No Color
else
    # No colors in non-terminal (CI/CD)
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    CYAN=''
    GRAY=''
    NC=''
fi

# ============================================================================
# LOGGING FUNCTIONS
# ============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*" >&2
}

log_debug() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${GRAY}[DEBUG]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"
    fi
}

log_step() {
    echo -e "${CYAN}[STEP]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"
}

# ============================================================================
# HELP DOCUMENTATION
# ============================================================================

show_help() {
    cat << EOF
${CYAN}MkDocs Development Server Script${NC}
${GRAY}Enhanced for AI development with improved error handling${NC}

${YELLOW}USAGE:${NC}
    $SCRIPT_NAME [COMMAND] [OPTIONS]

${YELLOW}COMMANDS:${NC}
    serve       Start development server (default)
    build       Build static site to site/ directory
    clean       Remove cache and build artifacts
    rebuild     Clean + build
    status      Show container status
    logs        Show container logs
    stop        Stop running container
    help        Show this help message

${YELLOW}OPTIONS:${NC}
    --verbose, -v       Enable verbose logging
    --no-cache         Don't use Docker build cache
    --port PORT        Use custom port (default: 8000)
    --clean            Clean before serve/build
    --force            Force rebuild Docker image

${YELLOW}EXAMPLES:${NC}
    $SCRIPT_NAME                    # Start server (default)
    $SCRIPT_NAME serve --verbose    # Start with verbose logging
    $SCRIPT_NAME build --clean      # Clean build
    $SCRIPT_NAME rebuild            # Clean + rebuild
    $SCRIPT_NAME logs               # View container logs
    $SCRIPT_NAME status             # Check container status

${YELLOW}EXIT CODES:${NC}
    0  Success
    1  Docker not running
    2  Docker build failed
    3  Container start failed
    4  Invalid arguments
    5  Container not found

${YELLOW}DEVELOPMENT:${NC}
    Server URL:    http://localhost:$HOST_PORT
    Container:     $CONTAINER_NAME
    Docker Image:  $DOCKER_IMAGE

EOF
}

# ============================================================================
# PRE-FLIGHT CHECKS
# ============================================================================

check_docker() {
    log_step "Checking Docker availability..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker command not found"
        log_error "Please install Docker: https://docs.docker.com/get-docker/"
        return 1
    fi
    log_debug "Docker command found"
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon not running"
        log_error "Please start Docker and try again"
        log_error "Run: sudo systemctl start docker"
        return 1
    fi
    log_debug "Docker daemon is running"
    
    log_success "Docker is available and running"
    return 0
}

check_dockerfile() {
    log_step "Checking Dockerfile..."
    
    if [[ ! -f "$DOCKER_BUILD_CONTEXT/Dockerfile" ]]; then
        log_error "Dockerfile not found at: $DOCKER_BUILD_CONTEXT/Dockerfile"
        return 1
    fi
    log_debug "Dockerfile found at $DOCKER_BUILD_CONTEXT"
    
    log_success "Dockerfile validation passed"
    return 0
}

check_mkdocs_yml() {
    log_step "Checking mkdocs.yml..."
    
    if [[ ! -f "mkdocs.yml" ]]; then
        log_error "mkdocs.yml not found in current directory"
        log_error "Are you in the project root?"
        return 1
    fi
    log_debug "mkdocs.yml found"
    
    log_success "mkdocs.yml validation passed"
    return 0
}

# ============================================================================
# DOCKER OPERATIONS
# ============================================================================

build_docker_image() {
    local no_cache=""
    if [[ "$NO_CACHE" == "true" ]]; then
        no_cache="--no-cache"
        log_info "Building without cache..."
    fi
    
    log_step "Building custom Docker image..."
    log_debug "Build context: $DOCKER_BUILD_CONTEXT"
    log_debug "Image tag: $DOCKER_IMAGE"
    
    if docker build $no_cache -t "$DOCKER_IMAGE" "$DOCKER_BUILD_CONTEXT"; then
        log_success "Docker image built successfully"
        return 0
    else
        log_error "Docker image build failed"
        log_error "Check the Dockerfile at: $DOCKER_BUILD_CONTEXT/Dockerfile"
        return 2
    fi
}

check_or_build_image() {
    if docker image inspect "$DOCKER_IMAGE" &> /dev/null; then
        if [[ "$FORCE_REBUILD" == "true" ]]; then
            log_info "Force rebuild requested, rebuilding image..."
            build_docker_image || return $?
        else
            log_info "Docker image already exists (use --force to rebuild)"
        fi
    else
        log_info "Docker image not found, building..."
        build_docker_image || return $?
    fi
    return 0
}

stop_container() {
    log_step "Checking for running container..."
    
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        log_info "Stopping container: $CONTAINER_NAME"
        docker stop "$CONTAINER_NAME" &> /dev/null
        log_success "Container stopped"
    else
        log_debug "No running container found"
    fi
    
    # Remove if exists (even if not running)
    if docker ps -a -q -f name="$CONTAINER_NAME" | grep -q .; then
        log_debug "Removing stopped container: $CONTAINER_NAME"
        docker rm "$CONTAINER_NAME" &> /dev/null
    fi
}

show_container_status() {
    log_step "Container status for: $CONTAINER_NAME"
    
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        echo -e "${GREEN}● Running${NC}"
        docker ps -f name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        return 0
    elif docker ps -a -q -f name="$CONTAINER_NAME" | grep -q .; then
        echo -e "${RED}● Stopped${NC}"
        docker ps -a -f name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}"
        return 0
    else
        echo -e "${GRAY}● Not found${NC}"
        return 5
    fi
}

show_container_logs() {
    log_step "Fetching container logs..."
    
    if ! docker ps -a -q -f name="$CONTAINER_NAME" | grep -q .; then
        log_error "Container not found: $CONTAINER_NAME"
        return 5
    fi
    
    log_info "Showing logs for: $CONTAINER_NAME"
    echo -e "${GRAY}----------------------------------------${NC}"
    docker logs "$CONTAINER_NAME"
    echo -e "${GRAY}----------------------------------------${NC}"
}

# ============================================================================
# CLEANUP OPERATIONS
# ============================================================================

clean_cache() {
    log_step "Cleaning cache and build artifacts..."
    
    if [[ -d ".cache" ]]; then
        log_debug "Removing .cache directory..."
        rm -rf .cache
        log_success "Removed .cache/"
    fi
    
    if [[ -d "site" ]]; then
        log_debug "Removing site directory..."
        rm -rf site
        log_success "Removed site/"
    fi
    
    log_success "Cleanup complete"
}

# ============================================================================
# MKDOCS OPERATIONS
# ============================================================================

run_mkdocs_serve() {
    log_step "Starting MkDocs development server..."
    
    # Stop any existing container
    stop_container
    
    # Ensure image is built
    check_or_build_image || return $?
    
    # Optional clean
    if [[ "$CLEAN_FIRST" == "true" ]]; then
        clean_cache
    fi
    
    log_info "Starting container: $CONTAINER_NAME"
    log_info "Server will be available at: ${CYAN}http://localhost:$HOST_PORT${NC}"
    log_info "Press Ctrl+C to stop"
    echo ""
    
    # Determine TTY flags based on terminal availability
    local tty_flags="-i"
    if [[ -t 0 ]]; then
        tty_flags="-it"
        log_debug "TTY detected, using interactive mode"
    else
        log_debug "No TTY, using non-interactive mode"
    fi
    
    # Create container with SCSS compilation and watcher
    docker run --rm $tty_flags --name "$CONTAINER_NAME" \
        --user "$(id -u):$(id -g)" \
        -p "$HOST_PORT:$CONTAINER_PORT" \
        -v "${PWD}:/docs" \
        --entrypoint sh \
        "$DOCKER_IMAGE" \
        -c "
            echo '${CYAN}[SCSS]${NC} Performing initial compilation...' && \
            mkdir -p docs/assets/css && \
            pysassc overrides/assets/css/custom.scss docs/assets/css/custom.css && \
            echo '${GREEN}[SCSS]${NC} Initial compilation complete' && \
            echo '${CYAN}[SCSS]${NC} Starting watcher...' && \
            python /docs/scss_watcher.py & \
            echo '${GREEN}[SCSS]${NC} Watcher started' && \
            echo '${CYAN}[MKDOCS]${NC} Starting server on 0.0.0.0:$CONTAINER_PORT...' && \
            mkdocs serve --dev-addr=0.0.0.0:$CONTAINER_PORT --watch overrides --watch docs --watch mkdocs.yml
        "
    
    # Container stopped
    local exit_code=$?
    echo ""
    if [[ $exit_code -eq 0 ]] || [[ $exit_code -eq 130 ]]; then
        log_success "Server stopped gracefully"
    else
        log_error "Server exited with code: $exit_code"
        return 3
    fi
}

run_mkdocs_build() {
    log_step "Building MkDocs site..."
    
    # Ensure image is built
    check_or_build_image || return $?
    
    # Optional clean
    if [[ "$CLEAN_FIRST" == "true" ]]; then
        clean_cache
    fi
    
    log_info "Building site to site/ directory..."
    
    # Run build in Docker
    if docker run --rm \
        --user "$(id -u):$(id -g)" \
        -v "${PWD}:/docs" \
        "$DOCKER_IMAGE" \
        mkdocs build --clean; then
        
        log_success "Build complete!"
        log_info "Site generated in: ${CYAN}site/${NC}"
        
        # Show build stats
        if [[ -d "site" ]]; then
            local file_count=$(find site -type f | wc -l)
            local dir_size=$(du -sh site | cut -f1)
            log_info "Generated $file_count files ($dir_size)"
        fi
        
        return 0
    else
        log_error "Build failed"
        log_error "Check mkdocs.yml configuration and docs/ content"
        return 2
    fi
}

# ============================================================================
# ARGUMENT PARSING
# ============================================================================

COMMAND="serve"
VERBOSE="false"
NO_CACHE="false"
CLEAN_FIRST="false"
FORCE_REBUILD="false"

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            serve|build|clean|rebuild|status|logs|stop|help)
                COMMAND=$1
                shift
                ;;
            --verbose|-v)
                VERBOSE="true"
                shift
                ;;
            --no-cache)
                NO_CACHE="true"
                shift
                ;;
            --port)
                HOST_PORT="$2"
                shift 2
                ;;
            --clean)
                CLEAN_FIRST="true"
                shift
                ;;
            --force)
                FORCE_REBUILD="true"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                log_error "Run '$SCRIPT_NAME help' for usage information"
                return 4
                ;;
        esac
    done
    return 0
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    # Parse command-line arguments
    parse_arguments "$@" || exit $?
    
    # Show help and exit
    if [[ "$COMMAND" == "help" ]]; then
        show_help
        exit 0
    fi
    
    # Banner
    echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  MkDocs Development Server v2.0                      ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  Command: ${YELLOW}$COMMAND${NC}                                        ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Pre-flight checks (skip for status/logs/stop)
    if [[ "$COMMAND" != "status" ]] && [[ "$COMMAND" != "logs" ]] && [[ "$COMMAND" != "stop" ]]; then
        check_docker || exit 1
        check_dockerfile || exit 1
        check_mkdocs_yml || exit 1
        echo ""
    fi
    
    # Execute command
    case $COMMAND in
        serve)
            run_mkdocs_serve
            exit $?
            ;;
        build)
            run_mkdocs_build
            exit $?
            ;;
        clean)
            clean_cache
            exit 0
            ;;
        rebuild)
            clean_cache
            run_mkdocs_build
            exit $?
            ;;
        status)
            show_container_status
            exit $?
            ;;
        logs)
            show_container_logs
            exit $?
            ;;
        stop)
            stop_container
            exit 0
            ;;
        *)
            log_error "Unknown command: $COMMAND"
            exit 4
            ;;
    esac
}

# ============================================================================
# TRAP SIGNALS FOR CLEANUP
# ============================================================================

cleanup_on_exit() {
    echo ""
    log_info "Cleanup on exit..."
}

trap cleanup_on_exit EXIT

# Run main function
main "$@"
