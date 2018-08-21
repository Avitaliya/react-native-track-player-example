import React from 'react'
import {View, Text, TouchableOpacity, Image, Slider, AppRegistry, StatusBar} from 'react-native'
import TrackPlayer, {ProgressComponent} from 'react-native-track-player';
TrackPlayer.setupPlayer();

export default class Player extends React.Component{
  
  state = {
    AudioStatus: true,
    CurrentPlayTitle : '',
    CurrentPlayArtist : '',
    CurrentPlayImage : require('./src/imgs/poster.jpg'),
    Volume : 60,
  };

  componentWillMount() {
    this.UpdateTrack();
  }
    
  componentDidMount() {
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ]
    });
    this.UpdateTrackUI();
  }

  togglePlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      TrackPlayer.reset();
      await TrackPlayer.add(data);
      TrackPlayer.play();
    } else {
      if(await TrackPlayer.getState() === 2){
        TrackPlayer.play();
      }else{
        TrackPlayer.pause();
      }
    }
    this.UpdateTrackUI();
  }

  skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.log(error);
      TrackPlayer.stop();
    }
    this.UpdateTrack();
    this.UpdateTrackUI();
  }
    
  skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      this.UpdateTrack();
    } catch (error) {
      console.log(error);
    }
    this.UpdateTrack();
    this.UpdateTrackUI();
  }

  UpdateTrack = async () => {
    var current_id = await TrackPlayer.getCurrentTrack();
    if(current_id){
      var track = await TrackPlayer.getTrack(current_id);
      this.setState({
        CurrentPlayTitle : track.title,
        CurrentPlayArtist : track.artist,
        CurrentPlayImage : {uri: track.artwork},
      });
    }else{
      this.setState({
        CurrentPlayTitle : data[0].title,
        CurrentPlayArtist : data[0].artist,
        CurrentPlayImage : {uri: data[0].artwork},
      });
    }
  }

  UpdateTrackUI = async () => {
    if(await TrackPlayer.getState() == 2){
      this.setState({
        AudioStatus: true
      });
    } else if(await TrackPlayer.getState() == 3){
      this.setState({
        AudioStatus: false
      });
    } else if(await TrackPlayer.getState() == 6){
      this.setState({
        AudioStatus: false
      });
    }
  }

	render(){
		return(
		    <View style={{ flex: 1, justifyContent:'space-between', flexDirection:'column',  backgroundColor: '#03DAC5'}}>
          <StatusBar backgroundColor='#03DAC5' barStyle="dark-content"/>
          <View style={{flex: 8,}}>
              <View style={{flex: 1, padding: 15}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color:'#000'}}>{this.state.CurrentPlayTitle}</Text>
                  <Text>{this.state.CurrentPlayArtist}</Text>
              </View>
              <View style={{justifyContent:'center', alignItems:'center', flex: 9}}>
                  <Image source={this.state.CurrentPlayImage} style={{width: '90%', height: 335}}/>
              </View>
          </View>
          <View style={{justifyContent:'center', flex: 2, alignItems:'center'}}>
            <TrackStatus />
            <View style={{flexDirection: 'row', alignItems:'center'}}>
                <TouchableOpacity onPress={() => this.skipToPrevious()} style={{padding: 15}} activeOpacity={1}>
                    <Image source={require('./src/imgs/Back-Music-icon.png')} style={{width: 40, height: 40}} resizeMode='contain'/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.togglePlayback()} style={{padding: 15}} activeOpacity={1}>
                    <Image source={this.state.AudioStatus ? require('./src/imgs/Play-Music-icon.png') : require('./src/imgs/pause-icon.png')} style={{width: 40, height: 40}} resizeMode='contain'/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.skipToNext()} style={{padding: 15}} activeOpacity={1}>
                    <Image source={require('./src/imgs/Next-Music-icon.png')} style={{width: 40, height: 40}} resizeMode='contain'/>
                </TouchableOpacity>
            </View>
            <View style={{width: '100%', justifyContent:'center', alignItems:'center', flexDirection: 'row'}}>
              <Text style={{color: 'white',backgroundColor:'transparent',width:40,textAlign:'center',fontSize:12}}>{this.state.Volume}</Text>
              <Slider 
                minimumValue          = {0}
                maximumValue          = {100}
                thumbTintColor        = '#FFFFFF'
                minimumTrackTintColor = '#000000'
                maximumTrackTintColor = '#808080'
                step                  = {1}
                onValueChange ={ val=>{
                  this.setState({Volume: val})
                  TrackPlayer.setVolume(val / 100)
                }}
                onSlidingComplete={ val=>{
                  this.setState({Volume: val})
                  TrackPlayer.setVolume(val / 100)
                }}
                value={this.state.Volume}
                style={{width: '70%'}}
              />
              <Text>100</Text>
            </View>
          </View>
        </View>
		);
  }
}


