import { beforeEach, describe, vi, Mock, it, expect } from 'vitest';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import abc from '../../../components/chessBoard/ChessBoard'
import Game from '../../../pages/index/Game';
import { useAppDispatch } from '../../../features';
import { initGame, startGame } from '../../../features/chessGame/chessSlice';
import { ReactElement } from 'react';
import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import rootReducer from '../../../features/rootReducer';
import { RootState } from '@reduxjs/toolkit/query';
import { Provider } from 'react-redux';

// ✅ Utility function you can later move to `test-utils.tsx`
function renderWithRedux(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
    ...renderOptions
  }: {
    preloadedState?: PreloadedState<RootState>;
    store?: ReturnType<typeof configureStore>;
  } & Omit<RenderOptions, 'queries'> = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}


// Mock CSS module
vi.mock('../../../pages/index/Game.module.css', ()=>({
  default: {
    gameContainer: 'mocked-game-container',
  }
}));

// Mock Redux hook
vi.mock('../../../features',()=>({
  useAppDispatch: vi.fn()
}));

vi.mock('../../../features/chessGame/chessSlice',()=>({
  initGame: vi.fn(() => ({ type: 'chessGame/initGame' })),
  startGame: vi.fn((payload) => ({ type: 'chessGame/startGame', payload })),
}));



// Mock StartGameDialogBox component
vi.mock('../../../components/game/startGameDialogBox/StartGameDialogBox', () => ({
  default: ({ isOpen, handleClose }: any) =>
    isOpen ? (
      <div data-testid="dialog">
        <button 
          onClick={() => handleClose({
            isSinglePlayer: true,
            player: 'b',
            elo: 1500,
         })}
        >
          Close Dialog
        </button>
      </div>
    ) : null,
}));

vi.mock('../../../components/chessBoard/ChessBoard',()=>({
  default: () => <div data-testid="chessBoard"></div>
}));

describe("Game Component", ()=>{
  const mockDispatch = vi.fn();

  beforeEach(()=>{
    (useAppDispatch as unknown as Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockClear();
  })

  it("Should render ChessBoard and Open dialog on mount", async ()=>{
    // Act
    render(<Game />);

    // Assert 
    expect(await screen.findByTestId('dialog')).toBeDefined();
    expect(screen.getByTestId('chessBoard')).toBeDefined();



    
  })

})

