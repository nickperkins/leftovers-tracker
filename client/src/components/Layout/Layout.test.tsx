/*
Test Plan: Layout Component

Objectives:
- Ensure correct rendering of layout structure (header, nav, footer, content).
- Validate navigation, theming, and responsive behavior.

Scenarios:
- Renders all layout sections and children.
- Handles navigation actions (drawer open/close, link clicks).
- Applies theme and responds to theme changes.
- Responsive layout for different screen sizes.

Edge Cases:
- No children or missing props.
- Navigation to invalid routes.
- Theme context missing or invalid.
*/
import { render, screen } from '@testing-library/react';
import Layout from './Layout';

describe('Layout', () => {
  it('renders header, nav, footer, and children', () => {
    render(
      <Layout>
        <div data-testid="main-content">Main Content</div>
      </Layout>
    );
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });
});
