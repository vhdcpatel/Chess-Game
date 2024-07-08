import { PieceModel } from './constants/initialPosition';
import { PieceTypes, PieceType } from './constants/srcMap';
import { FILES, RANKS } from './constants/ranksAndFiles';

interface Move {
    file: string;
    rank: string;
}

const isValidSquare = (file: string, rank: string) => {
    return FILES.includes(file) && RANKS.includes(Number(rank));
};

const isSquareOccupied = (position: string, piecesPositions: PieceModel[]) => {
    return piecesPositions.some(p => p.position === position);
};

const isSquareOccupiedByColor = (position: string, color: 'white' | 'black', piecesPositions: PieceModel[]) => {
    const piece = piecesPositions.find(p => p.position === position);
    return !!piece && piece.color === color;
};

const getPawnMoves = (piece: PieceModel, piecesPositions: PieceModel[], checkAttacks: boolean): string[] => {
    const { position, color } = piece;
    const possibleMoves: string[] = [];

    const direction = color === 'white' ? 1 : -1;
    const initialRank = color === 'white' ? '2' : '7';
    const promotionRank = color === 'white' ? '8' : '1';

    const nextRank = String.fromCharCode(position.charCodeAt(1) + direction);
    const doubleRank = String.fromCharCode(position.charCodeAt(1) + 2 * direction);

    // Normal move
    const normalMove = `${position[0]}${nextRank}`;
    if (!isSquareOccupied(normalMove, piecesPositions)) {
        possibleMoves.push(normalMove);

        // Double move from initial position
        if (position[1] === initialRank && !isSquareOccupied(doubleRank, piecesPositions)) {
            possibleMoves.push(`${position[0]}${doubleRank}`);
        }
    }

    // Attacks
    const leftAttack = String.fromCharCode(position.charCodeAt(0) - 1) + nextRank;
    const rightAttack = String.fromCharCode(position.charCodeAt(0) + 1) + nextRank;

    if (isValidSquare(leftAttack[0], leftAttack[1]) &&
        (checkAttacks && isSquareOccupiedByColor(leftAttack, color === 'white' ? 'black' : 'white', piecesPositions))) {
        possibleMoves.push(leftAttack);
    }

    if (isValidSquare(rightAttack[0], rightAttack[1]) &&
        (checkAttacks && isSquareOccupiedByColor(rightAttack, color === 'white' ? 'black' : 'white', piecesPositions))) {
        possibleMoves.push(rightAttack);
    }

    // En Passant
    const leftEnPassant = `${String.fromCharCode(position.charCodeAt(0) - 1)}${nextRank}`;
    const rightEnPassant = `${String.fromCharCode(position.charCodeAt(0) + 1)}${nextRank}`;

    const leftEnPassantPiece = piecesPositions.find(p =>
        p.position === leftEnPassant &&
        p.type === PieceTypes.Pawn &&
        p.color !== color
    );

    const rightEnPassantPiece = piecesPositions.find(p =>
        p.position === rightEnPassant &&
        p.type === PieceTypes.Pawn &&
        p.color !== color
    );

    if (leftEnPassantPiece) {
        possibleMoves.push(leftEnPassant);
    }

    if (rightEnPassantPiece) {
        possibleMoves.push(rightEnPassant);
    }

    // Pawn Promotion
    if (position[1] === promotionRank) {
        possibleMoves.forEach((move, index) => {
            possibleMoves[index] = `${move}q`;
        });
    }

    return possibleMoves.filter(move => isValidSquare(move[0], move[1]));
};

const getKnightMoves = (piece: PieceModel, piecesPositions: PieceModel[]): string[] => {
    const { position, color } = piece;
    const possibleMoves: string[] = [];

    const knightMoves: Move[] = [
        { file: String.fromCharCode(position.charCodeAt(0) - 1), rank: String.fromCharCode(position.charCodeAt(1) + 2) },
        { file: String.fromCharCode(position.charCodeAt(0) + 1), rank: String.fromCharCode(position.charCodeAt(1) + 2) },
        { file: String.fromCharCode(position.charCodeAt(0) - 2), rank: String.fromCharCode(position.charCodeAt(1) + 1) },
        { file: String.fromCharCode(position.charCodeAt(0) + 2), rank: String.fromCharCode(position.charCodeAt(1) + 1) },
        { file: String.fromCharCode(position.charCodeAt(0) - 2), rank: String.fromCharCode(position.charCodeAt(1) - 1) },
        { file: String.fromCharCode(position.charCodeAt(0) + 2), rank: String.fromCharCode(position.charCodeAt(1) - 1) },
        { file: String.fromCharCode(position.charCodeAt(0) - 1), rank: String.fromCharCode(position.charCodeAt(1) - 2) },
        { file: String.fromCharCode(position.charCodeAt(0) + 1), rank: String.fromCharCode(position.charCodeAt(1) - 2) }
    ];

    knightMoves.forEach(move => {
        if (isValidSquare(move.file, move.rank)) {
            if (!isSquareOccupiedByColor(`${move.file}${move.rank}`, color, piecesPositions)) {
                possibleMoves.push(`${move.file}${move.rank}`);
            }
        }
    });

    return possibleMoves;
};

const getBishopMoves = (piece: PieceModel, piecesPositions: PieceModel[]): string[] => {
    return getDiagonalMoves(piece, piecesPositions);
};

