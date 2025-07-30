import { render, screen } from "@testing-library/react";
import PageNotFound from "../../../components/uxComponents/pageNotFound/PageNotFound"

describe("Should render PageNotFound component", () => {
  it("should render the current message",() => {
    render(<PageNotFound/>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("404: Sorry, page you are looking for is not available. 🙇")).toBeInTheDocument();
  })
})