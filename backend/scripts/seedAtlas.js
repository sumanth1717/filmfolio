const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Post = require('../models/Post');
const Equipment = require('../models/Equipment');
const bcrypt = require('bcryptjs');

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://sumanthat149_db_user:W6QXlUC39dBNJx3A@cluster0.fcf6eep.mongodb.net/filmfolio?retryWrites=true&w=majority&appName=Cluster0';

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully!');

    // Clear existing collections
    await User.deleteMany({});
    await Post.deleteMany({});
    await Equipment.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('password123', salt);

    // Create Users
    const users = await User.create([
      {
        name: 'S. S. Rajamouli',
        email: 'rajamouli@filmfolio.in',
        password: passwordHash,
        bio: 'Visionary Director & Storyteller specializing in epic historical fiction, VFX-heavy spectacles, and large-scale action choreography.',
        location: 'Vijayawada, Andhra Pradesh',
        skills: ['Director', 'Producer', 'Screenwriter'],
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        following: [],
        blockedUsers: []
      },
      {
        name: 'KK Senthil Kumar',
        email: 'senthil@filmfolio.in',
        password: passwordHash,
        bio: 'Award-winning Director of Photography (ISC). Expert in digital cinema cameras, high dynamic range lighting, and volumetric rendering.',
        location: 'Guntur, Andhra Pradesh',
        skills: ['Cinematographer', 'Director of Photography', 'Colorist'],
        profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        following: [],
        blockedUsers: []
      },
      {
        name: 'Sabu Cyril',
        email: 'cyril@filmfolio.in',
        password: passwordHash,
        bio: 'National Award-winning Production Designer & Art Director. Building grand cinematic sets and period architecture across AP & Telangana.',
        location: 'Amaravati, Andhra Pradesh',
        skills: ['Production Designer', 'Art Director', 'Set Decorator'],
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        following: [],
        blockedUsers: []
      },
      {
        name: 'M. M. Keeravani',
        email: 'keeravani@filmfolio.in',
        password: passwordHash,
        bio: 'Academy & Golden Globe Award-winning Composer, Sound Mixer & Location Audio Specialist based near Vijayawada.',
        location: 'Mangalagiri, Andhra Pradesh',
        skills: ['Music Composer', 'Sound Mixer', 'Foley Engineer'],
        profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        following: [],
        blockedUsers: []
      },
      {
        name: 'Trivikram Srinivas',
        email: 'trivikram@filmfolio.in',
        password: passwordHash,
        bio: 'Acclaimed Director & Dialogue Writer known for razor-sharp screenplay, character comedy, and family dramas.',
        location: 'Vijayawada, Andhra Pradesh',
        skills: ['Director', 'Screenwriter', 'Dialogue Writer'],
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
        following: [],
        blockedUsers: []
      },
      {
        name: 'Sekhar Kammula',
        email: 'sekhar@filmfolio.in',
        password: passwordHash,
        bio: 'Indie Film Director & Producer creating realistic, humanistic cinema and authentic youth stories.',
        location: 'Visakhapatnam, Andhra Pradesh',
        skills: ['Director', 'Producer', 'Independent Filmmaker'],
        profilePicture: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
        following: [],
        blockedUsers: []
      }
    ]);

    console.log(`[Seed] Created ${users.length} filmmakers in cloud DB.`);

    // Create Posts
    const posts = await Post.create([
      {
        user: users[0]._id,
        type: 'crew_requirement',
        title: 'Seeking Experienced 1st AC & Focus Puller for Feature Shoot in Vijayawada',
        description: 'Shooting a 20-minute period action sequence near Bhavani Island, Vijayawada. Must be skilled with ARRI Alexa 35 & wireless follow focus systems.',
        roleNeeded: '1st Assistant Camera (1st AC / Focus Puller)',
        location: 'Vijayawada, AP',
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[1]._id,
        type: 'hiring_my_work',
        title: 'Available for Commercial & Feature DP Bookings in AP & Telangana',
        description: 'Senior Director of Photography available with RED V-Raptor 8K VV package and Master Anamorphic prime lenses.',
        roleNeeded: 'Director of Photography (DP/DOP)',
        location: 'Guntur, AP',
        image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[2]._id,
        type: 'crew_requirement',
        title: 'Need Lead Set Construction Carpenter & Art Assistant in Amaravati',
        description: 'Constructing a large temple courtyard set near Amaravati. Looking for skilled art directors and carpenters for a 15-day shoot schedule.',
        roleNeeded: 'Set Construction Carpenter',
        location: 'Amaravati, AP',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[3]._id,
        type: 'hiring_my_work',
        title: 'Location Audio Recording & Live Foley Team Available in Vijayawada-Guntur',
        description: 'Equipped with Sound Devices 888 16-channel recorder, Wisycom wireless lavs, Schoeps shotgun mics, and 3-ton sound van.',
        roleNeeded: 'Location Sound Mixer',
        location: 'Mangalagiri, AP',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[4]._id,
        type: 'crew_requirement',
        title: 'Urgent: Dubbing & Foley Studio Needed for Feature Film Dialogue Track',
        description: 'Looking for a sound studio in Guntur or Vijayawada for 5 days of lead actor ADR dubbing and surround sound mixing.',
        roleNeeded: 'Dubbing Artist / Voice Over Artist',
        location: 'Vijayawada, AP',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[5]._id,
        type: 'hiring_my_work',
        title: 'Drone / Aerial 5.1K Cinema Operator Available near Visakhapatnam & AP Coast',
        description: 'Licensed DGCA drone pilot with DJI Inspire 3 & Zenmuse X9-8K Air camera for beach, mountain, and cityscape aerial shots.',
        roleNeeded: 'Drone / Aerial Camera Operator',
        location: 'Visakhapatnam, AP',
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800'
      }
    ]);

    console.log(`[Seed] Created ${posts.length} feed posts in cloud DB.`);

    // Create Equipment
    const equipment = await Equipment.create([
      {
        user: users[1]._id,
        type: 'available_to_rent',
        title: 'ARRI Alexa 35 Cinema Camera Package',
        category: 'Camera',
        description: 'Includes 4.6K Super 35 sensor body, ARRI MVF-2 Viewfinder, 2TB Codex Drives, PL Mount, V-Mount battery kit, and flight case.',
        pricePerDay: 15000,
        location: 'Guntur, AP',
        city: 'Guntur',
        distanceMiles: 3.5,
        zipCode: '522002',
        status: 'available',
        featured: true,
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[1]._id,
        type: 'available_to_rent',
        title: 'ARRI Master Anamorphic Prime Lens Set (35mm, 50mm, 75mm)',
        category: 'Lenses',
        description: 'Zero distortion, beautiful organic bokeh, PL Mount with LDS electronic lens data contacts.',
        pricePerDay: 22000,
        location: 'Vijayawada, AP',
        city: 'Vijayawada',
        distanceMiles: 5.0,
        zipCode: '520010',
        status: 'available',
        featured: true,
        image: 'https://images.unsplash.com/photo-1617575521317-88544c4b6c35?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[3]._id,
        type: 'available_to_rent',
        title: 'Aputure Electro Storm CS15 Daylight LED Light (1500W)',
        category: 'Lighting',
        description: 'Ultra powerful point-source LED fixture with motorized F14 fresnel reflector, wireless DMX, and heavy duty C-stands.',
        pricePerDay: 6500,
        location: 'Mangalagiri, AP',
        city: 'Mangalagiri',
        distanceMiles: 8.2,
        zipCode: '522503',
        status: 'available',
        featured: false,
        image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[3]._id,
        type: 'available_to_rent',
        title: 'Sound Devices 888 16-Track Location Audio Package',
        category: 'Audio',
        description: 'Includes 4x Wisycom dual receivers, Sanken lavs, Schoeps CMIT 5U boom mic, and K-Tek carbon fiber pole.',
        pricePerDay: 8500,
        location: 'Vijayawada, AP',
        city: 'Vijayawada',
        distanceMiles: 4.0,
        zipCode: '520001',
        status: 'available',
        featured: true,
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[0]._id,
        type: 'looking_to_rent',
        title: 'Looking for DJI Ronin 2 Gimbal System + Master Wheels in Vijayawada',
        category: 'Grip & Rigging',
        description: 'Needed for a 4-day outdoor song sequence in October. Must include wireless video transmitter & operator wheels.',
        pricePerDay: 10000,
        location: 'Vijayawada, AP',
        city: 'Vijayawada',
        distanceMiles: 6.5,
        zipCode: '520008',
        status: 'available',
        featured: false,
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[5]._id,
        type: 'available_to_rent',
        title: 'DJI Inspire 3 8K Cinema Drone Combo Package',
        category: 'Drones',
        description: 'Full CinemaDNG and Apple ProRes RAW 8K aerial setup with 6x TB51 intelligent flight batteries and dual RC Plus controllers.',
        pricePerDay: 18000,
        location: 'Visakhapatnam, AP',
        city: 'Visakhapatnam',
        distanceMiles: 12.0,
        zipCode: '530001',
        status: 'available',
        featured: true,
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800'
      }
    ]);

    console.log(`[Seed] Created ${equipment.length} equipment listings in cloud DB.`);
    console.log('🎉 MongoDB Atlas Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err.message);
    process.exit(1);
  }
};

seedData();
