export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  imageUrl: string;
  featured: boolean;
  description: string;
}

export type NavigationLink = {
  name: string;
  path: string;
  icon?: string;
};