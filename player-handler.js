import TrackPlayer from "react-native-track-player";

module.exports = async (data) => {
    if(data.type === 'playback-state') {
        // Update the UI with the new state
    } else if(data.type === 'remote-play') {
        TrackPlayer.play();
    } else if(data.type === 'remote-pause') {
        TrackPlayer.pause();
    } else if(data.type === 'remote-stop') {
        TrackPlayer.stop();
    } else if(data.type === 'remote-seek') {
        console.warn(data.position);
        TrackPlayer.seekTo(data.position);
    }
};