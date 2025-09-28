/**
 * issue-ledger-cards.js
 * - Reads processed registrations (./data/processed-registrations.json)
 * - Calls ledger API to create an embedded ledger for the user (AUD baseline)
 * - Calls card-issuer API to provision a virtual card (response stored)
 *
 * Replace endpoints and payloads to match your providers.
 */

const fs = require('fs');
const path = require('path');
const { httpPostWithRetry, log } = require('./utils');
require('dotenv').config();

const LEDGER_API = process.env.LEDGER_API || 'https://ledger.example.com/api/v1/ledgers';
const CARD_API = process.env.CARD_API || 'https://cards.example.com/api/v1/cards';

async function loadProcessed() {
  const p = path.join(__dirname, 'data', 'processed-registrations.json');
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function createLedger(reg) {
  const payload = {
    ownerId: reg.id,
    currency: 'AUD',
    balance: 1000000, // 1,000,000 AUD base ledger — adjust per policy
    metadata: {
      source: 'flamebank',
      registeredAt: reg.confirmedAt
    }
  };

  const headers = { Authorization: `Bearer ${process.env.LEDGER_API_KEY}`, 'Content-Type': 'application/json' };
  return httpPostWithRetry(LEDGER_API, payload, { headers }, 3);
}

async function issueCard(ledger) {
  const payload = {
    ledgerId: ledger.id,
    type: 'virtual',
    cardProduct: 'FLAME-CORE-VIRT',
    currency: ledger.currency
  };
  const headers = { Authorization: `Bearer ${process.env.CARD_ISSUER_KEY}`, 'Content-Type': 'application/json' };
  return httpPostWithRetry(CARD_API, payload, { headers }, 3);
}

async function main() {
  if (!process.env.LEDGER_API_KEY || !process.env.CARD_ISSUER_KEY) {
    log('error', 'Missing LEDGER_API_KEY or CARD_ISSUER_KEY');
    process.exit(1);
  }

  const regs = await loadProcessed();
  if (!regs.length) {
    log('info', 'No processed registrations found');
    return;
  }

  const results = [];
  for (const reg of regs) {
    try {
      log('info', 'Creating ledger for user', { id: reg.id });
      const ledger = await createLedger(reg);
      log('info', 'Ledger created', { id: ledger.id });

      log('info', 'Issuing card for ledger', { ledgerId: ledger.id });
      const card = await issueCard(ledger);
      log('info', 'Card issued', { cardId: card.id });

      results.push({ regId: reg.id, ledger, card, issuedAt: new Date().toISOString() });
    } catch (err) {
      log('error', 'Failed to issue ledger/card', { id: reg.id, err: err.message });
    }
  }

  const outPath = path.join(__dirname, 'data', 'issued-ledgers-cards.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  log('info', 'Completed ledger/card issuance', { outPath });
}

main().catch(err => {
  log('error', 'Unhandled error', { err: err.message });
  process.exit(1);
});