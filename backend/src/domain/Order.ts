import { Address } from './Address';
import { OrderStatus } from './enums';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly orderNumber: string,
    public totalAmount: number,
    public status: OrderStatus,
    public shippingAddress: Address,
    public paymentMethod: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deliveredAt: Date | null,
  ) {}

  canTransitionTo(newStatus: OrderStatus): boolean {
    return VALID_TRANSITIONS[this.status].includes(newStatus);
  }

  updateStatus(newStatus: OrderStatus): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this.status} to ${newStatus}`,
      );
    }
    this.status = newStatus;
    this.updatedAt = new Date();
    if (newStatus === OrderStatus.DELIVERED) {
      this.deliveredAt = new Date();
    }
  }

  cancel(): void {
    this.updateStatus(OrderStatus.CANCELLED);
  }

  canBeCancelled(): boolean {
    return this.canTransitionTo(OrderStatus.CANCELLED);
  }
}
