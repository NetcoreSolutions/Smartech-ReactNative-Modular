import React from 'react';
import { View, StyleSheet, Text , useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';

const SmipleCell = ({...props}) => {
  const item = props.item;
  const { width } = useWindowDimensions();

  const titleTagsStyles = {
    body: { fontSize:15,color:'#000'},
    sub: { fontSize: 15},
    sup: {fontSize: 15},
  };

  const descriptionTagsStyles = {
    body: { fontSize:15, color:'#616161'},
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

      {/* <Text style={styles.title}>{item.title}</Text> */}
      {/* <Text style={styles.description}>{item.description}</Text> */}
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
    padding: 10,
    marginTop: 8,
    marginHorizontal: 16,
    flexDirection:'column',
    borderColor: '#ffffff',
    borderWidth: 2,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  title: {
    fontSize: 15,
  },
  description: {
    fontSize: 14,
    color:'#616161',
    fontWeight:'bold',
  },
  publishDate: {
    top:0,
    width:120,
    alignSelf:'flex-end',
    textAlign: 'right',
    marginRight: 5
  },
});

export default SmipleCell;