// Browser-only order store for the demo checkout. Orders live in
// sessionStorage so the confirmation and ticket pages survive a refresh but
// vanish when the tab closes. The real system replaces this with Postgres
// + payment-provider webhooks — see /specs/ticketing-system.md.

const KEY = "klp-demo-orders";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

function randomCode(len) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

export function newOrderId() {
  return `KLP-${randomCode(6)}`;
}

export function newTicketCode() {
  return randomCode(12);
}

function readAll() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveOrder(order) {
  try {
    const all = readAll();
    all[order.id] = order;
    sessionStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Private mode / storage blocked — the confirmation page handles a miss.
  }
}

export function getOrder(id) {
  return readAll()[id] || null;
}

export function findTicket(code) {
  for (const order of Object.values(readAll())) {
    const ticket = order.tickets.find((t) => t.code === code);
    if (ticket) return { order, ticket };
  }
  return null;
}
