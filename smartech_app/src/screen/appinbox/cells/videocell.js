import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity,Text, Image, useWindowDimensions} from 'react-native';
import Video from 'react-native-video';
import moment from 'moment';
import RenderHtml from 'react-native-render-html';

const VideoCell = ({...props}) => {
  const item = props.item;
  const [isPlayVideo, setIsPlayVideo] = useState(true);
  const { width } = useWindowDimensions();

  const titleTagsStyles = {
    body: { fontSize:15,color:'#000', left:10},
    sub: { fontSize: 15},
    sup: { fontSize: 15},
  };

  const descriptionTagsStyles = {
    body: { fontSize:15, color:'#616161', left:10},
    sub: { fontSize: 13, lineHeight:10},
    sup: { fontSize: 15,lineHeight:20},
  };

  return(
      <View style={styles.item}>
      <Text style={styles.publishDate} >{props.timeDiffCalc}</Text>
      <TouchableOpacity style = {{top:5}} onPress={() => {setIsPlayVideo(!isPlayVideo)}}>
        <Video 
          source={{uri: item.mediaURL}}  
          ref={(ref) => {
            this.player = ref
          }}            
          repeat = {true}
          onEnd={() => { setIsPlayVideo(!isPlayVideo) }}
          paused={isPlayVideo}                       
          onBuffer={this.onBuffer}                
          onError={this.videoError}              
          style={styles.tinyLogo} 
        />
        {isPlayVideo &&
            <Image style={styles.imagestyle} source={require('../../../assets/video_play.png')} />
        }
       </TouchableOpacity>
        {/* <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text> */}

      <RenderHtml
        contentWidth={width}
        tagsStyles={titleTagsStyles}
        source={{html: item.title}}
      />

      <RenderHtml
        contentWidth={width}
        tagsStyles={descriptionTagsStyles}
        source={{html: item.description}}
      />

      </View>
)};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ffffff',
    height:300,
    padding:5,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection:'column',
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 9
  },
  title: {
    top:0,
    fontWeight: "bold"
  },
  publishDate: {
    // marginRight:10,
    // width: "100%",
    marginHorizontal:10,
    alignSelf:'flex-end',
    textAlign: 'right',
    // backgroundColor:'red'
  },
  description: {
    top:5,
    left:20,
    color:'gray',
    fontSize: 14
  },
  tinyLogo: {
    width: "100%",
    height: "80%",
    backgroundColor:'#ffffff'
  },
  imagestyle: {
    justifyContent:'center',
    top:50,
    width:60,
    height:60,
    alignSelf:'center',
    position: "absolute" 
  }
});

export default VideoCell;