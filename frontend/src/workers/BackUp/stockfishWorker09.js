// src/workers/stockfishWorker.js

let moduleReady = false;
let uciReady = false;
let engine = null;

// Configure the Emscripten Module before loading Stockfish
self.Module = {
    locateFile: function (path) {
        console.log('locateFile called with:', path);

        if (path.endsWith('.wasm')) {
            const baseUrl = self.location.origin;
            const wasmPath = `${baseUrl}/stockfish/stockfishWorker.wasm`;
            console.log('Resolved WASM path:', wasmPath);
            return wasmPath;
        }

        const baseUrl = self.location.origin;
        return `${baseUrl}/stockfish/${path}`;
    },
    onRuntimeInitialized: function () {
        console.log('WASM Runtime initialized');
        moduleReady = true;
        setupStockfish();
    }
};

self.postMessage('worker-log: worker started');

// Load the Stockfish JS glue
const loadStockfish = async () => {
    self.postMessage('worker-log: loading Stockfish...');
    try {
        self.importScripts('/stockfish/stockfish-17-lite-single.js');
        self.postMessage('worker-log: Stockfish script loaded');

        // If Module is already available, setup immediately
        if (typeof Module !== 'undefined' && Module.ccall) {
            moduleReady = true;
            setupStockfish();
        }
    } catch (e) {
        self.postMessage('worker-log: Failed to load Stockfish: ' + e.message);
        self.postMessage('error: Failed to load Stockfish engine');
    }
};

// Setup Stockfish communication
const setupStockfish = () => {
    if (!moduleReady || engine) return;

    try {
        self.postMessage('worker-log: Setting up Stockfish communication...');

        if (!Module || !Module.ccall) {
            throw new Error('Module.ccall not available');
        }

        // Create engine object with sendCommand method
        engine = {
            sendCommand: function(cmd) {
                try {
                    // Use 'command' not 'uci_command' based on the example
                    Module.ccall("command", null, ["string"], [cmd], {
                        async: /^go\b/.test(cmd) // Make 'go' commands async
                    });
                } catch (error) {
                    self.postMessage('worker-log: Error sending command: ' + error.message);
                }
            }
        };

        // Set up output listener - this is crucial for communication
        engine.listener = function(line) {
            if (typeof line !== "string") {
                return;
            }

            self.postMessage('worker-log: Stockfish output: ' + line);

            // Check for UCI ready signal
            if (!uciReady && line === "uciok") {
                uciReady = true;
                self.postMessage('stockfish-ready');
                self.postMessage('worker-log: Stockfish UCI ready!');
            } else {
                // Forward all other output to main thread
                self.postMessage(line);
            }
        };

        // Start UCI handshake
        self.postMessage('worker-log: Starting UCI handshake...');
        engine.sendCommand("uci");

    } catch (err) {
        self.postMessage('worker-log: Error in setupStockfish: ' + err.message);
        self.postMessage('error: Failed to setup Stockfish engine');
    }
};

// Handle commands from the main thread
self.onmessage = (e) => {
    const command = e.data;
    self.postMessage('worker-log: Received command: ' + command);

    // Check if engine is ready
    if (!engine) {
        self.postMessage('error: Stockfish engine not initialized');
        return;
    }

    if (!uciReady) {
        self.postMessage('error: Stockfish UCI not ready yet - wait for stockfish-ready message');
        return;
    }

    try {
        engine.sendCommand(command);
    } catch (error) {
        self.postMessage('error: Failed to send command: ' + error.message);
    }
};

// Global error handlers
self.onerror = (error) => {
    self.postMessage(`worker-error: ${error.message} at ${error.filename}:${error.lineno}:${error.colno}`);
};

self.onunhandledrejection = (event) => {
    self.postMessage(`worker-unhandled-rejection: ${event.reason}`);
};

// Start loading
loadStockfish();