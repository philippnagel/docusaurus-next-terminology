# TODO - Docusaurus Next Terminology

## Critical Issues

### Type Safety

- [ ] **Fix ITerm interface** - Add missing properties used throughout codebase
  - Add `id: string`
  - Add `filepath: string`
  - Add `content: string`
  - Add `type: string`
  - Location: `src/types.ts`

- [ ] **Remove Array prototype pollution** - Replace `Array.prototype.diff` with utility function
  - Create standalone `arrayDiff<T>(arr: T[], exclude: T[]): T[]` function
  - Update all usages in `src/lib.ts`
  - Remove global Array interface extension

- [ ] **Enable strict TypeScript mode** - Update `tsconfig.json`
  - Set `"strict": true`
  - Set `"strictNullChecks": true`
  - Fix all resulting type errors

### Error Handling

- [ ] **Fix empty error handler** in `getFiles()` function
  - Location: `src/lib.ts` line ~45
  - Either implement proper error handling or remove `noThrow` parameter

- [ ] **Add proper error typing** throughout codebase
  - Use `NodeJS.ErrnoException` for file system errors
  - Replace `any` type in catch blocks
  - Example location: `src/lib.ts` in `preloadTerms()`

- [ ] **Remove unnecessary type assertions**
  - Location: `src/commands/glossary.ts` line ~44
  - `getGlossaryTerm()` already returns string

## Code Quality Improvements

### Type Definitions

- [ ] **Replace `any[]` types with proper types**
  - `getFiles()` should return `string[]` or `FilePath[]`
  - `preloadTerms()` should accept and return `ITerm[]`
  - `sortFiles()` should accept `ITerm[]`
  - `cleanGlossaryTerms()` should accept and return `ITerm[]`
  - `filterTypeTerms()` should accept and return `ITerm[]`

- [ ] **Create type aliases for clarity**
  ```typescript
  type FilePath = string;
  type TermId = string;
  type MarkdownContent = string;
  ```

- [ ] **Fix IFrontmatterGlossary interface** - Make it consistent with ITerm
  - Location: `src/lib.ts`

### Function Improvements

- [ ] **Remove unused parameter** in `getRelativePath()`
  - First parameter `_: string` is never used
  - Location: `src/lib.ts`

- [ ] **Extract magic strings to constants**
  - Import statement template in `addJSImportStatement()`
  - Component template in `parser.ts`
  - Glossary header in `src/lib.ts`

- [ ] **Add JSDoc comments** to all exported functions
  - Document parameters, return types, and behavior
  - Add usage examples where helpful

### Refactoring

- [ ] **Create template builder functions**
  - `buildTermComponent(text, hoverText, reference, displayType)`
  - `buildImportStatement()`
  - Location: Extract from `src/commands/parser.ts`

- [ ] **Consolidate file reading logic**
  - Multiple places read files with similar error handling
  - Create reusable `readFileContent(path: string): Promise<string>`

- [ ] **Improve regex pattern handling**
  - Extract regex creation to named function
  - Add validation for pattern separator
  - Location: `src/commands/parser.ts`

## Security

- [ ] **Add input sanitization** for `hoverText` and `glossaryText`
  - Prevent XSS attacks in generated components
  - Escape special characters in user content
  - Location: `src/commands/parser.ts`

- [ ] **Validate file paths** to prevent directory traversal
  - Check that resolved paths stay within expected directories
  - Location: `src/lib.ts` in `getFiles()` and `getRelativePath()`

- [ ] **Add content validation** for frontmatter
  - Validate required fields exist
  - Validate field types match expectations
  - Location: `src/lib.ts` in `preloadTerms()`

## Performance

- [ ] **Implement term caching**
  - Cache parsed terms to avoid re-reading files
  - Invalidate cache when files change
  - Location: `src/lib.ts`

- [ ] **Batch file operations**
  - Use `Promise.all()` for parallel file reads where safe
  - Location: `src/commands/parser.ts` and `glossary.ts`

- [ ] **Consider streaming for large files**
  - Evaluate if streaming would benefit large documentation sets
  - Location: `src/lib.ts`

## Testing

- [ ] **Add TypeScript tests**
  - Convert `__tests__/parser.test.js` to TypeScript
  - Add type checking to test suite

- [ ] **Increase test coverage**
  - Add tests for error conditions
  - Add tests for edge cases (empty files, missing frontmatter)
  - Add tests for new utility functions

- [ ] **Add integration tests**
  - Test full parse workflow
  - Test full glossary generation workflow
  - Test with various Docusaurus configurations

- [ ] **Add tests for display type feature**
  - Test tooltip mode
  - Test popover mode
  - Test fallback to default

## Documentation

- [ ] **Add JSDoc comments** to all public APIs
  - Include `@param`, `@returns`, `@throws` tags
  - Add usage examples

- [ ] **Document frontmatter schema**
  - Create schema documentation for term files
  - List required vs optional fields
  - Add examples

- [ ] **Create migration guide**
  - Document differences from original package
  - Provide upgrade instructions
  - List breaking changes

- [ ] **Add troubleshooting section** to README
  - Common errors and solutions
  - Debug mode usage
  - FAQ section

- [ ] **Document the `displayType` feature** more prominently
  - Add visual examples
  - Explain use cases for tooltip vs popover

## Configuration

- [ ] **Add schema validation** for plugin options
  - Use Zod or similar for runtime validation
  - Provide helpful error messages
  - Location: `src/validator.ts`

- [ ] **Improve validator error messages**
  - Make messages more actionable
  - Include examples of correct configuration
  - Location: `src/validator.ts`

## Build & Tooling

- [ ] **Review ESLint configuration**
  - Ensure TypeScript rules are properly configured
  - Add rules for common pitfalls
  - Location: `.eslintrc.cjs`

- [ ] **Add pre-commit hooks**
  - Run linting and type checking
  - Run tests
  - Consider using Husky

- [ ] **Update dependencies**
  - Review Renovate configuration
  - Ensure all dependencies are up to date
  - Check for security vulnerabilities

## Nice to Have

- [ ] **Add progress indicators** for long operations
  - Show progress when parsing many files
  - Location: `src/commands/parser.ts` and `glossary.ts`

- [ ] **Add verbose logging option**
  - Expand on existing `debug` option
  - Add different log levels
  - Use proper logging library

- [ ] **Support for term aliases**
  - Allow multiple IDs to reference same term
  - Update parser to handle aliases

- [ ] **Add term validation command**
  - Check for broken references
  - Check for missing required fields
  - Report unused terms

- [ ] **Generate TypeScript definitions** for term frontmatter
  - Help users with IDE autocomplete
  - Validate frontmatter at build time

## Future Enhancements

- [ ] **Support for term categories/tags**
  - Allow filtering glossary by category
  - Generate multiple glossary pages

- [ ] **Add term usage statistics**
  - Report which terms are most/least used
  - Identify orphaned terms

- [ ] **Support for term relationships**
  - Related terms
  - Parent/child term hierarchies

- [ ] **Internationalization support**
  - Multi-language terms
  - Localized hover text

---

## Priority Legend

**Critical Issues** - Should be addressed immediately
**Code Quality Improvements** - Important for maintainability
**Security** - Important for production use
**Performance** - Optimize as needed
**Testing** - Improve confidence in changes
**Documentation** - Help users and contributors
**Nice to Have** - Quality of life improvements
**Future Enhancements** - Long-term roadmap items