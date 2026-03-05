export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface OrderValidationContext {
  userId: string;
  items: Array<{ bookId: string; quantity: number; availableStock: number }>;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
}

export abstract class OrderValidator {
  protected next: OrderValidator | null = null;

  setNext(validator: OrderValidator): OrderValidator {
    this.next = validator;
    return validator;
  }

  validate(ctx: OrderValidationContext): ValidationResult {
    const result = this.doValidate(ctx);
    if (!result.valid) return result;
    if (this.next) return this.next.validate(ctx);
    return { valid: true };
  }

  protected abstract doValidate(ctx: OrderValidationContext): ValidationResult;
}

export class UserValidator extends OrderValidator {
  protected doValidate(ctx: OrderValidationContext): ValidationResult {
    if (!ctx.userId) return { valid: false, error: 'User ID is required' };
    return { valid: true };
  }
}

export class StockValidator extends OrderValidator {
  protected doValidate(ctx: OrderValidationContext): ValidationResult {
    for (const item of ctx.items) {
      if (item.quantity <= 0) return { valid: false, error: `Invalid quantity for book ${item.bookId}` };
      if (item.availableStock < item.quantity) {
        return { valid: false, error: `Insufficient stock for book ${item.bookId}. Available: ${item.availableStock}` };
      }
    }
    if (ctx.items.length === 0) return { valid: false, error: 'Order must contain at least one item' };
    return { valid: true };
  }
}

export class AddressValidator extends OrderValidator {
  protected doValidate(ctx: OrderValidationContext): ValidationResult {
    if (!ctx.shippingStreet || !ctx.shippingCity || !ctx.shippingState || !ctx.shippingZipCode || !ctx.shippingCountry) {
      return { valid: false, error: 'Complete shipping address is required' };
    }
    return { valid: true };
  }
}

export class PaymentValidator extends OrderValidator {
  protected doValidate(_ctx: OrderValidationContext): ValidationResult {
    return { valid: true };
  }
}

export function buildOrderValidationChain(): OrderValidator {
  const user = new UserValidator();
  const stock = new StockValidator();
  const address = new AddressValidator();
  const payment = new PaymentValidator();
  user.setNext(stock).setNext(address).setNext(payment);
  return user;
}
