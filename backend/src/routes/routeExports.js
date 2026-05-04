const { catRouter, orderRouter, reviewRouter, uploadRouter, bannerRouter, dashRouter, wishlistRouter, couponRouter } = require('./allRoutes');

// Re-export each router individually
module.exports.categories = catRouter;
module.exports.orders = orderRouter;
module.exports.reviews = reviewRouter;
module.exports.upload = uploadRouter;
module.exports.banners = bannerRouter;
module.exports.dashboard = dashRouter;
module.exports.wishlist = wishlistRouter;
module.exports.coupons = couponRouter;
