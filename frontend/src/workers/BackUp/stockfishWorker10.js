// src/workers/stockfishWorker.js

let isReady = false;
let moduleReady = false;

// Configure the Emscripten Module before loading Stockfish
self.Module = {
    locateFile: function (path) {
        console.log('locateFile called with:', path);
        console.log('Worker location:', self.location.href);

        if (path.endsWith('.wasm')) {
            // Use absolute URL to ensure correct path resolution in worker context
            const baseUrl = self.location.origin;
            const wasmPath = `${baseUrl}/stockfish/stockfishWorker.wasm`;
            console.log('Resolved WASM path:', wasmPath);
            return wasmPath;
        }

        // For other files, use absolute URL as well
        const baseUrl = self.location.origin;
        return `${baseUrl}/stockfish/${path}`;
    },
    onRuntimeInitialized: function () {
        console.log('WASM Runtime initialized');
        moduleReady = true;
        setupStockfish();
    },
    print: function (text) {
        console.log('Stockfish output:', text);
        // Forward Stockfish output to main thread
        if (text.trim()) {
            self.postMessage(text);
        }
    },
    printErr: function (text) {
        console.error('Stockfish error:', text);
        self.postMessage('error: ' + text);
    }
};

self.postMessage('worker-log: worker started');

// Load the Stockfish JS glue which will, in turn, load the .wasm
const loadStockfish = async () => {
    self.postMessage('worker-log: before importScripts');
    try {
        // Use absolute path for better reliability
        self.importScripts('/stockfish/stockfish-17-lite-single.js');
        self.postMessage('worker-log: after importScripts');

        // If Module is already available, setup immediately
        if (typeof Module !== 'undefined' && Module.ccall) {
            moduleReady = true;
            setupStockfish();
        }
    } catch (e) {
        self.postMessage('worker-log: importScripts failed: ' + e.message);
        self.postMessage('error: Failed to load Stockfish engine');
    }
};

// Setup Stockfish once Module is ready
const setupStockfish = () => {
    if (!moduleReady || isReady) return;

    try {
        self.postMessage('worker-log: Module ready, setting up Stockfish');

        // Verify Module functions are available
        if (!Module || !Module.ccall) {
            throw new Error('Module.ccall not available');
        }

        isReady = true;
        self.postMessage('stockfish-ready');

        // Send initial UCI command to initialize engine
        try {
            Module.ccall('uci_command', null, ['string'], ['uci']);
        } catch (err) {
            self.postMessage('worker-log: Error sending initial UCI: ' + err.message);
        }

    } catch (err) {
        self.postMessage('worker-log: Error in setupStockfish: ' + err.message);
        self.postMessage('error: Failed to setup Stockfish engine');
    }
};

// Handle commands from the main thread
self.onmessage = (e) => {
    const command = e.data;

    self.postMessage('worker-log: received command: ' + command);

    if (!isReady) {
        self.postMessage('error: Stockfish not ready yet');
        return;
    }

    try {
        if (Module && Module.ccall) {
            // Call the native `uci_command` entrypoint
            Module.ccall('uci_command', null, ['string'], [command]);
        } else {
            self.postMessage('error: Stockfish Module not available');
        }
    } catch (error) {
        self.postMessage('error: Failed to send command: ' + error.message);
    }
};

// Global error handler
self.onerror = (error) => {
    self.postMessage(`worker-error: ${error.message} at ${error.filename}:${error.lineno}:${error.colno}`);
};

self.onunhandledrejection = (event) => {
    self.postMessage(`worker-unhandled-rejection: ${event.reason}`);
};

// Start loading Stockfish
loadStockfish();