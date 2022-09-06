import React from 'react';
import { View, StyleSheet, Text, Image, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

const GifCell = ({...props}) => {
  const item = props.item;
  const { width } = useWindowDimensions();
  const titleTagsStyles = {
    body: { fontSize:15,color:'#000', left:10},
    sub: { fontSize: 15},
    sup: {fontSize: 15},
  };

  const descriptionTagsStyles = {
    body: { fontSize:15, color:'#616161', left:10},
    sub: { fontSize: 13, lineHeight:10},
    sup: {fontSize: 15,lineHeight:20},
  };

  return(
    <>
      <View style={styles.item}>
        <Text style={styles.publishDate} >{props.timeDiffCalc}</Text>

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
        <Text style={styles.description}>{item.description}</Text> */}
        <Image
          style={styles.tinyLogo}
          resizeMode = 'contain'
          source={{
            uri: item.mediaURL,
          }}
        />
      </View>
      {props.actionButtons ?
        <View style={{ }}>
          {props.actionButtons()}
        </View> : null
      }
    </>
)};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ffffff',
    height:300,
    //padding:5,
    marginTop: 20,
    marginHorizontal: 16,
    flexDirection:'column',
    borderColor: '#ffffff',
    borderWidth: 2,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  title: {
    left:20,
    fontWeight: "bold",
    fontSize: 15,
    color: '#000000'
  },
  description: {
    left:20,
    fontSize: 14,
    color:'#616161',
    fontWeight:'bold'
  },
  tinyLogo: {
    width: "100%",
    height: "70%",
    backgroundColor:'#ffffff',
    marginTop: 20
  },
  publishDate: {
    width:120,
    top:8,
    alignSelf:'flex-end',
    textAlign: 'right',
    marginRight: 20,
  }
});

export default GifCell;