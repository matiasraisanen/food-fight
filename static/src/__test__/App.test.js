import { render, screen } from '@testing-library/react';
import App from '../App';

describe("App", () => {
  test('Renders properly', () => {
    render(<App />);
    const title = screen.getByText(/FOOD FIGHT 2022/i);
    expect(title).toBeInTheDocument();
  });
})