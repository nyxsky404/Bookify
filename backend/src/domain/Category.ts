export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public slug: string,
    public readonly createdAt: Date,
  ) {}
}
