/**
 * hash-registrations.js
 * - Loads pending registration files (example: ./data/pending-registrations.json)
 * - Hashes payloads and writes a minimal transaction to the configured Web3 provider
 * - NOTE: This script intentionally simple. Integrate with your signing/relay policy.
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const { log } = require('./utils');

require('dotenv').config();

async function loadPending() {
  const p = path.join(__dirname, 'data', 'pending-registrations.json');
  if (!fs.existsSync(p)) {
    log('info', 'No pending registrations file found', { path: p });
    return [];
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function main() {
  const RPC = process.env.WEB3_RPC_URL;
  const PK = process.env.WEB3_PRIVATE_KEY;
  if (!RPC || !PK) {
    log('error', 'Missing WEB3_RPC_URL or WEB3_PRIVATE_KEY');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(PK, provider);

  const pending = await loadPending();
  if (!pending.length) {
    log('info', 'No pending registrations to process');
    return;
  }

  // Use a simple contract-less hash via a zero-value tx with data (option for EIP-712 offchain too)
  for (const reg of pending) {
    try {
      const payload = JSON.stringify({
        id: reg.id,
        phoneHash: reg.phoneHash || null,
        timestamp: new Date().toISOString(),
        metadata: reg.metadata || {}
      });

      const hash = ethers.sha256(ethers.toUtf8Bytes(payload));
      log('info', 'Computed registration hash', { id: reg.id, hash });

      // Example: send a minimal transaction with the hash in data (replace with your relay/contract)
      const tx = await wallet.sendTransaction({
        to: wallet.address, // self-send to record in ledger; swap for contract if required
        value: 0,
        data: hash
      });

      log('info', 'Submitted tx', { id: reg.id, txHash: tx.hash });
      // Optionally wait for confirmation:
      await tx.wait(1);
      log('info', 'Tx confirmed', { id: reg.id, txHash: tx.hash });

      // mark as completed (write to ./data/processed-registrations.json)
      // append to processed file
      const processedPath = path.join(__dirname, 'data', 'processed-registrations.json');
      let processed = [];
      if (fs.existsSync(processedPath)) processed = JSON.parse(fs.readFileSync(processedPath, 'utf8'));
      processed.push({ ...reg, hash, txHash: tx.hash, confirmedAt: new Date().toISOString() });
      fs.writeFileSync(processedPath, JSON.stringify(processed, null, 2));
    } catch (err) {
      log('error', 'Failed to process registration', { id: reg.id, err: err.message });
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});