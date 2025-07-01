export const ELOData = [
    { value: 800, label: 'Beginner (800)' },
    { value: 1000, label: 'Easy (1000)' },
    { value: 1200, label: 'Normal (1200)' },
    { value: 1400, label: 'Hard (1400)' },
    { value: 1600, label: 'Expert (1600)' },
    { value: 1800, label: 'Master (1800)' },
    { value: 2000, label: 'Grandmaster (2000)' },
];

export const ELO_SETTINGS = {
    800: { depth: 1, time: 100 },
    1000: { depth: 2, time: 200 },
    1200: { depth: 3, time: 300 },
    1400: { depth: 5, time: 500 },
    1600: { depth: 8, time: 1000 },
    1800: { depth: 12, time: 2000 },
    2000: { depth: 15, time: 3000 },
}