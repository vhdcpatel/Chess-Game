// stockfishWorker.js

let isReady = false;

// Encapsulate UCI handshake logic
function handshake() {
    if (typeof Module?.ccall === 'function') {
        self.postMessage('worker-log: Initiating UCI handshake…');
        Module.ccall('command', null, ['string'], ['uci']);
    } else {
        self.postMessage('error: Cannot handshake – Module.ccall not available');
    }
}

// Report start
self.postMessage('worker-log: Worker started');

// Configure Emscripten Module
self.Module = {
    locateFile(path) {
        return path.endsWith('.wasm')
            ? '/stockfish/stockfishWorker.wasm'
            : `/stockfish/${path}`;
    },
    onRuntimeInitialized() {
        self.postMessage('worker-log: WASM initialized');
        // first handshake
        handshake();
    },
    print(text) {
        self.postMessage('worker-log: ' + text);

        // Primary “ready” signal from Stockfish
        if (text === 'uciok') {
            isReady = true;
            self.postMessage('stockfish-ready');
            return;
        }

        // Debug-banner trigger: retry handshake and mark ready
        if (text.includes('Stockfish 17 Lite WASM by the Stockfish developers')) {
            self.postMessage('worker-log: Debug banner received — retriggering handshake');
            isReady = true;                // for debug purposes
            handshake();
            return;
        }

        // Forward everything else
        // (if you want to filter other messages, you can add more cases here)
    }
};

// Load the Stockfish script + WASM
try {
    self.postMessage('worker-log: Loading Stockfish script…');
    self.importScripts('/stockfish/stockfish-17-lite-single.js');
    self.postMessage('worker-log: Stockfish script loaded');
} catch (e) {
    self.postMessage('error: Failed to load Stockfish: ' + e.message);
}

// Handle incoming commands from main thread
self.onmessage = function (e) {
    const cmd = e.data;

    // Special message to force a handshake retry from main thread
    if (cmd === 'retry-handshake') {
        self.postMessage('worker-log: Received retry-handshake command');
        handshake();
        return;
    }

    if (!isReady) {
        self.postMessage('error: Stockfish not ready yet');
        return;
    }

    if (typeof Module?.ccall === 'function') {
        self.postMessage('worker-log: Sending command → ' + cmd);
        Module.ccall('command', null, ['string'], [cmd]);
    } else {
        self.postMessage('error: Module.ccall not available');
    }
};
