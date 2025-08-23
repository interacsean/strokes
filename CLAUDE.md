# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Strokes is a React TypeScript golf stroke tracking application that tracks strokes on the golf course and provides statistics and caddy-like recommendations based on previous play. It uses Create React App, Recoil for state management, and Chakra UI for components.

## Common Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint and fix code
npm run lint:fix

# Format code with Prettier
npm run format

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### State Management
- **Recoil atoms** manage application state (`src/state/`)
- `courseState.ts` handles current course and hole data
- `roundsState.ts` manages historical round data
- State persists to localStorage via custom persistence effects

### Directory Structure
- **`src/model/`** - Domain models (Course, Hole, Stroke, Club, etc.)
- **`src/presenters/`** - UI layer with React components, routes, and theme
- **`src/usecases/`** - Business logic for course, hole, and stroke operations
- **`src/state/`** - Recoil state atoms and selectors
- **`src/data/courses/`** - Static course data files

### Key Patterns

#### Dependency Injection Pattern
Components use HOCs like `withHoleDependencies` to inject dependencies and business logic, keeping view components pure.

#### View/Logic Separation
- `.view.tsx` files contain presentational components
- `withDependencies.tsx` files handle state and business logic
- Index files wire them together

#### Course Data Structure
Courses define holes with tees, pins, and par information. Each hole tracks strokes with position data (lat/lng), club selection, and lie information.

### Testing
Tests use React Testing Library and Jest. Run specific tests with:
```bash
npm test -- --testNamePattern="test name"
```

### Deployment
The app deploys to GitHub Pages at `https://interacsean.github.io/strokes`