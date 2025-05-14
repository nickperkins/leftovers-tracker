# Test and Coverage Gaps Documentation

This file documents the current gaps in test coverage and areas for improvement for both the client (React + Vite) and server (Node.js) projects. Use this as a reference for future work to incrementally improve test quality and coverage.

---

## Client (React + Vite)

### Uncovered or Partially Covered Areas
- **Minor components and utility functions**: Some small presentational components, utility functions in `src/lib/`, and context providers may lack direct tests or have only indirect coverage.
- **Edge cases and error states**: Not all error boundaries, edge cases, or unusual user flows are fully tested (e.g., network failures, invalid form input, permission errors).
- **Accessibility (a11y) checks**: While most major components are tested for accessibility roles, not all a11y scenarios (e.g., keyboard navigation, ARIA attributes) are covered.
- **Integration tests**: There are limited end-to-end or integration tests that span multiple components or simulate real user flows.
- **Mocking and test isolation**: Some tests may rely on real implementations rather than mocks, which could lead to brittle tests or missed edge cases.

### Suggested Next Steps
- Add tests for utility functions in `src/lib/` and context providers in `src/contexts/`.
- Expand tests to cover more error and edge cases, especially for forms and API interactions.
- Add accessibility-focused tests (e.g., using `@testing-library/jest-dom` a11y queries).
- Consider adding integration tests using a tool like Cypress or Playwright.

---

## Server (Node.js)

### Uncovered or Partially Covered Areas
- **Model validation and error handling**: Some model methods and error paths are not fully tested, especially for invalid data or DB failures.
- **GraphQL schema edge cases**: Not all resolver and schema edge cases (e.g., invalid queries, permission errors) are covered.
- **Config and utility modules**: Files in `src/config/` and `src/lib/` may lack direct tests.
- **Integration with external services**: If any, these are not fully mocked or tested.

### Suggested Next Steps
- Add tests for model validation, error handling, and DB failure scenarios.
- Expand resolver and schema tests to cover more edge cases and invalid input.
- Add tests for configuration and utility modules.
- Improve mocking of external dependencies where applicable.

---

## General Notes
- Coverage reports are available in the respective `coverage/` directories and on Codecov (see README badges).
- This file should be updated as new gaps are identified or closed.

_Last updated: 2025-05-14_
