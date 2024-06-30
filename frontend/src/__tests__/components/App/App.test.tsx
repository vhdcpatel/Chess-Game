// App.test.ts
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import styles from '../../../App.module.css';
import App from '../../../App';


// Mock the ChessBoard component
vi.mock('../../../components/chessBoard/ChessBoard', () => ({
  default: () => <div>ChessBoard</div>,
}));

describe('App component', () => {
  it('renders correctly', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toHaveClass(styles.mainOuterCtn);
  });

  it('renders ChessBoard component', () => {
    const { getByText } = render(<App />);
    expect(getByText('ChessBoard')).toBeInTheDocument();
  });
});
