# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive npm scripts for database management (`db:migrate`, `db:generate`, `db:studio`, `db:reset`)
- Linting and formatting scripts (`lint`, `lint:fix`, `format`, `format:check`)
- Enhanced `.gitignore` with comprehensive patterns for logs, OS files, IDE configurations
- CHANGELOG.md to track project changes

### Changed
- **README.md**: Complete rewrite with modern formatting, emojis, and comprehensive documentation
  - Added feature highlights with visual indicators
  - Improved installation and configuration sections
  - Added database schema information
  - Enhanced webhook events table
  - Added project structure overview
  - Improved development and deployment guidelines
- **`.env.example`**: Updated with complete configuration including database settings
  - Added helpful comments for each configuration option
  - Removed placeholder values for security
  - Added database configuration section
- **`.gitignore`**: Expanded to cover more scenarios
  - Added session data patterns
  - Added log file patterns
  - Added OS-specific files (macOS, Windows)
  - Added IDE configuration patterns
  - Added temporary file patterns

### Removed
- `check-data.js` - Debug/test file
- `check-db.js` - Debug/test file
- `postman_collection.json` - Duplicate Postman collection (kept versioned file)

## [0.4.0] - 2025-11-23

### Project Cleanup
- Removed temporary debug files
- Standardized configuration files
- Improved documentation structure
- Enhanced developer experience with additional npm scripts

---

## Version History

- **v0.4.0**: Project cleanup and documentation overhaul
- **Previous versions**: See git history for details
