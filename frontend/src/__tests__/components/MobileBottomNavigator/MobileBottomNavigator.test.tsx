import { render } from "@testing-library/react"
import MobileBottomNavigator from "../../../components/mobileBottomNavigator/MobileBottomNavigator"
import styles from "../../../components/mobileBottomNavigator/mobileBottomNavigatorStyles.module.css"
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

    // Click on Settings and it should become active.
    await user.click(settingsButton);
    expect(settingsButton).toHaveClass("Mui-selected");
    expect(gameButton).not.toHaveClass("Mui-selected");
    expect(ProfileButton).not.toHaveClass("Mui-selected");

    // Click on Profile and it should become active.
    await user.click(ProfileButton);
    expect(ProfileButton).toHaveClass("Mui-selected");
    expect(gameButton).not.toHaveClass("Mui-selected");
    expect(settingsButton).not.toHaveClass("Mui-selected");

  });

  it("Support keyboard activation for Profile",async ()=>{
    const { user, ProfileButton } = setup();

    ProfileButton.focus();
    await user.keyboard("{enter}");

    expect(ProfileButton).toHaveClass("Mui-selected");

  });

  it("applies the container CSS module class", () => {
    render(<MobileBottomNavigator />);
    // Look for the element with that class
    const container = document.querySelector(`.${styles.container}`);
    expect(container).toBeInTheDocument();
  });
})