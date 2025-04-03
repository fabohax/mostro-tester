import WebSocket from 'ws';
import * as secp from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { hmac } from '@noble/hashes/hmac';
import { TextEncoder } from 'util';

// 🔧 Configurar HMAC SHA256 Sync
secp.utils.hmacSha256Sync = (key, ...msgs) =>
  hmac(sha256, key, secp.utils.concatBytes(...msgs));

// secret key y public key en hex
const sk = '75cbf091eb94d6d5c8ff7e7634f838bdb0b2395e9f347e0427abd611cdfcab3e';
const pk = '031f4a75e314d492f06ebb11aa619cb576dea7bc4f3b63c945c663b150caf7c8f8';

// ✨ Función principal async
const run = async () => {
  const event = {
    kind: 30000,
    pubkey: pk,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["d", `placeholder-order-${Date.now()}`],
      ["type", "buy"],
      ["amount", "100000"],
      ["fiat", "USD"],
      ["payment_method", "paypal"]
    ],
    content: "Orden placeholder con fix final"
  };

  // 🔐 Firmar
  const evArray = [0, event.pubkey, event.created_at, event.kind, event.tags, event.content];
  const hash = sha256(new TextEncoder().encode(JSON.stringify(evArray)));
  event.id = Buffer.from(hash).toString('hex');

  const sig = await secp.sign(event.id, sk); 
  event.sig = Buffer.from(sig).toString('hex');

  // 🌐 Conectarse y enviar
  const ws = new WebSocket('wss://relay.mostro.network');

  ws.on('open', () => {
    console.log("✅ Conectado como:", pk);
    ws.send(JSON.stringify(["EVENT", event]));
  });

  ws.on('message', msg => {
    console.log("📨 Respuesta:", msg.toString());
  });
};

run();
