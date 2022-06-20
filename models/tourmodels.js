const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must hava a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less than 40 characters'],
      minlenght: [10, 'A tour must have more than 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Must have groupsize'],
    },
    difficulty: {
      type: String,
      required: [true, 'Must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        messagen: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4,
      min: [1, 'Ratings must be greater than 1.0'],
      max: [5, 'Rating must be less than 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price should not be empty'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, 'Must have summary'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'must have a cover image'],
    },
    images: [String],
    createdAT: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//model
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
//dcoument middleware: runs before .save() and .create()()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
//EMBEDING
// tourSchema.pre('save', async function (next) {
//   const guidePromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromise);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
