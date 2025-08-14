import { MongoClient, Db, Collection } from 'mongodb';
import { Product, Batch } from '../types';

class MongoDBService {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI environment variable is required');
    }
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      const dbName = process.env.MONGO_DB || 'MACON_Production';
      this.db = this.client.db(dbName);
      console.log(`Connected to MongoDB database: ${dbName}`);
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  getProductsCollection(): Collection<Product> {
    if (!this.db) throw new Error('Database not connected');
    return this.db.collection<Product>('Products');
  }

  getBatchesCollection(): Collection<Batch> {
    if (!this.db) throw new Error('Database not connected');
    return this.db.collection<Batch>('Batches');
  }

  async getProducts(query?: string, profile?: string): Promise<Product[]> {
    const collection = this.getProductsCollection();
    const filter: any = {};

    if (query) {
      const regex = new RegExp(query, 'i');
      filter.$or = [
        { Name: regex },
        { FileName: regex },
        { Profile: regex },
        { Data8: regex }
      ];
    }

    if (profile) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { Profile: new RegExp(profile, 'i') },
          { Data8: new RegExp(profile, 'i') }
        ]
      });
    }

    return collection.find(filter).toArray();
  }

  async getBatches(): Promise<Batch[]> {
    const collection = this.getBatchesCollection();
    return collection.find({}).toArray();
  }

  async createBatch(batch: Omit<Batch, '_id'>): Promise<Batch> {
    const collection = this.getBatchesCollection();
    const result = await collection.insertOne(batch);
    return { ...batch, _id: result.insertedId.toString() };
  }

  async updateBatch(index: number, updates: Partial<Batch>): Promise<Batch | null> {
    const collection = this.getBatchesCollection();
    const result = await collection.findOneAndUpdate(
      { index },
      { $set: { ...updates, index } },
      { 
        upsert: true, 
        returnDocument: 'after' 
      }
    );
    return result;
  }
}

export const mongoService = new MongoDBService();