export const FILMMAKING_ROLES_BY_DEPARTMENT = [
  {
    department: 'Direction & Writing',
    roles: [
      'Director',
      'Co-Director',
      '1st Assistant Director (1st AD)',
      '2nd Assistant Director (2nd AD)',
      'Script Supervisor / Continuity',
      'Screenwriter',
      'Dialogue Writer'
    ]
  },
  {
    department: 'Cinematography & Camera',
    roles: [
      'Director of Photography (DP/DOP)',
      'Camera Operator',
      '1st Assistant Camera (1st AC / Focus Puller)',
      '2nd Assistant Camera (2nd AC / Clapper Loader)',
      'Digital Imaging Technician (DIT)',
      'Drone / Aerial Camera Operator',
      'Steadicam Operator',
      'Gimbal Operator',
      'Underwater Camera Operator'
    ]
  },
  {
    department: 'Lighting & Grip',
    roles: [
      'Gaffer (Chief Lighting Technician)',
      'Best Boy Electric',
      'Key Grip',
      'Best Boy Grip',
      'Dolly Grip',
      'Rigging Gaffer',
      'Lighting Technician / Spark'
    ]
  },
  {
    department: 'Sound & Audio',
    roles: [
      'Location Sound Mixer',
      'Boom Operator',
      'Sound Designer',
      'Re-Recording Mixer',
      'Foley Artist',
      'Foley Engineer',
      'Dubbing Artist / Voice Over Artist',
      'ADR Recordist',
      'Music Composer',
      'Background Score Composer',
      'Singer / Vocalist'
    ]
  },
  {
    department: 'Art & Production Design',
    roles: [
      'Production Designer',
      'Art Director',
      'Assistant Art Director',
      'Set Decorator',
      'Set Construction Carpenter',
      'Prop Master',
      'Costume Designer',
      'Wardrobe Stylist',
      'Makeup Artist (MUA)',
      'Hair Stylist',
      'Prosthetics Artist',
      'SFX / Mechanical Effects Supervisor'
    ]
  },
  {
    department: 'Post-Production & VFX',
    roles: [
      'Film Editor',
      'Assistant Editor',
      'Colorist (DI Colorist)',
      'VFX Supervisor',
      'VFX Compositor / 3D Animator',
      'Motion Graphics Designer',
      'Subtitle / Localization Specialist'
    ]
  },
  {
    department: 'Production & Logistics',
    roles: [
      'Executive Producer',
      'Line Producer',
      'Production Manager',
      'Location Manager',
      'Stunt Coordinator / Action Director',
      'Production Assistant (PA)'
    ]
  }
];

export const ALL_FILMMAKING_ROLES = FILMMAKING_ROLES_BY_DEPARTMENT.flatMap((dept) => dept.roles);
