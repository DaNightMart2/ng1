export { musicInfo, };

/**
 * Stores all information about music playing.
 * @param tag stores the tag to be added to the player when they're in the music playing area.
 * @param track stores the track to play when in the music playing area.
 * @param coordinates the beginning and ending coordinates of the music playing area.
 */
const musicInfo = [
    {
        tag: "limbo",
        track: "ng1:the_choice",
        coordinates: [{x: 10, y: 3, z: -2}, {x: 63, y: 45, z: 53}],
        information: "The Choice - UNDERTALE OST - Toby Fox",
    },

    {
        tag: "experiment",
        track: "ng1:barrier",
        coordinates: [{x: 102, y:3, z: 27}, {x: 156, y: 16, z: 64}],
        information: "Barrier - UNDERTALE OST - Toby Fox",
    },

    {
        tag: "lobby",
        track: "ng1:home",
        coordinates: [{x: 39, y:2, z: 84}, {x: 124, y: 45, z: 160}],
        information: "Home - UNDERTALE OST - Toby Fox",
        
    },

    {
        tag: "trophy",
        track: "ng1:home_music_box",
        coordinates: [{x: 55, y:4, z: 162}, {x: 111, y: 38, z: 301}],
        information: "Home (Music Box) - UNDERTALE OST - Toby Fox",
        
    },

    {
        tag: "farm",
        track: "ng1:silly_farmer",
        coordinates: [{x: 149, y:13, z: 106}, {x: 201, y: 50, z: 160}],
        information: "Silly Farmer - Dream Productions",
        
    },

    {
        tag: "auditorium",
        track: "ng1:core",
        coordinates: [{x: 512, y:3, z: -57}, {x: 75, y: 27, z: 15}],
        information: "Core - UNDERTALE OST - Toby Fox",
        
    },
];