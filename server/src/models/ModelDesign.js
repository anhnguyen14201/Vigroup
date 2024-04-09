import mongoose from 'mongoose'

const modelDesignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    thumbnail: {
      type: Array,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)
// Tạo model
export default mongoose.model('ModelDesign', modelDesignSchema)
