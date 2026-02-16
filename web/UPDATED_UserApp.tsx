// UserApp.tsx ga qo'shish kerak bo'lgan yangi navigation:

// Line 85 da activeTab state ni o'zgartiring:
const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'recipes' | 'photos' | 'workouts' | 'shop'>('home');

// Line 135 da Bottom Navigation ga yangi buttonlar qo'shing:
<NavItem icon={<ChefHat />} label="Retseptlar" active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')} />
<NavItem icon={<Camera />} label="Progress" active={activeTab === 'photos'} onClick={() => setActiveTab('photos')} />
<NavItem icon={<Dumbbell />} label="Mashqlar" active={activeTab === 'workouts'} onClick={() => setActiveTab('workouts')} />
<NavItem icon={<ShoppingBag />} label="Do'kon" active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />

// Yangi imports qo'shing (Line 3):
import { ChefHat, ShoppingBag } from 'lucide-react';
import { RecipeManager } from './RecipeManager';
import { ProgressPhotos } from './ProgressPhotos';
import { WorkoutLibrary } from './WorkoutLibrary';
import { Marketplace } from './Marketplace';

// Yangi tab content lar qo'shing:
{activeTab === 'recipes' && <RecipeManager recipes={MOCK_RECIPES} onBack={() => setActiveTab('home')} />}
{activeTab === 'photos' && <ProgressPhotos photos={MOCK_PROGRESS_PHOTOS} onBack={() => setActiveTab('home')} />}
{activeTab === 'workouts' && <WorkoutLibrary exercises={MOCK_EXERCISES} onBack={() => setActiveTab('home')} />}
{activeTab === 'shop' && <Marketplace products={MOCK_PRODUCTS} onBack={() => setActiveTab('home')} />}
