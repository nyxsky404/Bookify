export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly bookId: string,
    public readonly quantity: number,
    public readonly priceAtPurchase: number,
  ) {}

  getSubtotal(): number {
    return parseFloat((this.priceAtPurchase * this.quantity).toFixed(2));
  }
}
