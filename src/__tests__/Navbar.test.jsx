import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  test('renders without crashing', () => {
    render(<Navbar />);
  });

  test('displays "Face App" text', () => {
    render(<Navbar />);
    expect(screen.getByText('Face App')).toBeInTheDocument();
  });

  test('renders a container with the "navbar" class', () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('.navbar')).toBeInTheDocument();
  });
});