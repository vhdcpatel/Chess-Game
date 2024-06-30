import { render } from "../../../../vitest.setup";
import Square from "../../../components/square/Square";
import { charToNum } from "../../../utils/charToNum";
import styles from '../../../components/square/Square.module.css';
import { Mock } from "vitest";

vi.mock('../../../utils/charToNum', () => ({
  charToNum: vi.fn(),
}));


describe('Square component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    (charToNum as Mock).mockReturnValue(1); 
    const { getByText } = render(<Square rank="A" file="1" />);
    expect(getByText('A1')).toBeInTheDocument();
  });

  it('should apply light class for light squares', () => {
    (charToNum as Mock).mockReturnValue(1);
    const { container } = render(<Square rank="A" file="8" />);
    expect(container.firstChild).toHaveClass(styles.light);
    expect(container.firstChild).toHaveClass(styles.square);
  });

  it('should apply dark class for dark squares', () => {
    (charToNum as Mock).mockReturnValue(2); 
    const { container } = render(<Square rank="A" file="2" />);
    expect(container.firstChild).toHaveClass(styles.dark);
    expect(container.firstChild).toHaveClass(styles.square);
  });
});