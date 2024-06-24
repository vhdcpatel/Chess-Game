import App from "../../App";
import { fireEvent, render, screen } from "../../../vitest.setup";


describe('App Testing', () => {
  it('should not show the text initially', () => {
    render(<App />);
    const button = screen.getByText(/Show/i);
    const text = screen.queryByText(/hello from day1./i);

    expect(text).not.toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });


  it('should have button', () => {
    render(<App/>);
    const buttonTest = screen.getByRole('button'); 
    expect(buttonTest).toBeInTheDocument();
  });

  
  it('should show the text after clicking the button', () => {
    render(<App />);
    const button = screen.getByText(/show/i);

    fireEvent.click(button);
    const text = screen.getByText(/hello from day1./i);

    expect(text).toBeInTheDocument();
    expect(button).toHaveTextContent('Hide');
  });

  it('should hide the text after clicking the button again', () => {
    render(<App />);
    const button = screen.getByText(/show/i);

    // First click to show the text
    fireEvent.click(button);
    let text = screen.getByText(/hello from day1./i);
    expect(text).toBeInTheDocument();

    // Second click to hide the text
    fireEvent.click(button);
    // If we know that the text is not in the document, we can use queryByText instead of getByText
    
    text = screen.queryByText(/hello from day1./i);
    // text = screen.getByText(/hello from day1./i);
    expect(text).not.toBeInTheDocument();
    expect(button).toHaveTextContent('Show');
  });
});