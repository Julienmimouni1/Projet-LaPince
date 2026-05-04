import { PrismaClient, CategoryType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';


const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log('🌱 Début du seeding catégories...');

  
  const defaultCategories = [
    // INCOME
  
  { name: 'Salaire', type: CategoryType.INCOME, color: '#10B981', icon: 'Banknote' },
  { name: 'Primes / Bonus', type: CategoryType.INCOME, color: '#059669', icon: 'Award' },
  { name: 'Ventes / Occasion', type: CategoryType.INCOME, color: '#22C55E', icon: 'Store' },
  { name: 'Revenus Passifs', type: CategoryType.INCOME, color: '#16A34A', icon: 'Zap' }, // Dividendes, droits d'auteur
  { name: 'Loyers perçus', type: CategoryType.INCOME, color: '#15803D', icon: 'Building' },
  { name: 'Investissements', type: CategoryType.INCOME, color: '#16A34A', icon: 'TrendingUp' },
  { name: 'Aides / Allocations', type: CategoryType.INCOME, color: '#059669', icon: 'HandCoins' },
  { name: 'Cadeaux reçus', type: CategoryType.INCOME, color: '#A7F3D0', icon: 'Gift' },
  { name: 'Prestations de services / Revenus pros', type: CategoryType.INCOME, color: '#047857', icon: 'Briefcase' },
  { name: 'Remboursements', type: CategoryType.INCOME, icon: 'RefreshCw' },
  { name: 'Autres revenus', type: CategoryType.INCOME, color: '#34D399', icon: 'PlusCircle' },


  // EXPENSE

  //Vie essentielle

  { name: 'Logement', type: CategoryType.EXPENSE, color: '#6366F1', icon: 'Home' },// on y retrouve le loyer ou le crédit immobilier (avec charges de copropriété)
  { name: 'Énergie / Eau', type: CategoryType.EXPENSE, color: '#3B82F6', icon: 'Zap' }, 
  { name: 'Assurances', type: CategoryType.EXPENSE, icon: 'Shield' },
  { name: 'Impôts & Taxes', type: CategoryType.EXPENSE, icon: 'Landmark' },

  // Vie quotidienne 
  { name: 'Alimentation', type: CategoryType.EXPENSE, color: '#F59E0B', icon: 'ShoppingCart' },
  { name: 'Hygiène & Soins', type: CategoryType.EXPENSE, color: '#F472B6', icon: 'Sparkles' },
  { name: 'Entretien / Maison', type: CategoryType.EXPENSE, color: '#818CF8', icon: 'Paintbrush' },

  // Transports 
  { name: 'Transports communs', type: CategoryType.EXPENSE, color: '#EF4444', icon: 'Car' },
  { name: 'Carburant', type: CategoryType.EXPENSE, color: '#EF4444', icon: 'Fuel' },
  { name: 'Maintenance Auto', type: CategoryType.EXPENSE, color: '#991B1B', icon: 'Wrench' }, // Réparations, CT
  { name: 'Parking & Péage', type: CategoryType.EXPENSE, color: '#B91C1C', icon: 'Ticket' },

  // Services
  { name: 'Tel / internet ', type: CategoryType.EXPENSE, color: '#3B82F6', icon: 'Receipt' },
  { name: 'Abonnements', type: CategoryType.EXPENSE, color: '#8B5CF6', icon: 'CreditCard' },

  // Loisirs et Style de vie

  { name: 'Restaurants', type: CategoryType.EXPENSE, color: '#FB923C', icon: 'UtensilsCrossed' },
  { name: 'Bars & Café', type: CategoryType.EXPENSE, color: '#F97316', icon: 'Coffee' },
  { name: 'Sorties Culturelles', type: CategoryType.EXPENSE, color: '#EA580C', icon: 'Ticket' }, // Ciné, Musée
  { name: 'Shopping', type: CategoryType.EXPENSE, color: '#EC4899', icon: 'ShoppingBag' },
  { name: 'Abonnements', type: CategoryType.EXPENSE, color: '#8B5CF6', icon: 'CreditCard' },
  { name: 'Jeux vidéo', type: CategoryType.EXPENSE, color: '#A855F7', icon: 'Gamepad2' },
  { name: 'Sport', type: CategoryType.EXPENSE, color: '#10B981', icon: 'Dumbbell' },
  { name: 'Voyages / Vacances', type: CategoryType.EXPENSE, color: '#06B6D4', icon: 'Plane' },

  // Vie personnelle 
  { name: 'Santé', type: CategoryType.EXPENSE, color: '#14B8A6', icon: 'HeartPulse' },
  { name: 'Animaux', type: CategoryType.EXPENSE, color: '#B45309', icon: 'PawPrint' },
  { name: 'Éducation / Livres', type: CategoryType.EXPENSE, color: '#7C3AED', icon: 'BookOpen' },

  //Social
  { name: 'Cadeaux', type: CategoryType.EXPENSE, color: '#F43F5E', icon: 'Gift' }, 
  { name: 'Dons / Charité', type: CategoryType.EXPENSE, color: '#BE123C', icon: 'Heart' },

  //Pilotage financier
  { name: 'Frais Bancaires', type: CategoryType.EXPENSE, color: '#475569', icon: 'Wallet' },
  { name: 'Épargne', type: CategoryType.EXPENSE, icon: 'PiggyBank' },

  //Divers
  { name: 'Autres', type: CategoryType.EXPENSE, color: '#9CA3AF', icon: 'MoreHorizontal' },
]      
    await prisma.category.createMany({
  data: defaultCategories,
  skipDuplicates: true,
});

  console.log('✅ Seeding terminé');
}
main()
// si c'est un echec, on affiche l'erreur et on arrête tout
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  //ferme la connexion dans tout les cas
  .finally(async () => {
    await prisma.$disconnect();
  });
