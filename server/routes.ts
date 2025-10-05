import type { Express } from "express";
import { storage } from "./storage";
import { insertCategorySchema, insertChannelSchema } from "@shared/schema";

export function registerRoutes(app: Express) {
  // Categories
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:slug", async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  });

  app.post("/api/categories", async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const category = await storage.createCategory(result.data);
    res.json(category);
  });

  app.patch("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await storage.updateCategory(id, req.body);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ success: true });
  });

  // Channels
  app.get("/api/channels", async (req, res) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    
    if (categoryId) {
      const channels = await storage.getChannelsByCategory(categoryId);
      res.json(channels);
    } else {
      const channels = await storage.getChannels();
      res.json(channels);
    }
  });

  app.get("/api/channels/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const channel = await storage.getChannelById(id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    res.json(channel);
  });

  app.post("/api/channels", async (req, res) => {
    const result = insertChannelSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const channel = await storage.createChannel(result.data);
    res.json(channel);
  });

  app.patch("/api/channels/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const channel = await storage.updateChannel(id, req.body);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    res.json(channel);
  });

  app.delete("/api/channels/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteChannel(id);
    if (!deleted) {
      return res.status(404).json({ error: "Channel not found" });
    }
    res.json({ success: true });
  });
}
