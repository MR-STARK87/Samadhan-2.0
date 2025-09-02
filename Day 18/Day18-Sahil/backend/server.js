import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Mongo models
const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true, index: true },
  },
  { timestamps: true }
);

const cardSchema = new mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    order: { type: Number, required: true, index: true },
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);
const Card = mongoose.model("Card", cardSchema);

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Board: fetch all lists with their cards
app.get("/api/board", async (req, res) => {
  try {
    const lists = await List.find().sort({ order: 1 }).lean();
    const listIds = lists.map((l) => l._id);
    const cards = await Card.find({ listId: { $in: listIds } })
      .sort({ order: 1 })
      .lean();

    const byList = new Map(listIds.map((id) => [id.toString(), []]));
    for (const c of cards) {
      const key = c.listId.toString();
      if (!byList.has(key)) byList.set(key, []);
      byList.get(key).push(c);
    }

    const payload = lists.map((l) => ({
      ...l,
      cards: byList.get(l._id.toString()) || [],
    }));

    res.json({ lists: payload });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load board" });
  }
});

// Create list
app.post("/api/lists", async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Name is required" });

    const last = await List.findOne().sort({ order: -1 }).lean();
    const order = last ? last.order + 1 : 0;
    const list = await List.create({ name, order });
    res.status(201).json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create list" });
  }
});

// Rename list
app.patch("/api/lists/:id", async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Name is required" });
    const updated = await List.findByIdAndUpdate(
      req.params.id,
      { $set: { name } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "List not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to rename list" });
  }
});

// Create card
app.post("/api/cards", async (req, res) => {
  try {
    const { listId, title } = req.body;
    if (!listId || !title)
      return res.status(400).json({ error: "listId and title required" });

    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ error: "List not found" });

    const last = await Card.findOne({ listId }).sort({ order: -1 }).lean();
    const order = last ? last.order + 1 : 0;
    const card = await Card.create({ listId, title: title.trim(), order });
    res.status(201).json(card);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create card" });
  }
});

// Update card (title/description) or move card (list and index)
app.patch("/api/cards/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cardId = req.params.id;
    const { title, description, toListId, toIndex } = req.body;

    let card = await Card.findById(cardId).session(session);
    if (!card) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Card not found" });
    }

    // Simple content update (no move)
    if (toListId === undefined && toIndex === undefined) {
      const updates = {};
      if (typeof title === "string") updates.title = title.trim();
      if (typeof description === "string") updates.description = description;
      card.set(updates);
      await card.save({ session });
      await session.commitTransaction();
      return res.json(card);
    }

    if (toListId === undefined || toIndex === undefined) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ error: "toListId and toIndex required for move" });
    }

    const fromListId = card.listId.toString();
    const destListId = toListId;
    const oldIndex = card.order;

    // Ensure destination list exists
    const destList = await List.findById(destListId).session(session);
    if (!destList) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Destination list not found" });
    }

    if (fromListId === destListId) {
      // Reorder within same list
      if (toIndex === oldIndex) {
        await session.commitTransaction();
        return res.json(card);
      }
      if (toIndex < oldIndex) {
        await Card.updateMany(
          { listId: card.listId, order: { $gte: toIndex, $lt: oldIndex } },
          { $inc: { order: 1 } },
          { session }
        );
      } else {
        await Card.updateMany(
          { listId: card.listId, order: { $gt: oldIndex, $lte: toIndex } },
          { $inc: { order: -1 } },
          { session }
        );
      }
      card.order = toIndex;
      await card.save({ session });
    } else {
      // Moving across lists
      // Close gap in source list
      await Card.updateMany(
        { listId: card.listId, order: { $gt: oldIndex } },
        { $inc: { order: -1 } },
        { session }
      );
      // Make room in destination list
      await Card.updateMany(
        { listId: destListId, order: { $gte: toIndex } },
        { $inc: { order: 1 } },
        { session }
      );
      // Move card
      card.listId = destListId;
      card.order = toIndex;
      await card.save({ session });
    }

    await session.commitTransaction();
    res.json(card);
  } catch (e) {
    console.error(e);
    await session.abortTransaction();
    res.status(500).json({ error: "Failed to update/move card" });
  } finally {
    session.endSession();
  }
});

// Seed data if empty
app.post("/api/seed", async (req, res) => {
  try {
    const count = await List.countDocuments();
    if (count > 0) return res.json({ ok: true, message: "Already seeded" });

    const lists = await List.insertMany([
      { name: "To Do", order: 0 },
      { name: "In Progress", order: 1 },
      { name: "Done", order: 2 },
    ]);

    const todoId = lists[0]._id;
    await Card.insertMany([
      { listId: todoId, title: "Welcome to Trello-lite", order: 0 },
      { listId: todoId, title: "Drag me into In Progress", order: 1 },
    ]);

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Seed failed" });
  }
});

// Start
async function start() {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || undefined,
  });
  console.log("MongoDB connected");
  app.listen(PORT, () =>
    console.log(`API running on http://localhost:${PORT}`)
  );
}
start();
