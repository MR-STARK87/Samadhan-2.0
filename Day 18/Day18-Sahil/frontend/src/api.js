const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getBoard() {
  const res = await fetch(`${API_URL}/api/board`);
  if (!res.ok) throw new Error("Failed to fetch board");
  return res.json();
}

export async function createList(name) {
  const res = await fetch(`${API_URL}/api/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create list");
  return res.json();
}

export async function renameList(id, name) {
  const res = await fetch(`${API_URL}/api/lists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to rename list");
  return res.json();
}

export async function createCard(listId, title) {
  const res = await fetch(`${API_URL}/api/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listId, title }),
  });
  if (!res.ok) throw new Error("Failed to create card");
  return res.json();
}

export async function moveOrUpdateCard(id, payload) {
  const res = await fetch(`${API_URL}/api/cards/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update/move card");
  return res.json();
}
