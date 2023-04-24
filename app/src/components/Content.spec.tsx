import React from 'react';
import { render } from '@testing-library/react';
import MContent from './Content'

describe('MContent component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<MContent>Test content</MContent>);
    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('applies styles correctly', () => {
    const { getByTestId } = render(<MContent>Test content</MContent>);
    const contentElement = getByTestId('content');
    expect(contentElement).toHaveStyle('margin: 0 10%');
    expect(contentElement).toHaveStyle('background: colorBgContainer');
    expect(contentElement).toHaveStyle('borderTop: 2px solid');
    expect(contentElement).toHaveStyle('minHeight: 300px');
  });
});
