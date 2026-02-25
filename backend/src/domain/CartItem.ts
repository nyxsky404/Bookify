export class CartItem {
  constructor(
    public readonly id: string,
    public readonly cartId: string,
    public readonly bookId: string,
    public quantity: number,
    public readonly addedAt: Date,
  ) {}

  updateQuantity(qty: number): void {
    if (qty < 1) throw new Error('Quantity must be at least 1');
    this.quantity = qty;
  }

  getSubtotal(pricePerUnit: number): number {
    return parseFloat((pricePerUnit * this.quantity).toFixed(2));
  }
}
