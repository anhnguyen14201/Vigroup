import mongoose from 'mongoose'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'member',
    },

    cart: [
      {
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: String,
      },
    ],

    refreshToken: {
      type: String,
    },

    registerToken: {
      type: String,
    },

    passwordChangedAt: {
      type: String,
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
)

userSchema.methods = {
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000
    return resetToken
  },
}

export default mongoose.model('User', userSchema)
