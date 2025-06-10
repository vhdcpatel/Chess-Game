import React from 'react';
import styles from './PromotionDialog.module.css';
import { Button } from '@mui/material';
import { getSrc } from '../../../utils/constants/srcMap';
import GenericDialog from "../../dialogBox/GenericDialog";

// Types
type PieceColor = 'w' | 'b';
type PieceSymbol = 'q' | 'r' | 'b' | 'n';
type Square = string;

interface PromotionInfoModel {
    from: Square;
    to: Square;
    color: PieceColor;
}

interface PromotionDialogProps {
    promotionInfo: PromotionInfoModel | null;
    onPromote: (piece: PieceSymbol) => void;
    onCancel: () => void;
}

const PromotionDialog: React.FC<PromotionDialogProps> = (props) => {
    const {
        promotionInfo,
        onPromote,
        onCancel,
    } = props;

    if (!promotionInfo) return null;

    const promotionPieces: { symbol: PieceSymbol; name: string }[] = [
        { symbol: 'q', name: 'Queen' },
        { symbol: 'r', name: 'Rook' },
        { symbol: 'b', name: 'Bishop' },
        { symbol: 'n', name: 'Knight' },
    ];

    const handlePromotionSelect = (piece: PieceSymbol) => {
        onPromote(piece);
    };

    const dialogContent = (
        <>
            <div className={styles.outerCtn}>
                <h3 className={styles.titleText}>Choose piece for promotion</h3>
                <div className={styles.innerCtn}>
                    {promotionPieces.map((piece) => (
                        <Button
                            key={piece.symbol}
                            onClick={() => handlePromotionSelect(piece.symbol)}
                            variant="outlined"
                            className={styles.promotionButton}
                            startIcon={
                                <img
                                    className={styles.icons}
                                    src={getSrc[promotionInfo.color][piece.symbol]}
                                    alt={piece.name}
                                />
                            }
                        >
                            {piece.name}
                        </Button>
                    ))}
                </div>
            </div>
            <div className={`${styles.outerCtn} ${styles.actionBox}`}>
                <div className={styles.actionBoxInner}>
                    <Button variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <GenericDialog
            isOpen={true}
            title="Pawn Promotion"
            onClose={onCancel}
            maxWidth="md"
        >
            {dialogContent}
        </GenericDialog>
    );
};

export default PromotionDialog;