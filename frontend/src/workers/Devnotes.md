- Main Issue which I encounter in development was that worker was trying to load was from it's own dir and other added 
middle ware was not working.
- Added wasm in worker dir and it is working fine for now. 
- But in letter fixes try to move it in public dir. 
- Also file name need to be match with the worker name and not the glue code.
- Look for solution letter on but for now fix the Custom hook that is causing not working for now.

Also, I am adding all dir with 


// Code to run in the main thread not recommended
// New way
// Create a proper worker wrapper for Stockfish
const createStockfishWorker = useCallback(() => {
const workerCode = `
importScripts('/stockfish/stockfish-17-lite-single.js');


            let stockfish = null;
            let isInitialized = false;
            
            // Initialize Stockfish when worker starts
            if (typeof Stockfish !== 'undefined') {
                Stockfish().then(engine => {
                    stockfish = engine;
                    
                    // Set up listener for engine output
                    stockfish.listener = function(line) {
                        postMessage(line);
                    };
                    
                    // Send UCI command to start
                    stockfish.sendCommand('uci');
                    isInitialized = true;
                }).catch(error => {
                    postMessage('ERROR: Failed to initialize Stockfish: ' + error.message);
                });
            } else {
                postMessage('ERROR: Stockfish not available');
            }
            
            // Handle messages from main thread
            onmessage = function(e) {
                if (stockfish && isInitialized) {
                    stockfish.sendCommand(e.data);
                } else {
                    postMessage('ERROR: Stockfish not ready');
                }
            };
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    }, []);