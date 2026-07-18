import { Service, User } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's-org-1',
    providerId: 'u-org-1',
    providerName: 'Elite Celebrations & Co.',
    providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    category: 'organiser',
    title: 'Grand Luxury Wedding Management',
    description: 'We offer complete end-to-end luxury wedding management, including custom theme integration, destination planning, protocol supervision, guest hosting, and multi-day itinerary execution. Let us turn your dream wedding into a flawlessly orchestrated reality.',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    price: 150000,
    pricingUnit: 'per event',
    experience: 8,
    location: 'Mumbai, MH',
    rating: 4.8,
    availability: ['Friday', 'Saturday', 'Sunday'],
    portfolio: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600'
    ],
    reviews: [
      {
        id: 'rev-org-1-1',
        reviewerName: 'Rohan Sharma',
        reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        rating: 5,
        comment: 'Elite Celebrations made our wedding absolutely magical! The orchestration was flawless, and the dark maroon-gold theme they designed for our reception was breathtaking. Highly recommended!',
        date: '2026-06-15'
      },
      {
        id: 'rev-org-1-2',
        reviewerName: 'Meera Patel',
        reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        rating: 4,
        comment: 'Very professional. They handled a guest list of over 500 people with absolute ease and elegance. Slight delay in final setup but everything was stunning.',
        date: '2026-05-20'
      }
    ],
    specs: {
      packagesIncluded: ['Theme Setup', 'Vendor Coordinator', 'Hospitality', 'RSVP Management']
    }
  },
  {
    id: 's-org-2',
    providerId: 'u-org-1',
    providerName: 'Elite Celebrations & Co.',
    providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    category: 'organiser',
    title: 'Premium Corporate Conventions & Galas',
    description: 'Bespoke corporate event organization for high-level summits, product launches, award ceremonies, and gala dinners. We provide state-of-the-art audiovisual setups, stage designs, and guest management services.',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
    price: 250000,
    pricingUnit: 'per day',
    experience: 8,
    location: 'Bangalore, KA',
    rating: 4.9,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    portfolio: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600'
    ],
    reviews: [
      {
        id: 'rev-org-2-1',
        reviewerName: 'Anish Grover (TechCorp)',
        reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
        rating: 5,
        comment: 'Elite Celebrations managed our annual tech conference flawlessly. The staging was top-tier, and the schedule was kept down to the minute.',
        date: '2026-07-01'
      }
    ],
    specs: {
      packagesIncluded: ['Staging & AV', 'Host/Emcee Service', 'Catering Coord', 'Media Coverage']
    }
  },
  {
    id: 's-plan-1',
    providerId: 'u-org-2',
    providerName: 'Aura Events & Planners',
    providerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    category: 'planner',
    title: 'Boho-Chic Theme & Aesthetic Decors',
    description: 'Transform your venue with our signature Boho-Chic theme, featuring rich earthy tones, dried pampas grass installations, macramé details, and elegant amber lighting. Ideal for birthdays, anniversaries, and intimate gatherings.',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
    price: 45000,
    pricingUnit: 'per event',
    experience: 5,
    location: 'Delhi, NCR',
    rating: 4.6,
    availability: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    portfolio: [
      'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600'
    ],
    reviews: [
      {
        id: 'rev-plan-1-1',
        reviewerName: 'Kriti Sen',
        reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
        rating: 5,
        comment: 'Amazing attention to detail! The setup was so dreamy and warm. Our guests couldn\'t stop taking photos at the photo booth.',
        date: '2026-06-28'
      }
    ],
    specs: {
      decorOptions: ['Boho-Chic', 'Retro Maroon & Gold', 'Elegant White Lily', 'Fairy Lights Special'],
      packagesIncluded: ['Photo Booth', 'Table Settings', 'Entrance Archway', 'Backdrop Design']
    }
  },
  {
    id: 's-cat-1',
    providerId: 'u-org-3',
    providerName: 'Gourmet Bites Catering',
    providerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    category: 'caterer',
    title: 'Exquisite Fine Dining Buffet (Veg & Non-Veg)',
    description: 'Elevate your event with a luxurious fine-dining buffet designed by our master chefs. We feature a fusion of Indian, Pan-Asian, and Continental live counters. Impeccable presentation and gold-gilded service staff.',
    coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200',
    price: 1200,
    pricingUnit: 'per plate',
    experience: 12,
    location: 'Mumbai, MH',
    rating: 4.9,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    portfolio: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600'
    ],
    reviews: [
      {
        id: 'rev-cat-1-1',
        reviewerName: 'Vijay Khanna',
        reviewerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100',
        rating: 5,
        comment: 'The food was the talk of the wedding! Exceptional live sushi and chat counters. The mutton biryani was cooked to absolute perfection.',
        date: '2026-07-10'
      }
    ],
    specs: {
      menuCategories: ['Indian Main Course', 'Pan-Asian Live Stalls', 'Continental Breads', 'Artisanal Desserts'],
      capacityLimit: 1500
    }
  },
  {
    id: 's-cam-1',
    providerId: 'u-org-4',
    providerName: 'LensMaster Cinema & Photography',
    providerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    category: 'cameraman',
    title: 'Premium Cinematic Wedding Films & Portraits',
    description: 'We capture timeless memories using industry-grade cinematic cameras and drone equipment. Package includes a 5-minute custom teaser, 40-minute highlights film, 200 fully edited high-resolution portraits, and print-ready album designs.',
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200',
    price: 85000,
    pricingUnit: 'per day',
    experience: 6,
    location: 'Pune, MH',
    rating: 4.7,
    availability: ['Friday', 'Saturday', 'Sunday'],
    portfolio: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?auto=format&fit=crop&q=80&w=600'
    ],
    reviews: [
      {
        id: 'rev-cam-1-1',
        reviewerName: 'Nisha Patil',
        reviewerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=100',
        rating: 5,
        comment: 'Amazing squad! They made us feel so comfortable. The cinematic film came out like a high-budget Bollywood trailer. Extremely satisfied!',
        date: '2026-06-05'
      }
    ],
    specs: {
      cameraEquipment: ['Sony FX3 Cinema Rigs', 'DJI Mavic 3 Pro Cine', 'Sony A7R V High-Res Prime Lenses'],
      packagesIncluded: ['Cinematic Teaser', 'Traditional Photography', 'Raw Footages', 'Signature Album']
    }
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-cust-1',
    name: 'Alex Johnson',
    emailOrMobile: 'customer@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    savedServices: ['s-org-1', 's-cam-1'],
    mobile: '+91 98765 43210',
    email: 'customer@gmail.com',
    address: 'B-402, Sea Breeze Apartments, Bandra West, Mumbai'
  },
  {
    id: 'u-org-1',
    name: 'Elite Celebrations & Co.',
    emailOrMobile: 'organiser@gmail.com',
    role: 'organiser',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    savedServices: [],
    mobile: '+91 99999 88888',
    email: 'organiser@gmail.com',
    address: '101, Prestige Towers, MG Road, Bangalore',
    companyProfile: {
      companyName: 'Elite Celebrations & Co.',
      description: 'The standard of luxury event management across metro areas in India.',
      experience: 8,
      address: '101, Prestige Towers, MG Road, Bangalore',
      logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      gallery: [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600'
      ],
      reviews: [
        {
          id: 'rev-c-1',
          reviewerName: 'Rohan Sharma',
          rating: 5,
          comment: 'Perfect orchestration and magnificent setups.',
          date: '2026-06-15'
        }
      ],
      rating: 4.85
    }
  },
  {
    id: 'u-org-2',
    name: 'Aura Events & Planners',
    emailOrMobile: 'aura@gmail.com',
    role: 'organiser',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    savedServices: [],
    mobile: '+91 88888 77777',
    email: 'aura@gmail.com',
    address: 'Flat 5B, Green Glen Layout, Delhi',
    companyProfile: {
      companyName: 'Aura Events & Planners',
      description: 'Specialists in custom theme curation, floral aesthetics, and warm lighting setups.',
      experience: 5,
      address: 'Flat 5B, Green Glen Layout, Delhi',
      logo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      gallery: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600'
      ],
      reviews: [
        {
          id: 'rev-c-2',
          reviewerName: 'Kriti Sen',
          rating: 5,
          comment: 'Dreamy setups and precise execution.',
          date: '2026-06-28'
        }
      ],
      rating: 4.6
    }
  },
  {
    id: 'u-org-3',
    name: 'Gourmet Bites Catering',
    emailOrMobile: 'gourmet@gmail.com',
    role: 'organiser',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    savedServices: [],
    mobile: '+91 77777 66666',
    email: 'gourmet@gmail.com',
    address: 'Catering Hub, Industrial Estate, Worli, Mumbai',
    companyProfile: {
      companyName: 'Gourmet Bites Catering',
      description: 'Gourmet chefs and custom live stalls catering for small to mega crowd counts.',
      experience: 12,
      address: 'Catering Hub, Industrial Estate, Worli, Mumbai',
      logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      gallery: [
        'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600'
      ],
      reviews: [],
      rating: 4.9
    }
  },
  {
    id: 'u-org-4',
    name: 'LensMaster Studio',
    emailOrMobile: 'lensmaster@gmail.com',
    role: 'organiser',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    savedServices: [],
    mobile: '+91 66666 55555',
    email: 'lensmaster@gmail.com',
    address: 'Creative Alley, Kothrud, Pune',
    companyProfile: {
      companyName: 'LensMaster Studio',
      description: 'Award-winning cinematic videography and high-definition photography teams.',
      experience: 6,
      address: 'Creative Alley, Kothrud, Pune',
      logo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
      gallery: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600'
      ],
      reviews: [],
      rating: 4.7
    }
  }
];
