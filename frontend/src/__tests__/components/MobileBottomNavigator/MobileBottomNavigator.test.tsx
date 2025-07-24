import { render } from "@testing-library/react"
import MobileBottomNavigator from "../../../components/mobileBottomNavigator/MobileBottomNavigator"
import userEvent from "@testing-library/user-event"

// Helper Function to Keep each test self-contained & explicit.
const setup = () => {
  const user = userEvent.setup();

  const screen = render(<MobileBottomNavigator />);

  const gameButton = screen.getByRole("button", {name: /Game/i});
  const settingsButton = screen.getByRole("button", {name: /Settings/i});
  const ProfileButton = screen.getByRole("button", {name: /Profile/i});


  return {
    user,
    gameButton,
    settingsButton,
    ProfileButton
  }
} 


describe("Should render MobileBottomNavigator correctly", () => {
  
  it("It should render all the button correctly", () => {
    // Arrange and Act  
    const { gameButton, settingsButton, ProfileButton } = setup();
    
    // Assert
    expect(gameButton).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
    expect(ProfileButton).toBeInTheDocument();

  });

  it("Should have the Game Section as default active other should not be active", ()=>{
    const { gameButton, settingsButton, ProfileButton } = setup();

    expect(gameButton).toHaveClass("Mui-selected");
    expect(settingsButton).not.toHaveClass("Mui-selected");
    expect(ProfileButton).not.toHaveClass("Mui-selected");

  });

  it("Should change the active section when clicked", async () => {
    const { user, gameButton, settingsButton, ProfileButton } = setup();

    // Click on Settings
    await user.click(settingsButton);
    expect(settingsButton).toHaveClass("Mui-selected");
    expect(gameButton).not.toHaveClass("Mui-selected");
    expect(ProfileButton).not.toHaveClass("Mui-selected");

    // Click on Profile
    await user.click(ProfileButton);
    expect(ProfileButton).toHaveClass("Mui-selected");
    expect(gameButton).not.toHaveClass("Mui-selected");
    expect(settingsButton).not.toHaveClass("Mui-selected");

  });




})