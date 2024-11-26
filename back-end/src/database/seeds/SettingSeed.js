import Setting from '../../models/SettingModels.js';

export const settings = [
  {
    key: "site_title",
    value: "My E-commerce Site"
  },
  {
    key: "currency",
    value: "USD"
  },
  {
    key: "tax_rate",
    value: 0.15
  },
];

export const insertSettings = () => Setting.insertMany(settings);
