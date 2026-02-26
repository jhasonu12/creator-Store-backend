import { Sequelize } from 'sequelize';
import { initUser } from './User';
import { initRefreshToken } from './RefreshToken';
import { initCreatorProfile } from './CreatorProfile';
import { initStoreSlug } from './StoreSlug';
import { initStore } from './Store';
import { initStoreSection } from './StoreSection';
import { initStorePage } from './StorePage';
import { initPageBlock } from './PageBlock';
import { initStoreTheme } from './StoreTheme';
import { initProduct } from './Product';
import { initProductFile } from './ProductFile';
import { initCourse } from './Course';
import { initCourseSection } from './CourseSection';
import { initCourseLesson } from './CourseLesson';
import { initCourseProgress } from './CourseProgress';
import { initOrder } from './Order';
import { initOrderItem } from './OrderItem';
import { initPayment } from './Payment';
import { initSubscription } from './Subscription';
import { initSponsoredProduct } from './SponsoredProduct';
import { initAdImpression } from './AdImpression';
import { initCoupon } from './Coupon';
import { initAnalyticsEvent } from './AnalyticsEvent';
import { initMarketplaceProduct } from './MarketplaceProduct';

export const initializeModels = (sequelize: Sequelize) => {
  // Initialize all 24 models
  const User = initUser(sequelize);
  const RefreshToken = initRefreshToken(sequelize);
  const CreatorProfile = initCreatorProfile(sequelize);
  const StoreSlug = initStoreSlug(sequelize);
  const Store = initStore(sequelize);
  const StoreSection = initStoreSection(sequelize);
  const StorePage = initStorePage(sequelize);
  const PageBlock = initPageBlock(sequelize);
  const StoreTheme = initStoreTheme(sequelize);
  const Product = initProduct(sequelize);
  const ProductFile = initProductFile(sequelize);
  const Course = initCourse(sequelize);
  const CourseSection = initCourseSection(sequelize);
  const CourseLesson = initCourseLesson(sequelize);
  const CourseProgress = initCourseProgress(sequelize);
  const Order = initOrder(sequelize);
  const OrderItem = initOrderItem(sequelize);
  const Payment = initPayment(sequelize);
  const Subscription = initSubscription(sequelize);
  const SponsoredProduct = initSponsoredProduct(sequelize);
  const AdImpression = initAdImpression(sequelize);
  const Coupon = initCoupon(sequelize);
  const AnalyticsEvent = initAnalyticsEvent(sequelize);
  const MarketplaceProduct = initMarketplaceProduct(sequelize);

  // Define associations

  // === User Associations ===
  // User -> RefreshToken (1:N)
  User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
  RefreshToken.belongsTo(User, { foreignKey: 'userId' });

  // User -> CreatorProfile (1:1)
  User.hasOne(CreatorProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
  CreatorProfile.belongsTo(User, { foreignKey: 'userId' });

  // User -> StoreSlug (1:1) - when user is a creator
  User.hasOne(StoreSlug, { foreignKey: 'creatorId', onDelete: 'CASCADE' });
  StoreSlug.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

  // User -> Product (1:N) - products created by user
  User.hasMany(Product, { foreignKey: 'creatorId', onDelete: 'CASCADE' });
  Product.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

  // User -> Order (1:N) - buyer orders
  User.hasMany(Order, { foreignKey: 'buyerId', onDelete: 'SET NULL' });
  Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

  // User -> Subscription (1:N)
  User.hasMany(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Subscription.belongsTo(User, { foreignKey: 'userId' });

  // User -> CourseProgress (1:N)
  User.hasMany(CourseProgress, { foreignKey: 'userId', onDelete: 'CASCADE' });
  CourseProgress.belongsTo(User, { foreignKey: 'userId' });

  // User -> AnalyticsEvent (1:N)
  User.hasMany(AnalyticsEvent, { foreignKey: 'userId', onDelete: 'SET NULL' });
  AnalyticsEvent.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // User -> AdImpression (1:N)
  User.hasMany(AdImpression, { foreignKey: 'userId', onDelete: 'SET NULL' });
  AdImpression.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // === Product Associations ===
  // Product -> ProductFile (1:N) - for digital files
  Product.hasMany(ProductFile, { foreignKey: 'productId', onDelete: 'CASCADE' });
  ProductFile.belongsTo(Product, { foreignKey: 'productId' });

  // Product -> Course (1:1) - when product type is COURSE
  Product.hasOne(Course, { foreignKey: 'productId', onDelete: 'CASCADE' });
  Course.belongsTo(Product, { foreignKey: 'productId' });

  // Product -> OrderItem (1:N)
  Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId' });

  // Product -> Subscription (1:N)
  Product.hasMany(Subscription, { foreignKey: 'productId', onDelete: 'CASCADE' });
  Subscription.belongsTo(Product, { foreignKey: 'productId' });

  // Product -> SponsoredProduct (1:1)
  Product.hasOne(SponsoredProduct, { foreignKey: 'productId', onDelete: 'CASCADE' });
  SponsoredProduct.belongsTo(Product, { foreignKey: 'productId' });

  // Product -> AnalyticsEvent (1:N)
  Product.hasMany(AnalyticsEvent, { foreignKey: 'productId', onDelete: 'SET NULL' });
  AnalyticsEvent.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // Product -> MarketplaceProduct (1:1)
  Product.hasOne(MarketplaceProduct, { foreignKey: 'productId', onDelete: 'CASCADE' });
  MarketplaceProduct.belongsTo(Product, { foreignKey: 'productId' });

  // === Course/Lesson Associations ===
  // Course -> CourseSection (1:N)
  Course.hasMany(CourseSection, { foreignKey: 'courseId', onDelete: 'CASCADE' });
  CourseSection.belongsTo(Course, { foreignKey: 'courseId' });

  // CourseSection -> CourseLesson (1:N)
  CourseSection.hasMany(CourseLesson, { foreignKey: 'sectionId', onDelete: 'CASCADE' });
  CourseLesson.belongsTo(CourseSection, { foreignKey: 'sectionId' });

  // Course -> CourseProgress (1:N)
  Course.hasMany(CourseProgress, { foreignKey: 'courseId', onDelete: 'CASCADE' });
  CourseProgress.belongsTo(Course, { foreignKey: 'courseId' });

  // === Order/Payment Associations ===
  // Order -> OrderItem (1:N)
  Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  // Order -> Payment (1:1)
  Order.hasOne(Payment, { foreignKey: 'orderId', onDelete: 'CASCADE' });
  Payment.belongsTo(Order, { foreignKey: 'orderId' });

  // CreatorProfile -> OrderItem (1:N)
  CreatorProfile.hasMany(OrderItem, { foreignKey: 'creatorId', onDelete: 'SET NULL' });
  OrderItem.belongsTo(CreatorProfile, { foreignKey: 'creatorId', as: 'creator' });

  // === Marketplace/Ads Associations ===
  // CreatorProfile -> SponsoredProduct (1:N)
  CreatorProfile.hasMany(SponsoredProduct, { foreignKey: 'creatorId', onDelete: 'CASCADE' });
  SponsoredProduct.belongsTo(CreatorProfile, { foreignKey: 'creatorId', as: 'creator' });

  // SponsoredProduct -> AdImpression (1:N)
  SponsoredProduct.hasMany(AdImpression, { foreignKey: 'sponsoredProductId', onDelete: 'CASCADE' });
  AdImpression.belongsTo(SponsoredProduct, { foreignKey: 'sponsoredProductId' });

  // === Analytics Association ===
  // CreatorProfile -> AnalyticsEvent (1:N)
  CreatorProfile.hasMany(AnalyticsEvent, { foreignKey: 'creatorId', onDelete: 'SET NULL' });
  AnalyticsEvent.belongsTo(CreatorProfile, { foreignKey: 'creatorId', as: 'creator' });

  // === Store Builder Associations ===
  // CreatorProfile -> Store (1:1)
  CreatorProfile.hasOne(Store, { foreignKey: 'creatorId', onDelete: 'CASCADE' });
  Store.belongsTo(CreatorProfile, { foreignKey: 'creatorId', as: 'creatorProfile' });

  // Store -> StoreSection (1:N)
  Store.hasMany(StoreSection, { foreignKey: 'storeId', onDelete: 'CASCADE', as: 'sections' });
  StoreSection.belongsTo(Store, { foreignKey: 'storeId' });

  // Store -> StorePage (1:N)
  Store.hasMany(StorePage, { foreignKey: 'storeId', onDelete: 'CASCADE', as: 'pages' });
  StorePage.belongsTo(Store, { foreignKey: 'storeId' });

  // StorePage -> PageBlock (1:N)
  StorePage.hasMany(PageBlock, { foreignKey: 'pageId', onDelete: 'CASCADE', as: 'blocks' });
  PageBlock.belongsTo(StorePage, { foreignKey: 'pageId' });

  // Store -> StoreTheme (1:1)
  Store.hasOne(StoreTheme, { foreignKey: 'storeId', onDelete: 'CASCADE', as: 'theme' });
  StoreTheme.belongsTo(Store, { foreignKey: 'storeId' });

  // StorePage -> Product (1:N)
  Product.hasMany(StorePage, { foreignKey: 'productId', onDelete: 'SET NULL' });
  StorePage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  return {
    User,
    RefreshToken,
    CreatorProfile,
    StoreSlug,
    Store,
    StoreSection,
    StorePage,
    PageBlock,
    StoreTheme,
    Product,
    ProductFile,
    Course,
    CourseSection,
    CourseLesson,
    CourseProgress,
    Order,
    OrderItem,
    Payment,
    Subscription,
    SponsoredProduct,
    AdImpression,
    Coupon,
    AnalyticsEvent,
    MarketplaceProduct,
  };
};

// Export all model classes and enums
export { User, UserRole } from './User';
export * from './RefreshToken';
export * from './CreatorProfile';
export { StoreSlug, StoreSlugStatus } from './StoreSlug';
export { Store, StoreType, StoreStatus } from './Store';
export { StoreSection, SectionType, SectionStatus } from './StoreSection';
export { StorePage, PageType, PageStatus } from './StorePage';
export { PageBlock, BlockType } from './PageBlock';
export * from './StoreTheme';
export { Product, ProductType, ProductStatus } from './Product';
export * from './ProductFile';
export * from './Course';
export * from './CourseSection';
export * from './CourseLesson';
export * from './CourseProgress';
export { Order, OrderStatus } from './Order';
export * from './OrderItem';
export { Payment, PaymentStatus } from './Payment';
export { Subscription, SubscriptionStatus } from './Subscription';
export { SponsoredProduct, SponsoredProductStatus, PricingModel } from './SponsoredProduct';
export * from './AdImpression';
export { Coupon, DiscountType } from './Coupon';
export * from './AnalyticsEvent';
export * from './MarketplaceProduct';
