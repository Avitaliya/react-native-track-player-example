import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  AppRegistry
} from 'react-native';
import TrackPlayer from 'react-native-track-player';

TrackPlayer.setupPlayer().then(async () => {
  await TrackPlayer.add({
      id: 'trackId',
      url: require('./audio.mp3'),
      title: 'Track Title',
      artist: 'Track Artist',
      artwork: require('./track.png')
  });
});

export default class App extends Component {

  componentWillMount(){
    console.log('Render mount!');
  }

  render() {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>

        <TouchableOpacity style={{padding: 15, backgroundColor: '#0000FF'}} onPress={() => this.playMusic()}>
          <Text style={{color: '#FFF'}}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 15, backgroundColor: '#FF0000'}} onPress={() => this.pushMusic()}>
          <Text style={{color: '#FFF'}}>Push</Text>
        </TouchableOpacity>
        
      </View>
    );
  }

  playMusic()
  {
    TrackPlayer.play();
  }

  pushMusic(){
    TrackPlayer.pause();
  }

}
AppRegistry.registerComponent('appname', () => App);
TrackPlayer.registerEventHandler(require('./player-handler.js'));