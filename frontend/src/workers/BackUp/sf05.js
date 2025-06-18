// Simple Stockfish Worker
let stockfish = null;
let isReady = false;

self.postMessage('worker-log: Worker started');

// Simple Module configuration
self.Module = {
    locateFile: function(path) {
        if (path.endsWith('.wasm')) {
            return '/stockfish/stockfishWorker.wasm';
        }
        return `/stockfish/${path}`;
    },
    onRuntimeInitialized: function() {
        self.postMessage('worker-log: WASM initialized, starting UCI...');
        // Start UCI handshake now that WASM is ready
        if (Module && Module.ccall) {
            Module.ccall('command', null, ['string'], ['uci']);
        }
    },
    print: function(text) {
        self.postMessage('worker-log: ' + text);

        // Check if Stockfish is ready
        if (text === 'uciok') {
            isReady = true;
            self.postMessage('stockfish-ready');
        } else {
            // Forward output to main thread
            self.postMessage(text);
        }
    }
};

// Load Stockfish
try {
    self.postMessage('worker-log: Loading Stockfish...');
    self.importScripts('/stockfish/stockfish-17-lite-single.js');
    self.postMessage('worker-log: Stockfish script loaded, waiting for WASM...');

} catch(e) {
    self.postMessage('error: Failed to load Stockfish: ' + e.message);
}

// Handle commands
self.onmessage = function(e) {
    const command = e.data;

    if (!isReady) {
        self.postMessage('error: Stockfish not ready yet');
        return;
    }

    if (Module && Module.ccall) {
        self.postMessage('worker-log: Sending: ' + command);
        Module.ccall('command', null, ['string'], [command]);
    } else {
        self.postMessage('error: Stockfish not available');
    }
};