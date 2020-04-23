# word games [![Build Status](https://travis-ci.org/vayelcrau/wames.svg?branch=master)](https://travis-ci.org/vayelcrau/wames)
Casual cross platform multiplayer word games. 

### Usage 
`git clone https://github.com/vayelcrau/wames`
`yarn add global expo-cli@3.18.6`

Using `Expo SDK` `SDK 37` and `react-native` `v0.61.4`.

## Roadmap

### Client Side

- more robust state management
- menu which includes setting custom username and portal to pick games
- consider using game engine for games
- animation, visual effects, particles
    * hand-drawn feedback displays
    * particles (possibly using [react-native-particles](https://github.com/nanndoj/react-native-particles#readme))
    * animation (possibly using [React Native Animations](https://reactnative.dev/docs/0.60/animations))
- artwork for games

### Server Side

- secure connection & authentication
- authenticate/store session & user ids
- use mongodb _id field as uuid

### Misc

- more robust client-server [socket.io](https://socket.io/) communication structure
- 'portals' or 'shortcut links' to join games
- continuous integration to test builds before deploying to heroku