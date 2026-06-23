import { Outfit, BackgroundOption, PresetPet, Feature, Testimonial, FAQ } from './types';

// The 6 Christmas-themed styling outfits displayed in the screenshot grid
export const OUTFITS: Outfit[] = [
  {
    id: 'santa',
    name: "Santa's Suit",
    emoji: '🧑‍🎄',
    iconName: 'SantaSuit',
    tagline: "SANTA'S SUIT",
    promptAccent: 'dressed in a plush crimson velvet Santa Claus suit with fuzzy white trim, complete with a floppy matching Santa hat on its head'
  },
  {
    id: 'elf',
    name: 'Elf Costume',
    emoji: '🧝',
    iconName: 'ElfCostume',
    tagline: 'ELF COSTUME',
    promptAccent: 'attired in a whimsical green and red velvet elf tunic with golden shiny jingle bells, and an adorable pointed helper hat with ears'
  },
  {
    id: 'reindeer',
    name: 'Reindeer Hoodie',
    emoji: '🦌',
    iconName: 'ReindeerHoodie',
    tagline: 'REINDEER HOODIE',
    promptAccent: 'wearing a soft brown fleece reindeer hoody with plush reindeer antlers, soft white belly patch, and a tiny shiny red nose badge'
  },
  {
    id: 'sweater',
    name: 'Cozy Sweater',
    emoji: '🧥',
    iconName: 'CozySweater',
    tagline: 'COZY SWEATER',
    promptAccent: 'wearing a bulky hand-crafted knitted retro Christmas wool sweater with charming red, green, and white Nordic winter snowflake designs'
  },
  {
    id: 'winter',
    name: 'Winter Wonderland',
    emoji: '❄️',
    iconName: 'WinterWonderland',
    tagline: 'WINTER WONDERLAND',
    promptAccent: 'wrapped snugly in a vibrant red and green knit holiday scarf with thick matching winter earmuffs, sitting happily'
  },
  {
    id: 'gift',
    name: 'Gift Box Surprise',
    emoji: '🎁',
    iconName: 'GiftBoxSurprise',
    tagline: 'GIFT BOX SURPRISE',
    promptAccent: 'nestled inside a giant glistening green and red striped gift wrapping paper catalog box, crowned with a large gold decorative silk bow'
  }
];

// Beautiful customizable backgrounds for the Christmas portraits
export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'fireplace',
    name: 'Cozy Fireplace',
    style: 'linear-gradient(to right, #1e1b4b, #311005)',
    colorClass: 'bg-amber-950 text-amber-200',
    emoji: '🔥'
  },
  {
    id: 'snowy-forest',
    name: 'Snowy Pine Forest',
    style: 'linear-gradient(to bottom, #0f172a, #1e3a8a)',
    colorClass: 'bg-slate-900 text-sky-200',
    emoji: '🌲'
  },
  {
    id: 'warm-lights',
    name: 'Warm Joyous Lights',
    style: 'radial-gradient(circle, #270606 0%, #0c0202 100%)',
    colorClass: 'bg-red-950 text-red-100',
    emoji: '✨'
  },
  {
    id: 'starry-night',
    name: 'Midnight Stars',
    style: 'linear-gradient(to right, #020617, #0f172a)',
    colorClass: 'bg-neutral-950 text-indigo-300',
    emoji: '🌌'
  },
  {
    id: 'candy-cane',
    name: 'Candy Cane Red',
    style: 'linear-gradient(45deg, #7f1d1d, #991b1b)',
    colorClass: 'bg-red-900 text-pink-100',
    emoji: '🍭'
  },
  {
    id: 'vintage-gold',
    name: 'Vintage Luxe Gold',
    style: 'linear-gradient(to right, #451a03, #78350f)',
    colorClass: 'bg-yellow-950 text-yellow-200',
    emoji: '👑'
  }
];

// Preset cute pets that can be selected immediately to test the portrait builder
export const PRESET_PETS: PresetPet[] = [
  {
    id: 'bailey',
    name: 'Bailey',
    species: 'dog',
    breed: 'Beagle Puppy',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'milo',
    name: 'Milo',
    species: 'cat',
    breed: 'Fluffy Ragdoll',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'luna',
    name: 'Luna',
    species: 'corgi',
    breed: 'Pembroke Welsh Corgi',
    imageUrl: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'oliver',
    name: 'Oliver',
    species: 'rabbit',
    breed: 'Angora Rabbit',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=600&auto=format&fit=crop'
  }
];

