import React, {useState} from 'react';
import { View, StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Player} from '../audio/Player';
import RenderHtml from 'react-native-render-html';


const AudioCell = ({...props}) => {
  const item = props.item;
  const [playURL, setPlayURL] = useState([{audioUrl:item.mediaURL}]);
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
    <>
      <View style={styles.item}>
        <Text style={styles.publishDate} >
          {props.timeDiffCalc}
        </Text>

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

        {/* <Text style={styles.title}>{item.title}</Text>
          {/* <Text style={styles.description}>{item.subtitle}</Text> */}
          {/* <Text style={styles.description}>{item.description}</Text>  */}
          <Player tracks={playURL} />
      </View>
      </>
)};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ffffff',
    height:200,
    padding:5,
    marginTop: 20,
    marginHorizontal: 16,
    flexDirection:'column',
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 9,
  },
  title: {
    fontWeight: "bold",
    color: 'black',
    fontSize: 15
  },
  description: {
    left:20,
    color:'#616161',
    fontSize: 14,
    fontWeight:'bold'
  },
  tinyLogo: {
    top:5,
    width: "100%",
    height: "55%",
  },
  imagestyle: {
    top:10,
    width:60,
    height:60,
    alignSelf:'center',
    position: "absolute" 
  },
  publishDate: {
    top:0,
    width:120,
    alignSelf:'flex-end',
    textAlign: 'right',
    marginRight: 20
  },
});

export default AudioCell;