import { fireEvent, render, screen } from "@testing-library/react";
import PromotionDialog from "../../../components/chessBoard/PromotionDialog/PromotionDialog";
import { PromotionInfoModel } from "../../../features/chessGame/chessModel";



vi.mock('../../../../utils/constants/srcMap', () => ({
  getSrc: {
    w: {
      q: 'white-queen.svg',
      r: 'white-rook.svg',
      b: 'white-bishop.svg',
      n: 'white-knight.svg',
    },
    b: {
      q: 'black-queen.svg',
      r: 'black-rook.svg',
      b: 'black-bishop.svg',
      n: 'black-knight.svg',
    },
  },
}));

describe("It should render the PromotionDialog correctly", () => {
  const promotionInfo: PromotionInfoModel = {
    from: 'e7',
    to: 'e8',
    color: 'w',
  }

  const setup = () => {
    const onPromote = vi.fn();
    const onCancel = vi.fn();

    render(
      <PromotionDialog
        promotionInfo={promotionInfo}
        onPromote={onPromote}
        onCancel={onCancel}
      />
    )

    return {onPromote, onCancel}
  }


  it("Should render the dialog with promotion options", ()=>{
    const { } = setup();

    expect(screen.getByText("Choose piece for promotion")).toBeInTheDocument();

    // Count total number of button rendered 
    expect(screen.getAllByRole("button")).toHaveLength(5); 
    // 4 promotion pieces + 1 cancel button
    
    // Check if buttons for each piece are rendered
    expect(screen.getByRole("button", { name: "Queen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rook" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bishop" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Knight" })).toBeInTheDocument();

    // Check if the cancel button is rendered
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("Should call onPromote with correct piece symbol when a piece is selected", ()=>{
    const { onPromote } = setup();

    const queenButton = screen.getByRole("button", { name: "Queen" });
    fireEvent.click(queenButton);

    expect(onPromote).toHaveBeenCalledTimes(1);
    expect(onPromote).toHaveBeenCalledWith('q');
  });

  it("Should call onCancel when cancel button is clicked", ()=>{
    const { onCancel } = setup();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });


});