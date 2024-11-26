import mongoose from 'mongoose';
import { insertBanners } from './seeds/BannerSeed.js';
import { insertBrands } from './seeds/BrandSeed.js';
import { insertCategories } from './seeds/CategorySeed.js';
import { insertProducts } from './seeds/ProductSeed.js';
import { insertSettings } from './seeds/SettingSeed.js';
import { insertUsers } from './seeds/UserSeed.js';

mongoose.connect('mongodb://localhost:27017/DUAN', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

async function seedDatabase() {
  try {
    await insertBanners();
    console.log('Banners inserted');
    await insertBrands();
    console.log('Brands inserted');
    await insertCategories();
    console.log('Categories inserted');
    await insertProducts();
    console.log('Products inserted');
    await insertSettings();
    console.log('Settings inserted');
    await insertUsers();
    console.log('Users inserted');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
