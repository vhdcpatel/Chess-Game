import { ELO_SETTINGS } from "./constants/ELOData";

export const getEloSettings = (elo: number) => {
    const ratings = Object.keys(ELO_SETTINGS).map(Number).sort((a, b) => a - b);
    const closetRating = ratings.reduce((prev, curr)=>{
        return Math.abs(curr - elo) < Math.abs(curr - elo) ? curr : prev;
    });
    return ELO_SETTINGS[closetRating as keyof typeof ELO_SETTINGS]
}