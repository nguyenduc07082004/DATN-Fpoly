import Category from '../../models/CategoryModels.js';

export const categories = [
  {
    parent_id: null,
    name: "Smartphones",
    slug: "smartphones",
    status: "active"
  },
  {
    parent_id: null,
    name: "Accessories",
    slug: "accessories",
    status: "active"
  },
  {
    parent_id: null,
    name: "Laptops",
    slug: "laptops",
    status: "active"
  }
];

export const insertCategories = () => Category.insertMany(categories);
