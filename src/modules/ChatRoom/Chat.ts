export type Product = {
  id: string;
  price: number;
  vendor: string;
  brand: string;
  links: {
    product_url: string;
    image_url: string;
  };
  attributes: {
    size: string;
    type: string;
    material: string;
  };
  tags: string[];
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  products: Product[];
  timestamp: string;
};
