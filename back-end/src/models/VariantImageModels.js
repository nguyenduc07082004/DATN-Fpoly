import { Schema, model } from 'mongoose';

const variantImageSchema = new Schema({
  variant_id: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
  url: { type: String, required: true },
  alt_text: { type: String },
  order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

export default model('VariantImage', variantImageSchema);
