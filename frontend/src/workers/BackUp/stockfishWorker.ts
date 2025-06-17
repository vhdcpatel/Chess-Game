// workers/stockfishWorker.ts
/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope;

// Use importScripts for classic worker
self.importScripts('/stockfish/stockfish-nnue-17-single.js');

// Wait for Module to be available
let Module: any;

const checkModule = () => {
    if (typeof (self as any).Module !== 'undefined') {
        Module = (self as any).Module;

        // Override postMessage to send responses back to main thread
        Module.postMessage = (message: string) => {
            self.postMessage(message);
        };

        self.postMessage('ready');
    } else {
        setTimeout(checkModule, 100);
    }
};

checkModule();

// Handle incoming messages
self.onmessage = (e: MessageEvent<string>) => {
    if (Module && Module.postMessage) {
        Module.postMessage(e.data);
    }
};