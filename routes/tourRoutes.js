const express = require('express');

const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
// eslint-disable-next-line import/no-useless-path-segments
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkID);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTours
  );
router
  .route('/:id')
  .get(tourController.getOneTours)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.resizeTourImages,
    tourController.uploadTourImages,
    tourController.updateTours
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
