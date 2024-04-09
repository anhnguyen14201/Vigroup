import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    quantity: {
      type: Number,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },

    images: {
      type: Array,
    },

    color: {
      type: String,
      enum: ['Black', 'Grown', 'Red'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)
// Tạo model
export default mongoose.model('Product', productSchema)
