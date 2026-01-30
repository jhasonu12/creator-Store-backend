import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding database...');

  // Seed subscription tiers
  const basicTier = await prisma.subscriptionTier.upsert({
    where: { name: 'Basic' },
    update: {},
    create: {
      name: 'Basic',
      description: 'Basic tier subscription',
      price: 4.99,
      billingCycle: 'monthly',
      features: ['Early access', 'Community chat'],
      maxSupport: 1,
      isActive: true,
    },
  });

  const proPier = await prisma.subscriptionTier.upsert({
    where: { name: 'Pro' },
    update: {},
    create: {
      name: 'Pro',
      description: 'Professional tier subscription',
      price: 9.99,
      billingCycle: 'monthly',
      features: ['Early access', 'Community chat', 'Exclusive content', 'Direct messaging'],
      maxSupport: 2,
      isActive: true,
    },
  });

  const premiumTier = await prisma.subscriptionTier.upsert({
    where: { name: 'Premium' },
    update: {},
    create: {
      name: 'Premium',
      description: 'Premium tier subscription',
      price: 19.99,
      billingCycle: 'monthly',
      features: [
        'Early access',
        'Community chat',
        'Exclusive content',
        'Direct messaging',
        'Priority support',
        'Custom requests',
      ],
      maxSupport: 3,
      isActive: true,
    },
  });

  console.log('Subscription tiers seeded:', { basicTier, proPier, premiumTier });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
