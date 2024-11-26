import Product from '../../models/ProductModels.js';

export const products = [
  {
    title: "iPhone 15",
    price: 999,
    storage: "128GB",
    color: "Black",
    image: "https://www.apple.com/v/iphone/home/ab/images/overview/hero/iphone_15_pro_hero__c5qk8gswq16a_large.jpg",
    categories: "Smartphones",  // category_id
    quantity: 100,
    description: "Latest iPhone with cutting-edge technology.",
  },
  {
    title: "Samsung Galaxy S23",
    price: 899,
    storage: "256GB",
    color: "White",
    image: "https://www.samsung.com/etc/designs/smg/global/imgs/logo-samsung.png",
    categories: "Smartphones",  // category_id
    quantity: 50,
    description: "The best Galaxy S series phone with powerful specs.",
  },
  // Add more products as needed
];

export const insertProducts = () => Product.insertMany(products);
