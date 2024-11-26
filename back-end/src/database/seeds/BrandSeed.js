import Brand from '../../models/BrandModels.js';

export const brands = [
  {
    name: "Apple",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_%28black%29.svg",
    status: "active"
  },
  {
    name: "Samsung",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    status: "active"
  },
  {
    name: "Huawei",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Huawei_logo_2018.svg",
    status: "inactive"
  },
];

export const insertBrands = () => Brand.insertMany(brands);
