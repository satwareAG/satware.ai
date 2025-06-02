# satware AG Benutzerkürzel Redirect System

## Overview

This document describes the implementation of the satware AG Benutzerkürzel (user abbreviation) system for the satware.ai website. The system provides short URL redirects for all team members following company-wide naming conventions.

## Implementation Details

### Core Rules

1. **Minimum Length**: At least 2 characters, ideally 2 characters
2. **Formation**: **V**orname + **N**achname (First name + Last name)
3. **Collision-Free**: Each abbreviation must be unique company-wide
4. **Case**: Uppercase (Versalien) in normal use, lowercase in wiki/web context
5. **Maximum Length**: 3 characters maximum (Amicron compatibility)

### Collision Resolution

When abbreviations collide, the following resolution order is applied:

1. **Standard**: First letter of first name + first letter of last name
2. **Second letter of last name**: VN → VNA
3. **Second letter of first name**: VN → VON
4. **Middle name inclusion**: First name + Middle name + Last name → VMN

## Current Team Member Abbreviations

| Kürzel | Name | Target URL | Notes |
|--------|------|------------|-------|
| **AA** | Amira Alesi | `/team/amira.html` | Standard |
| **BA** | Bastian Alesi | `/team/bastian.html` | Standard |
| **BEA** | Bea Alesi | `/team/bea.html` | Collision resolved (BA taken) |
| **DA** | Denopus Alesi | `/team/denopus.html` | Standard |
| **GA** | Gunta Alesi | `/team/gunta.html` | Standard |
| **JA** | Jane Alesi | `/team/jane.html` | Standard |
| **JOA** | John Alesi | `/team/john.html` | Collision resolved (JA taken) |
| **JUA** | Justus Alesi | `/team/justus.html` | Collision resolved (JA/JOA taken) |
| **LA** | Lara Alesi | `/team/lara.html` | Standard |
| **LEA** | Lenna Alesi | `/team/lenna.html` | Collision resolved (LA taken) |
| **LEO** | Leon Alesi | `/team/leon.html` | Collision resolved (LA/LEA taken) |
| **LUA** | Luna Alesi | `/team/luna.html` | Collision resolved (LA/LEA/LEO taken) |
| **MA** | Marco Alesi | `/team/marco.html` | Standard |
| **OA** | Olu Alesi | `/team/olu.html` | Standard |
| **TA** | Theo Alesi | `/team/theo.html` | Standard |
| **WA** | Wolfgang Alesi | `/team/wolfgang.html` | Standard |

## Technical Implementation

### MkDocs Redirects Plugin

The redirects are implemented using the `mkdocs-redirects` plugin in `mkdocs.yml`:

```yaml
plugins:
  - redirects:
      redirect_maps:
        # Examples
        'ja.md': 'team/jane.md'
        'ja/index.md': 'team/jane.md'
        'joa.md': 'team/john.md'
        'joa/index.md': 'team/john.md'
        # ... (see mkdocs.yml for complete list)
```

### URL Patterns Supported

For each team member, the following URL patterns are supported:

1. **Direct**: `https://satware.ai/{kürzel}` → `https://satware.ai/team/{name}.html`
2. **Index**: `https://satware.ai/{kürzel}/` → `https://satware.ai/team/{name}.html`
3. **Explicit**: `https://satware.ai/{kürzel}/index.html` → `https://satware.ai/team/{name}.html`

### Examples

- `https://satware.ai/ja` → `https://satware.ai/team/jane.html`
- `https://satware.ai/joa` → `https://satware.ai/team/john.html`
- `https://satware.ai/bea` → `https://satware.ai/team/bea.html`

## Fallback System

In addition to the mkdocs-redirects plugin, a fallback redirect page is created at `docs/ja.md` with:

1. **Meta refresh**: `<meta http-equiv="refresh" content="0; url=/team/jane.html">`
2. **JavaScript redirect**: `window.location.href = '/team/jane.html';`
3. **Manual link**: User-clickable link as final fallback

## Testing the Redirects

### Local Development

1. Start the development server:
   ```bash
   ./mkdocs.sh
   ```

2. Test redirect URLs:
   ```bash
   curl -I http://localhost:8000/ja
   curl -I http://localhost:8000/joa
   curl -I http://localhost:8000/bea
   ```

3. Verify redirect status codes (302 or 301) and target locations

### Production Testing

After deployment, test the live redirects:

```bash
curl -I https://satware.ai/ja
curl -I https://satware.ai/joa
curl -I https://satware.ai/bea
```

## Adding New Team Members

When adding new team members:

1. **Determine Kürzel**: Follow collision resolution rules
2. **Update mkdocs.yml**: Add redirect mappings
3. **Document**: Update this file with new abbreviation
4. **Test**: Verify redirects work in development and production

### New Member Example

For a new member "Max Weber":
1. **Initial**: MW
2. **Check collisions**: If MW exists, use MWE or MAW
3. **Add to mkdocs.yml**:
   ```yaml
   'mw.md': 'team/max-weber.md'
   'mw/index.md': 'team/max-weber.md'
   ```

## Troubleshooting

### Common Issues

1. **404 Errors**: Verify target team page exists
2. **Redirect Loops**: Check for circular redirects in configuration
3. **Cache Issues**: Clear browser cache or test in private/incognito mode
4. **Case Sensitivity**: Ensure lowercase in redirect mappings

### Debug Steps

1. **Check Plugin Installation**: Verify `mkdocs-redirects` in Docker image
2. **Validate YAML**: Ensure proper YAML syntax in mkdocs.yml
3. **Build Locally**: Run `mkdocs build` to check for errors
4. **Check Generated Files**: Verify redirect HTML files in `site/` directory

## Security Considerations

- All redirect targets are internal to the satware.ai domain
- No external redirect capabilities to prevent abuse
- Redirect mappings are explicitly defined (no dynamic generation)

## Performance Impact

- Minimal impact on build time
- Redirect files are small HTML documents
- SEO-friendly with proper HTTP status codes
- Compatible with CDN caching

## future Enhancements

1. **API Integration**: Automatic abbreviation generation from HR systems
2. **Alternative Mappings**: Support multiple abbreviation formats
3. **Analytics**: Track redirect usage for optimization
4. **Dynamic Updates**: Automated updates when team changes occur

---

**Last Updated**: 2025-06-02  
**Version**: 1.0  
**Author**: Jane Alesi (JA)  
**Status**: Production Ready