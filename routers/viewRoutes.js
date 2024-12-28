const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const User = require('../models/userModel'); // Adjust the path as necessary
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewController.alerts);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);

router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);

// /login
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up'
  });
});
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/my-tours',
  // bookingController.createBookingCheckout,
  authController.protect,
  viewController.getMyTours
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

// Add the manage-users route
router.get('/manage-users', authController.protect, async (req, res) => {
  try {
    // Fetch users from your database
    const users = await User.find().select('name role photo'); // Adjust the fields as necessary
    res.render('manage-users', { users });
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

router.patch('/delete-user/:id', authController.protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error deleting user' });
  }
});

router.get(
  '/manage-reviews',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageReviews
);

router.get(
  '/manage-tours',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageTours
);
module.exports = router;
