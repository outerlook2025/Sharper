import type { Category, Channel, InsertCategory, InsertChannel } from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Channels
  getChannels(): Promise<Channel[]>;
  getChannelById(id: number): Promise<Channel | undefined>;
  getChannelsByCategory(categoryId: number): Promise<Channel[]>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  updateChannel(id: number, channel: Partial<InsertChannel>): Promise<Channel | undefined>;
  deleteChannel(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category> = new Map();
  private channels: Map<number, Channel> = new Map();
  private categoryIdCounter = 1;
  private channelIdCounter = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    const sampleCategories = [
      { id: 1, name: "Sports", slug: "sports", iconUrl: "/channel-placeholder.svg", m3uUrl: null, order: 1 },
      { id: 2, name: "News", slug: "news", iconUrl: "/channel-placeholder.svg", m3uUrl: null, order: 2 },
      { id: 3, name: "Entertainment", slug: "entertainment", iconUrl: "/channel-placeholder.svg", m3uUrl: null, order: 3 },
    ];

    const sampleChannels = [
      { id: 1, name: "Sports Channel 1", logoUrl: "/channel-placeholder.svg", streamUrl: "https://example.com/stream1", categoryId: 1, authCookie: null },
      { id: 2, name: "News Channel 1", logoUrl: "/channel-placeholder.svg", streamUrl: "https://example.com/stream2", categoryId: 2, authCookie: null },
    ];

    sampleCategories.forEach(cat => {
      this.categories.set(cat.id, cat);
      this.categoryIdCounter = Math.max(this.categoryIdCounter, cat.id + 1);
    });

    sampleChannels.forEach(ch => {
      this.channels.set(ch.id, ch);
      this.channelIdCounter = Math.max(this.channelIdCounter, ch.id + 1);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getChannels(): Promise<Channel[]> {
    return Array.from(this.channels.values());
  }

  async getChannelById(id: number): Promise<Channel | undefined> {
    return this.channels.get(id);
  }

  async getChannelsByCategory(categoryId: number): Promise<Channel[]> {
    return Array.from(this.channels.values()).filter(ch => ch.categoryId === categoryId);
  }

  async createChannel(channel: InsertChannel): Promise<Channel> {
    const id = this.channelIdCounter++;
    const newChannel: Channel = { ...channel, id };
    this.channels.set(id, newChannel);
    return newChannel;
  }

  async updateChannel(id: number, channel: Partial<InsertChannel>): Promise<Channel | undefined> {
    const existing = this.channels.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...channel };
    this.channels.set(id, updated);
    return updated;
  }

  async deleteChannel(id: number): Promise<boolean> {
    return this.channels.delete(id);
  }
}

export const storage = new MemStorage();
