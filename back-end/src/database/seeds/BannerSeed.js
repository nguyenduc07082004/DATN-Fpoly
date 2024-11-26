import Banner from '../../models/BannerModels.js'

export const banners = [
  {
    image_url: "https://www.apple.com/v/iphone/home/ab/images/overview/hero/iphone_15_pro_hero__c5qk8gswq16a_large.jpg",
    link: "https://www.apple.com/iphone-15",
    status: "active",
  },
  // Thêm các banner khác nếu cần
];

export const insertBanners = () => Banner.insertMany(banners);
