import React from 'react'
import {View, Text, TouchableOpacity, Image, Slider} from 'react-native'
import TrackPlayer, {ProgressComponent} from 'react-native-track-player';

export default class MusicPlayer extends React.Component{

	constructor()
	{
        super()
        this.state = {
            AudioStatus: true
        };
    }
    
    componentDidMount() {
        TrackPlayer.setupPlayer();
        TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            ]
        });
    }

    togglePlayback = async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack == null) {
          TrackPlayer.reset();
          await TrackPlayer.add(data);
          TrackPlayer.play();
        } else {
          console.log('else...', TrackPlayer.STATE_PLAYING);
        }

        // if(event.type == 'remote-play') {
        //     console.log('remote-play');
        // } else if(event.type == 'remove-pause') {
        //     console.log('remove-pause');
        // }

      }

      skipToNext = async () => {
        try {
          await TrackPlayer.skipToNext()
        } catch (_) {
          TrackPlayer.reset();
        }
      }
    
      skipToPrevious = async () => {
        try {
          await TrackPlayer.skipToPrevious()
        } catch (_) {}
      }

	render(){

		return(
		    <View style={{ flex: 1, justifyContent:'space-between', flexDirection:'column',  backgroundColor: '#03DAC5'}}>

                <View style={{flex: 8,}}>

                    <View style={{flex: 1}}>
                        <Text>Music.....</Text>
                    </View>
                    
                    <View style={{justifyContent:'center', alignItems:'center', flex: 9}}>
                        <Image source={require('./imgs/poster.jpg')} style={{width: '80%', height: 300}}/>
                    </View>

                </View>

                <View style={{justifyContent:'center', flex: 2, alignItems:'center'}}>



                        <TrackStatus />



                    <View style={{flexDirection: 'row', alignItems:'center'}}>

                        <TouchableOpacity onPress={() => this.skipToPrevious()} style={{padding: 15}}>
                            <Image source={{uri: 'http://icons.iconarchive.com/icons/iconsmind/outline/512/Back-Music-icon.png'}} style={{width: 40, height: 40}} resizeMode='contain'/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.togglePlayback()} style={{padding: 15}}>
                            <Image source={this.state.AudioStatus ? {uri: 'https://i0.wp.com/icons.iconarchive.com/icons/iconsmind/outline/512/Play-Music-icon.png'} : {uri: 'http://icons.iconarchive.com/icons/danieledesantis/audio-video-outline/512/pause-icon.png'}} style={{width: 40, height: 40}} resizeMode='contain'/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.skipToNext()} style={{padding: 15}}>
                            <Image source={{uri: 'http://icons.iconarchive.com/icons/iconsmind/outline/512/Next-Music-icon.png'}} style={{width: 40, height: 40}} resizeMode='contain'/>
                        </TouchableOpacity>

                    </View>

                </View>
            
            </View>
		);
    }
    
    PlayAudio()
    {
        
        if(this.state.AudioStatus){
            this.setState({
                AudioStatus: false
            });
            TrackPlayer.play();
        }else{
            this.setState({
                AudioStatus: true
            });
            TrackPlayer.pause();
        }
    }
}


export class TrackStatus extends TrackPlayer.ProgressComponent {
    state = {
      duration: 0,
      isSeeking: false
    }
    formatTime(seconds) {
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
    render () {
      TrackPlayer.getDuration().then(duration=>this.setState({duration}))
      return (
        <View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{color: 'white',backgroundColor:'transparent',width:40,textAlign:'center',fontSize:12}}>
              { this.state.isSeeking ? this.formatTime(this.seek) : this.formatTime(this.state.position) }
            </Text>
            <Slider 
              minimumValue          = {0}
              maximumValue          = {this.state.duration}
              thumbTintColor        = "white"
              minimumTrackTintColor = "#000"
              maximumTrackTintColor = "rgba(255,255,255,.8)"
              step                  = {1}
              onValueChange ={ val=>{
                TrackPlayer.pause();
                this.seek = val;
                this.setState({isSeeking:true})
              }}
              onSlidingComplete={ val=>{
                this.setState({isSeeking: false },()=> {
                  TrackPlayer.seekTo(this.seek);
                  this.position = this.seek;
                  TrackPlayer.play();
                })
              }}
              value={this.state.isSeeking ? this.seek : this.state.position}
              style={{width: '75%'}}
            />
            <Text>{this.formatTime(this.state.duration)}</Text>
          </View>
        </View>
      )
    }
  }


TrackPlayer.registerEventHandler(require('./player-handler.js'));

const data = [
    {
      "id": "1111",
      "url": require('./src/audio.mp3'),
      "title": "Longing",
      "artist": "David Chavez",
      "artwork": "https://picsum.photos/200"
    },
    {
      "id": "2222",
      "url": "https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E",
      "title": "Soul Searching (Demo)",
      "artist": "David Chavez",
      "artwork": "https://picsum.photos/200"
    },
    {
      "id": "3333",
      "url": "https://drive.google.com/uc?export=download&id=1bmvPOy2IVbkUROgm0dqiZry_miiL4OqI",
      "title": "Lullaby (Demo)",
      "artist": "David Chavez",
      "artwork": "https://picsum.photos/200"
    },
    {
      "id": "4444",
      "url": "https://drive.google.com/uc?export=download&id=1V-c_WmanMA9i5BwfkmTs-605BQDsfyzC",
      "title": "Rhythm City (Demo)",
      "artist": "David Chavez",
      "artwork": "https://picsum.photos/200"
    }
  ]