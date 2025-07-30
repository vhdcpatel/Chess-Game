import { fireEvent, render, screen } from "@testing-library/react"
import ProfileCard from "../../../components/profileCard/ProfileCard";

describe("ProfileCard Component should render correctly",()=>{
  const mockProps = {
    avatarSrc: "https://example.com/avatar.jpg",
    name: "John Doe",
    status: "Online",
    onSettingsClick: vi.fn(),
  }

  it("Should render the ProfileCard with given props", ()=>{
    render(<ProfileCard {...mockProps} />);

    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.status)).toBeInTheDocument();

    const avatar = screen.getByRole('img', { name: `${mockProps.name}'s avatar` });
    
    expect(avatar).toHaveAttribute('src', mockProps.avatarSrc);
    expect(avatar).toHaveAttribute('alt', `${mockProps.name}'s avatar`);
  })

  it("Should render default status if not provided", ()=>{
    const {name, avatarSrc} = mockProps
    render(<ProfileCard avatarSrc={avatarSrc} name={name} />);

    expect(screen.getByText("Free")).toBeInTheDocument();
  })

  it("Should call onSettingsClick when settings button is clicked", ()=> {
    render(<ProfileCard {...mockProps} />);

    const settingsButton = screen.getByRole('button', { name: /Settings/i });
    fireEvent.click(settingsButton);

    expect(mockProps.onSettingsClick).toHaveBeenCalledTimes(1);
  });
})