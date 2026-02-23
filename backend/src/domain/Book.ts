export class Book {
  constructor(
    public readonly id: string,
    public title: string,
    public author: string,
    public isbn: string | null,
    public description: string | null,
    public price: number,
    public stockQuantity: number,
    public categoryId: string | null,
    public imageUrl: string | null,
    public publishedYear: number | null,
    public publisher: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  isAvailable(): boolean {
    return this.stockQuantity > 0;
  }

  isLowStock(threshold = 5): boolean {
    return this.stockQuantity > 0 && this.stockQuantity <= threshold;
  }

  reduceStock(quantity: number): void {
    if (quantity > this.stockQuantity) {
      throw new Error(`Insufficient stock for book "${this.title}"`);
    }
    this.stockQuantity -= quantity;
    this.updatedAt = new Date();
  }

  increaseStock(quantity: number): void {
    this.stockQuantity += quantity;
    this.updatedAt = new Date();
  }
}
