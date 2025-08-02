// Mock for Lazy-loaded components.
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "../../../routes/AppRoutes";

vi.mock('../../../pages/index/Game', ()=>{
  return {
    __esModule: true,
    default: ()=> <div>Mock Game Home page</div>
  }
});

vi.mock('../../../pages/authPage/AuthPage', ()=>{
  return {
    __esModule: true,
    default: ()=> <div>Mock Auth Page</div>
  }
});

vi.mock('../../../components/uxComponents/pageNotFound/PageNotFound', ()=>{
  return {
    __esModule: true,
    default: ()=> <div>Mock Page Not Found</div>
  }
});

vi.mock('../../../layout/Layout', ()=> {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div>
        <main>{children}</main>
      </div>
    )
  }
});

vi.mock('../../../routes/ProtectedRoutes', ()=> {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div>Mock Protected Routes {children}</div>
    )
  }
})




describe("AppRoutes component should render correctly", () => {
    it("Should render Game page on /game", async () => {
      render(
        <MemoryRouter initialEntries={['/game']}>
          <AppRoutes />
        </MemoryRouter>
      );
      const text = await screen.findByText("Mock Game Home page");
      expect(text).toBeInTheDocument();
      
      expect(screen.queryByText("Mock Layout")).not.toBeNull(); // Optional: Verify layout presence
    });
});