import { render, RenderResult } from "@testing-library/react"
import Loader from "../../../components/uxComponents/loader/Loader"
import styles from "../../../components/uxComponents/loader/Loader.module.css"

describe("Loader component should render correctly", () => {
  let screen: RenderResult; 

  beforeEach(() => {
    screen = render(<Loader />);
  });

  it("should render the loader progressbar", () => {
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should render the logo with alt text 'Chess Logo'", () => {
    const image = screen.getByRole("img", {name : /chess logo/i});
    expect(image).toBeInTheDocument();
  });

  it("should have the logo image with correct CSS class", () => {
    const img = screen.getByRole("img", { name: /chess logo/i });
    expect(img).toHaveClass(styles.logoImg);
  });
})