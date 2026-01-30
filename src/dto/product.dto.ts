export class CreateProductDTO {
  title!: string;
  description?: string;
  price!: number;
  category?: string;
  tags?: string[];
  isDigital?: boolean;
  stock?: number;
}

export class UpdateProductDTO {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  tags?: string[];
  status?: string;
  stock?: number;
}

export class ProductResponseDTO {
  id!: string;
  creatorId!: string;
  title!: string;
  slug!: string;
  description?: string;
  price!: number;
  rating!: number;
  totalReviews!: number;
  status!: string;
  createdAt!: Date;
}
