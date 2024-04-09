import mongoose from 'mongoose'

const sliderSchema = new mongoose.Schema(
  {
    image: {
      type: Array,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)
// Tạo model
export default mongoose.model('Slider', sliderSchema)
