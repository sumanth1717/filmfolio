const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Equipment = require('../models/Equipment');
const Reply = require('../models/Reply');

dotenv.config({ path: '../.env' });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/filmfolio';
    await mongoose.connect(mongoUri);
    console.log('[Seed Script] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Post.deleteMany();
    await Equipment.deleteMany();
    await Reply.deleteMany();
    console.log('[Seed Script] Existing records cleared.');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Create Demo Users
    const users = await User.create([
      {
        name: 'Christopher Nolan',
        email: 'nolan@filmfolio.com',
        password: passwordHash,
        bio: 'Director & Writer focused on practical visual effects, IMAX film formats, and non-linear narrative structures.',
        location: 'Los Angeles, CA',
        skills: ['Director', 'Producer', 'Screenwriter'],
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Rachel Morrison',
        email: 'rachel@filmfolio.com',
        password: passwordHash,
        bio: 'Oscar-nominated Director of Photography. Passionate about handheld camera work and natural lighting.',
        location: 'Los Angeles, CA',
        skills: ['Cinematographer', 'Director of Photography', 'Colorist'],
        profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@filmfolio.com',
        password: passwordHash,
        bio: 'Sound Designer and Location Audio Recording Engineer with 8 years indie & feature experience.',
        location: 'New York, NY',
        skills: ['Sound Mixer', 'Boom Operator', 'Foley Artist'],
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Elena Rostova',
        email: 'elena@filmfolio.com',
        password: passwordHash,
        bio: 'Gaffer and Key Grip. Specializing in LED volumetric studio lighting and high-contrast dramatic setups.',
        location: 'Atlanta, GA',
        skills: ['Gaffer', 'Key Grip', 'Electrician'],
        profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
      }
    ]);

    console.log(`[Seed Script] Created ${users.length} demo users.`);

    // 2. Create Feed Posts
    const posts = await Post.create([
      {
        user: users[0]._id, // Nolan
        type: 'crew_requirement',
        title: 'Seeking Experienced 1st AC for 35mm Anamorphic Short Film',
        description: 'Shooting a 15-minute sci-fi narrative short on 35mm motion picture film in October. Must have experience pulling focus on ARRI 416 & anamorphic lenses.',
        roleNeeded: '1st Assistant Camera',
        location: 'Los Angeles, CA',
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[1]._id, // Rachel
        type: 'hiring_my_work',
        title: 'Available for Feature & Commercial DP Bookings Q4',
        description: 'Experienced Cinematographer available with complete RED V-Raptor 8K package and Cooke Anamorphic lens set.',
        roleNeeded: 'Director of Photography',
        location: 'Los Angeles, CA',
        image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[2]._id, // Marcus
        type: 'crew_requirement',
        title: 'Need Foley Artist & Re-Recording Mixer for Indie Feature',
        description: 'Post-production audio team needed for a psychological thriller currently in picture lock. Remote collaboration available.',
        roleNeeded: 'Foley Artist / Sound Editor',
        location: 'New York, NY',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[3]._id, // Elena
        type: 'hiring_my_work',
        title: 'Gaffer & Lighting Crew Available for Indie Commercials in Atlanta',
        description: 'Complete 3-ton grip truck loaded with Aputure 1200d, Nova P600c panels, wireless DMX control, and light shaping tools.',
        roleNeeded: 'Gaffer',
        location: 'Atlanta, GA',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800'
      }
    ]);

    console.log(`[Seed Script] Created ${posts.length} demo feed posts.`);

    // 3. Create Equipment Listings
    const equipment = await Equipment.create([
      {
        user: users[1]._id, // Rachel
        type: 'available_to_rent',
        title: 'ARRI Alexa Mini LF Cinema Camera Package',
        category: 'Camera',
        description: 'Includes Large Format Sensor body, ARRI MVF-2 viewfinder, Codex Compact Drives (2TB), PL mount, V-Mount battery plates, and pelican flight case.',
        pricePerDay: 450,
        location: 'Los Angeles, CA',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[1]._id, // Rachel
        type: 'available_to_rent',
        title: 'Cooke Anamorphic /i Full Frame Lens Set (32mm, 50mm, 85mm)',
        category: 'Lenses',
        description: 'Beautiful organic flare and creamy bokeh. PL Mount with i/Data electronic contact pins.',
        pricePerDay: 600,
        location: 'Los Angeles, CA',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1617575521317-88544c4b6c35?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[3]._id, // Elena
        type: 'available_to_rent',
        title: 'Aputure ELECTRO STORM CS15 Daylight LED Light',
        category: 'Lighting',
        description: 'Ultra powerful 1500W point-source fixture with motorized reflector and IP65 weather sealing.',
        pricePerDay: 180,
        location: 'Atlanta, GA',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[2]._id, // Marcus
        type: 'available_to_rent',
        title: 'Sound Devices 833 8-Channel Field Recorder Package',
        category: 'Audio',
        description: 'Includes 2x Wisycom dual receivers, Sanken COS-11D lavaliers, and Schoeps CMIT 5U shotgun mic.',
        pricePerDay: 220,
        location: 'New York, NY',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: users[0]._id, // Nolan
        type: 'looking_to_rent',
        title: 'Looking for Ronin 2 Gimbal System + Master Wheels',
        category: 'Grip & Rigging',
        description: 'Needed for 3-day exterior shoot in early September. Must include wireless video transmitter support.',
        pricePerDay: 300,
        location: 'Los Angeles, CA',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800'
      }
    ]);

    console.log(`[Seed Script] Created ${equipment.length} demo equipment listings.`);

    // 4. Create Initial Inquiries / Replies
    const replies = await Reply.create([
      {
        sender: users[1]._id, // Rachel
        receiver: users[0]._id, // Nolan
        targetType: 'Post',
        targetId: posts[0]._id,
        targetTitle: posts[0].title,
        message: 'Hi Christopher, I can highly recommend my 1st AC Sarah who has pulled focus on dozens of 35mm film shoots. Sending her reel over!',
        contactEmail: 'rachel@filmfolio.com',
        contactPhone: '310-555-0199',
        status: 'pending'
      },
      {
        sender: users[3]._id, // Elena
        receiver: users[1]._id, // Rachel
        targetType: 'Equipment',
        targetId: equipment[0]._id,
        targetTitle: equipment[0].title,
        message: 'Hey Rachel, looking to rent your Alexa Mini LF package for a commercial shoot on Sept 12-14. Is it available for those dates?',
        contactEmail: 'elena@filmfolio.com',
        contactPhone: '404-555-0144',
        status: 'accepted'
      }
    ]);

    console.log(`[Seed Script] Created ${replies.length} demo inquiries/replies.`);
    console.log('[Seed Script] Database seed successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