const getRookMoves = (piece: PieceModel, piecesPositions: PieceModel[]): string[] => {
    return getStraightMoves(piece, piecesPositions);
};

const getQueenMoves = (piece: PieceModel, piecesPositions: PieceModel[]): string[] => {
    return [
        ...getStraightMoves(piece, piecesPositions),
        ...getDiagonalMoves(piece, piecesPositions)
    ];
};

const getKingMoves = (piece: PieceModel, piecesPositions: PieceModel[], checkCastling: boolean = true): string[] => {
    const { position, color } = piece;
    const possibleMoves: string[] = [];

    const kingMoves: Move[] = [
        { file: String.fromCharCode(position.charCodeAt(0) - 1), rank: position[1] },
        { file: String.fromCharCode(position.charCodeAt(0) + 1), rank: position[1] },
        { file: position[0], rank: String.fromCharCode(position.charCodeAt(1) + 1) },
        { file: position[0], rank: String.fromCharCode(position.charCodeAt(1) - 1) },
        { file: String.fromCharCode(position.charCodeAt(0) - 1), rank: String.fromCharCode(position.charCodeAt(1) + 1) },
        { file: String.fromCharCode(position.charCodeAt(0) + 1), rank: String.fromCharCode(position.charCodeAt(1) + 1) },
        { file: String.fromCharCode(position.charCodeAt(0) - 1), rank: String.fromCharCode(position.charCodeAt(1) - 1) },
        { file: String.fromCharCode(position.charCodeAt(0) + 1), rank: String.fromCharCode(position.charCodeAt(1) - 1) }
    ];

    kingMoves.forEach(move => {
        if (isValidSquare(move.file, move.rank)) {
            if (!isSquareOccupiedByColor(`${move.file}${move.rank}`, color, piecesPositions)) {
                possibleMoves.push(`${move.file}${move.rank}`);
            }
        }
    });

    // Castling
    if (checkCastling) {
        const rookFile = color === 'white' ? 'h' : 'a';
        const kingSide = `${String.fromCharCode(position.charCodeAt(0) + 1)}${position[1]}`;
        const queenSide = `${String.fromCharCode(position.charCodeAt(0) - 1)}${position[1]}`;

        if (position === `${FILES[4]}${RANKS[0]}` && piecesPositions.some(p => p.position === `${FILES[7]}${RANKS[0]}`)) {
            possibleMoves.push(kingSide);
        }

        if (position === `${FILES[4]}${RANKS[0]}` && piecesPositions.some(p => p.position === `${FILES[0]}${RANKS[0]}`)) {
            possibleMoves.push(queenSide);
        }
    }

    return possibleMoves.filter(move => isValidSquare(move[0], move[1]));
};

const getDiagonalMoves = (piece: PieceModel, piecesPositions: PieceModel[]): string[] => {
    return [
        ...getMovesInDirection(piece, piecesPositions, 1, 1),
        ...getMovesInDirection(piece, piecesPositions, 1, -1),
        ...getMovesInDirection(piece, piecesPositions, -1, 1),
        ...getMovesInDirection(piece, piecesPositions, -1, -1)
    ];
};

const getStraightMoves = (piece: PieceModel, piecesPositions: PieceModel[]): string[] => {
    return [
        ...getMovesInDirection(piece, piecesPositions, 1, 0),
        ...getMovesInDirection(piece, piecesPositions, -1, 0),
        ...getMovesInDirection(piece, piecesPositions, 0, 1),
        ...getMovesInDirection(piece, piecesPositions, 0, -1)
    ];
};

const getMovesInDirection = (piece: PieceModel, piecesPositions: PieceModel[], fileIncrement: number, rankIncrement: number): string[] => {
    const { position, color } = piece;
    const possibleMoves: string[] = [];

    let currentFile = position[0];
    let currentRank = position[1];

    while (true) {
        currentFile = String.fromCharCode(currentFile.charCodeAt(0) + fileIncrement);
        currentRank = String.fromCharCode(currentRank.charCodeAt(0) + rankIncrement);

        if (!isValidSquare(currentFile, currentRank)) {
            break;
        }

        const currentPosition = `${currentFile}${currentRank}`;
        const pieceAtPosition = piecesPositions.find(p => p.position === currentPosition);

        if (pieceAtPosition) {
            if (pieceAtPosition.color !== color) {
                possibleMoves.push(currentPosition);
            }
            break;
        }

        possibleMoves.push(currentPosition);
    }

    return possibleMoves;
};

const getPossibleMoves = (piece: PieceModel, piecesPositions: PieceModel[], checkAttacks: boolean = true, checkCastling: boolean = true): string[] => {
    switch (piece.type) {
        case PieceTypes.Pawn:
            return getPawnMoves(piece, piecesPositions, checkAttacks);
        case PieceTypes.Knight:
            return getKnightMoves(piece, piecesPositions);
        case PieceTypes.Bishop:
            return getBishopMoves(piece, piecesPositions);
        case PieceTypes.Rook:
            return getRookMoves(piece, piecesPositions);
        case PieceTypes.Queen:
            return getQueenMoves(piece, piecesPositions);
        case PieceTypes.King:
            return getKingMoves(piece, piecesPositions, checkCastling);
        default:
            return [];
    }
};

export default getPossibleMoves;
