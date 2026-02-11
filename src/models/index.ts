import { Sequelize } from 'sequelize';
import { initUser } from './User';
import { initProfile } from './Profile';
import { initCreator } from './Creator';
import { initSubscriptionTier } from './SubscriptionTier';
import { initSubscriber } from './Subscriber';
import { initSubscription } from './Subscription';
import { initProduct } from './Product';
import { initOrder } from './Order';
import { initOrderItem } from './OrderItem';
import { initPayment } from './Payment';
import { initReview } from './Review';
import { initActivityLog } from './ActivityLog';

export const initializeModels = (sequelize: Sequelize) => {
  // Initialize all models
  const User = initUser(sequelize);
  const Profile = initProfile(sequelize);
  const Creator = initCreator(sequelize);
  const SubscriptionTier = initSubscriptionTier(sequelize);
  const Subscriber = initSubscriber(sequelize);
  const Subscription = initSubscription(sequelize);
  const Product = initProduct(sequelize);
  const Order = initOrder(sequelize);
  const OrderItem = initOrderItem(sequelize);
  const Payment = initPayment(sequelize);
  const Review = initReview(sequelize);
  const ActivityLog = initActivityLog(sequelize);

  // Define associations
  // User -> Profile (1:1)
  User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Profile.belongsTo(User, { foreignKey: 'userId' });

  // User -> Creator (1:1)
  User.hasOne(Creator, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Creator.belongsTo(User, { foreignKey: 'userId' });

  // User -> Subscriber (1:N) - as subscriber
  User.hasMany(Subscriber, { foreignKey: 'subscriberId', onDelete: 'CASCADE' });
  Subscriber.belongsTo(User, { foreignKey: 'subscriberId', as: 'subscriber' });

  // Creator -> Subscriber (1:N)
  Creator.hasMany(Subscriber, { foreignKey: 'creatorId', onDelete: 'CASCADE', as: 'subscribers' });
  Subscriber.belongsTo(Creator, { foreignKey: 'creatorId', as: 'creator' });

  // User -> Subscription (1:N)
  User.hasMany(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Subscription.belongsTo(User, { foreignKey: 'userId' });

  // SubscriptionTier -> Subscription (1:N)
  SubscriptionTier.hasMany(Subscription, { foreignKey: 'tierId' });
  Subscription.belongsTo(SubscriptionTier, { foreignKey: 'tierId', as: 'tier' });

  // Creator -> Product (1:N)
  Creator.hasMany(Product, { foreignKey: 'creatorId', onDelete: 'CASCADE', as: 'products' });
  Product.belongsTo(Creator, { foreignKey: 'creatorId', as: 'creator' });

  // User -> Order (1:N)
  User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Order.belongsTo(User, { foreignKey: 'userId' });

  // Order -> OrderItem (1:N)
  Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  // Product -> OrderItem (1:N)
  Product.hasMany(OrderItem, { foreignKey: 'productId' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // Order -> Payment (1:1)
  Order.hasOne(Payment, { foreignKey: 'orderId', onDelete: 'CASCADE', as: 'payment' });
  Payment.belongsTo(Order, { foreignKey: 'orderId' });

  // Product -> Review (1:N)
  Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' });
  Review.belongsTo(Product, { foreignKey: 'productId' });

  // User -> Review (1:N)
  User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Review.belongsTo(User, { foreignKey: 'userId' });

  return {
    User,
    Profile,
    Creator,
    SubscriptionTier,
    Subscriber,
    Subscription,
    Product,
    Order,
    OrderItem,
    Payment,
    Review,
    ActivityLog,
  };
};

export * from './User';
export * from './Profile';
export * from './Creator';
export * from './SubscriptionTier';
export * from './Subscriber';
export * from './Subscription';
export * from './Product';
export * from './Order';
export * from './OrderItem';
export * from './Payment';
export * from './Review';
export * from './ActivityLog';