export class TrackStatus extends ProgressComponent {
    state = {
      duration: 0,
      isSeeking: false,
      position : 0,
      SliderDisable : true
    }
    formatTime(seconds) {
      if(this.state.SliderDisable){
        this.TrackSlider();
      }
      return seconds > 3600 
      ?
        [
          parseInt(seconds / 60 / 60),
          parseInt(seconds / 60 % 60),
          parseInt(seconds % 60)
        ].join(":").replace(/\b(\d)\b/g, "0$1")
      :
        [
          parseInt(seconds / 60 % 60),
          parseInt(seconds % 60)
        ].join(":").replace(/\b(\d)\b/g, "0$1")
    }

    componentDidMount(){
      TrackPlayer.getDuration().then(
        duration=>this.setState({duration}),
        
      )
      TrackPlayer.getPosition().then(
        position=>this.setState({position}),
        
      )
      // this.TrackSlider();
    }

    TrackSlider = async () => {
      if(await TrackPlayer.getState() == 2){
        this.setState({
          SliderDisable: false
        });
      } else if(await TrackPlayer.getState() == 3){
        this.setState({
          SliderDisable: false
        });
      } else if(await TrackPlayer.getState() == 0){
        this.setState({
          SliderDisable: true
        });
      }
    }

    render () {
      return (
        <View>
          <View style={{flexDirection:'row',paddingHorizontal: 10,alignItems:'center'}}>
            <Text style={{color: 'white',backgroundColor:'transparent',width:40,textAlign:'center',fontSize:12}}>
              {/* { this.state.isSeeking ? this.formatTime(this.seek) : this.formatTime(this.state.position) } */}
              {this.formatTime(this.state.position)}
            </Text>
            <Slider 
              minimumValue          = {0}
              maximumValue          = {this.state.duration}
              thumbTintColor        = '#FFFFFF'
              minimumTrackTintColor = '#000000'
              maximumTrackTintColor = '#808080'
              step                  = {1}
              disabled              = {this.state.SliderDisable}
              onValueChange ={ val=>{
                TrackPlayer.pause();
                this.seek = val;
                this.setState({isSeeking:true})
              }}
              onSlidingComplete={ val=>{
                TrackPlayer.play();
                this.setState(()=> {
                  TrackPlayer.seekTo(this.seek);
                  this.position = this.seek;
                })
              }}
              // value={this.state.isSeeking ? this.seek : this.state.position}
              value={this.state.position}
              style={{width: '75%'}}
            />
            <Text>{this.formatTime(this.state.duration)}</Text>
          </View>
        </View>
      )
    }
  }
  AppRegistry.registerComponent('Player', () => Player);

  AppRegistry.registerHeadlessTask('TrackPlayer', () => 
  module.exports = async (data) => {
    if(data.type === 'playback-state') {
        // Update the UI with the new state
    } else if(data.type === 'remote-play') {
        _player = false;
        TrackPlayer.play();
    } else if(data.type === 'remote-pause') {
        TrackPlayer.pause();
        _player = true;
    } else if(data.type === 'remote-stop') {
        TrackPlayer.stop();
    } else if(data.type === 'remote-seek') {
        console.warn(data.position);
        TrackPlayer.seekTo(data.position);
    } else if(data.type === 'remote-next') {
        TrackPlayer.skipToNext();
    } else if(data.type === 'remote-previous') {
        TrackPlayer.skipToPrevious();
    }
  }
);


const data = [
    {
      "id": "1111",
      "url": "http://www.noiseaddicts.com/samples_1w72b820/4048.mp3",
      "title": "Longing",
      "artist": "David Chavez",
      "artwork": "https://s-media-cache-ak0.pinimg.com/originals/2f/5a/d6/2f5ad60b12d94bebe8b82afbc2b2cd0c.jpg"
    },
    {
      "id": "2222",
      "url": "http://www.noiseaddicts.com/samples_1w72b820/2558.mp3",
      "title": "Soul Searching (Demo)",
      "artist": "David Chavez",
      "artwork": "https://cdn1.player.fm/images/2082067/series/a6T0LNRk02vnyWDy/512.jpg"
    },
    {
      "id": "3333",
      "url": "http://www.noiseaddicts.com/samples_1w72b820/1453.mp3",
      "title": "Lullaby (Demo)",
      "artist": "David Chavez",
      "artwork": "https://www.howwe.biz/uploads/songcover/howwebiz_bc5afadada79dd680e4a35c441f523d2_1437126317_cover.jpg"
    },
    {
      "id": "4444",
      "url": "https://www.sample-videos.com/audio/mp3/wave.mp3",
      "title": "Rhythm City (Demo)",
      "artist": "David Chavez",
      "artwork": "https://www.dx-revision.com/wp-content/uploads/AltMusicPack.png"
    }
  ]