// Elegant functional features of the application
export const FEATURES: Feature[] = [
  {
    id: 'outfits',
    title: 'One-Click Christmas Outfits',
    description: 'Instantly transform your pet into Santa, Elf, or Reindeer styles with perfectly matched attire.',
    icon: 'Sparkles'
  },
  {
    id: 'scenes',
    title: 'Holiday Scenes & Props',
    description: 'Add twinkling holiday trees, soft candlelight, gifts, snow, and cozy fireplaces automatically.',
    icon: 'TreePine'
  },
  {
    id: 'downloads',
    title: 'High-Quality Downloads',
    description: 'Get pixel-perfect results in pristine resolutions ready for print greeting cards or social sharing.',
    icon: 'Download'
  },
  {
    id: 'multiple',
    title: 'Multiple Styles from One Photo',
    description: 'Generate other seasonal looks easily and pick your absolute favorite holiday art masterpiece.',
    icon: 'Palette'
  },
  {
    id: 'fast',
    title: 'Fast & Simple',
    description: 'Upload ➔ customize ➔ download. No expert editing skills, layers, or designer tools needed.',
    icon: 'Zap'
  },
  {
    id: 'private',
    title: 'Private by Default',
    description: 'We respect your family privacy. Uploaded pet photos are processed securely and deleted automatically.',
    icon: 'ShieldCheck'
  }
];

// Testimonials matching high rating and screenshot representation
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'emma',
    rating: 5,
    quote: '"My cat looks incredible in the elf outfit—instant warmth and amazing holiday vibes. Best card ever!"',
    author: 'Emma',
    role: 'CAT LOVER',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'lucas',
    rating: 5,
    quote: '"We made Christmas portraits for our golden retriever dog and bunny rabbit. Super fun, fast, and easy to adjust."',
    author: 'Lucas',
    role: 'DOG DAD',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'nina',
    rating: 5,
    quote: '"Perfect for our local pet shop\'s holiday newsletter promos—our customers and pet parents absolutely loved it!"',
    author: 'Nina',
    role: 'SHOP OWNER',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'
  }
];

// FAQs matching screenshot design
export const FAQS: FAQ[] = [
  {
    id: 'skill',
    question: 'Do I need professional design or editing skills?',
    answer: 'Not at all! Our advanced interactive portrait studio does everything for you. Simply pick one of our adorable preset base pets or upload a photo of your own family pet, select an outfit, and adjust stickers manually to place them perfectly! You can download your finished card instantly.'
  },
  {
    id: 'work-best',
    question: 'What pet photos work best for custom uploads?',
    answer: 'High-quality, well-lit photos where your dog, cat, or pet is looking directly at the camera work best. Try to use photos where your pet\'s head and collar chest area are fully visible with clear natural lighting!'
  },
  {
    id: 'how-long',
    question: 'How long does the AI formatting and customization take?',
    answer: 'It is instant! Our dynamic interactive canvas loads your pet, fits outfits, and renders live card previews in milliseconds. Standard AI generation finishes within 10 to 15 seconds of processing.'
  },
  {
    id: 'multi',
    question: 'Can I generate multiple styles with the same pet photo?',
    answer: 'Yes! You can instantly experiment with all six festive holiday outfits (Santa’s Suit, Elf Costume, Reindeer Hoodie, Cozy Sweater, Winter Wonderland, and Gift Box Surprise) and swap backgrounds to find your favorite.'
  },
  {
    id: 'free',
    question: 'Is Pets Santa free to customize and output?',
    answer: 'Yes! Pets Santa offers free access to design, add text, adjust sticker outfits, and play around. You can download solid preview cards completely free, with options for ultra-high resolution printable cards.'
  },
  {
    id: 'safety',
    question: 'Do you store or sell my pet\'s private photos?',
    answer: 'Absolutely not. Your privacy is our highest priority. Uploaded images are only processed locally inside your high-performance browser sandbox or generated securely, and are never shared or stored long term without your explicit permission.'
  }
];
