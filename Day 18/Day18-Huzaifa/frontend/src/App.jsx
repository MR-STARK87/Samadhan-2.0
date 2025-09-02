import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  getBoard,
  createList,
  createCard,
  renameList,
  moveOrUpdateCard,
} from "./api.js";

export default function App() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await getBoard();
      setLists(data.lists);
    } catch (e) {
      console.error(e);
      alert("Failed to load board");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function optimisticMove(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return { revert: false };

    const sourceListIdx = lists.findIndex((l) => l._id === source.droppableId);
    const destListIdx = lists.findIndex(
      (l) => l._id === destination.droppableId
    );
    if (sourceListIdx === -1 || destListIdx === -1) return { revert: false };

    const next = structuredClone(lists);
    const [moved] = next[sourceListIdx].cards.splice(source.index, 1);
    next[destListIdx].cards.splice(destination.index, 0, moved);

    // Recompute order indices locally
    next[sourceListIdx].cards = next[sourceListIdx].cards.map((c, i) => ({
      ...c,
      order: i,
    }));
    next[destListIdx].cards = next[destListIdx].cards.map((c, i) => ({
      ...c,
      order: i,
    }));
    // Update moved card listId if changed
    if (source.droppableId !== destination.droppableId) {
      next[destListIdx].cards[destination.index].listId =
        destination.droppableId;
    }

    setLists(next);
    return {
      movedCardId: draggableId,
      toListId: destination.droppableId,
      toIndex: destination.index,
      fromListId: source.droppableId,
      fromIndex: source.index,
    };
  }

  async function onDragEnd(result) {
    if (!result.destination) return;
    const info = optimisticMove(result);
    if (!info.movedCardId) return;

    try {
      await moveOrUpdateCard(info.movedCardId, {
        toListId: info.toListId,
        toIndex: info.toIndex,
      });
    } catch (e) {
      console.error(e);
      // If server fails, reload to reconcile
      await load();
      alert("Move failed, state reloaded.");
    }
  }

  async function handleCreateList(e) {
    e.preventDefault();
    const name = newListName.trim();
    if (!name) return;
    try {
      const created = await createList(name);
      setLists((prev) => [...prev, { ...created, cards: [] }]);
      setNewListName("");
    } catch (e) {
      console.error(e);
      alert("Failed to create list");
    }
  }

  async function handleRenameList(listId, name) {
    const newName = prompt("Rename list to:", name);
    if (!newName) return;
    try {
      const updated = await renameList(listId, newName);
      setLists((prev) =>
        prev.map((l) => (l._id === listId ? { ...l, name: updated.name } : l))
      );
    } catch (e) {
      console.error(e);
      alert("Failed to rename list");
    }
  }

  async function handleAddCard(listId) {
    const title = prompt("Card title");
    if (!title) return;
    try {
      const card = await createCard(listId, title);
      setLists((prev) =>
        prev.map((l) =>
          l._id === listId ? { ...l, cards: [...l.cards, card] } : l
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to add card");
    }
  }

  return (
    <div className="app">
      <header className="app-bar">
        <h1>Trello Lite</h1>
        <form onSubmit={handleCreateList} className="new-list">
          <input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
          />
          <button type="submit">Add List</button>
        </form>
      </header>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="board">
            {lists.map((list) => (
              <section key={list._id} className="list">
                <div className="list-header">
                  <h2
                    onClick={() => handleRenameList(list._id, list.name)}
                    title="Click to rename"
                  >
                    {list.name}
                  </h2>
                  <button onClick={() => handleAddCard(list._id)}>+ Add</button>
                </div>

                <Droppable droppableId={list._id} type="CARD">
                  {(provided) => (
                    <div
                      className="cards"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {list.cards.map((card, index) => (
                        <Draggable
                          key={card._id}
                          draggableId={card._id}
                          index={index}
                        >
                          {(prov) => (
                            <article
                              className="card"
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              title={card.title}
                            >
                              {card.title}
                            </article>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </section>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
