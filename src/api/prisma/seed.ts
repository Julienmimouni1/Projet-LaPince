import { PrismaClient, CategoryType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';


const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log('🌱 Début du seeding catégories...');

  const defaultCategories = [
    { name: 'Salaire', type: CategoryType.INCOME, color: '#10B981', icon: 'Banknote' },
    { name: 'Alimentation', type: CategoryType.EXPENSE, color: '#F59E0B', icon: 'ShoppingCart' },
    { name: 'Logement', type: CategoryType.EXPENSE, color: '#6366F1', icon: 'Home' }
  ];

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { name: cat.name },
    update: {},
    create: {
        name: cat.name,
        type: cat.type,
        color: cat.color,
        icon: cat.icon,
        is_default: true,
      },
    });
  }

  console.log('✅ Seeding terminé');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });