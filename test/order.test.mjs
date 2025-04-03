import { strict as assert } from 'assert';
import WebSocket from 'ws';
import sinon from 'sinon';
import { run } from '../order.mjs'; // Adjust the import if needed

describe('Order Functionality', () => {
    let wsMock;

    beforeEach(() => {
        // Mock WebSocket
        wsMock = sinon.createStubInstance(WebSocket);
        sinon.stub(WebSocket, 'constructor').returns(wsMock);
    });

    afterEach(() => {
        // Restore WebSocket
        sinon.restore();
    });

    it('should create and send an order successfully', async () => {
        wsMock.on.open.callArg(0); // Simulate WebSocket 'open' event
        wsMock.send = sinon.spy(); // Spy on the send method

        await run();

        assert(wsMock.send.calledOnce, 'WebSocket send should be called once');
        const sentData = JSON.parse(wsMock.send.firstCall.args[0]);
        assert.strictEqual(sentData[0], 'EVENT', 'First element of sent data should be "EVENT"');
        assert.strictEqual(typeof sentData[1], 'object', 'Second element of sent data should be an object');
    });

    it('should handle WebSocket message response', async () => {
        const messageHandler = sinon.spy();
        wsMock.on.message = messageHandler;

        wsMock.on.open.callArg(0); // Simulate WebSocket 'open' event
        wsMock.on.message.callArgWith(0, JSON.stringify({ status: 'success' })); // Simulate 'message' event

        await run();

        assert(messageHandler.calledOnce, 'WebSocket message handler should be called once');
    });

    it('should fail to create an order with invalid data', async () => {
        // Simulate invalid data scenario
        const invalidRun = async () => {
            const invalidEvent = {
                kind: 30000,
                pubkey: null, // Invalid public key
                created_at: Math.floor(Date.now() / 1000),
                tags: [],
                content: ''
            };
            await run(invalidEvent);
        };

        await assert.rejects(invalidRun, 'Invalid data should throw an error');
    });

    it('should handle WebSocket connection errors', async () => {
        wsMock.on.error.callArgWith(0, new Error('Connection failed')); // Simulate WebSocket error

        const errorRun = async () => {
            await run();
        };

        await assert.rejects(errorRun, /Connection failed/, 'WebSocket connection error should be handled');
    });
});