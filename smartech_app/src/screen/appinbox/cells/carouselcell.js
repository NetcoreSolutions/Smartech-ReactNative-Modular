import React, {useRef, useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity,Text, Image, Dimensions, FlatList, Platform, ImageBackground, TextInput, useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';

const deviceWidth = Dimensions.get('window').width;

const CarouselCell = ({...props}) => {

  const itemObject = props.item ;
  const currentIndex = useRef()
  const flatListPortraitRef = useRef();
  const [carouselData, setCarousleData] = useState((Platform.OS === 'android') ? JSON.parse(itemObject.carousel) : itemObject.carousel) 
  const { width } = useWindowDimensions();

  const titleTagsStyles = {
    body: { fontSize:15,color:'#000', left:20},
    sub: { fontSize: 15},
    sup: { fontSize: 15},
  };

  const descriptionTagsStyles = {
    body: { fontSize:15, color:'#616161', left:20},
    sub: { fontSize: 13, lineHeight:10},
    sup: { fontSize: 15,lineHeight:20},
  };

  useEffect(() => {
    currentIndex.current = 0;
  }, [carouselData]);
 
  const handleOnNextPortrait = () => {		
    let carouselLength = carouselData		
    if (currentIndex.current >= carouselLength.length - 1) {		
      return;		
    }		
  		
    if (flatListPortraitRef.current) {		
      flatListPortraitRef.current.scrollToIndex({		
        animated: true,		
        index: currentIndex.current + 1,		
      });		
      currentIndex.current = currentIndex.current + 1;		
    }		
  }		
  const handleOnPrevPortrait = () => {		
    if (currentIndex.current === 0) {		
      return;		
    }		
  		
    if (flatListPortraitRef.current) {		
      flatListPortraitRef.current.scrollToIndex({		
        animated: true,		
        index: currentIndex.current - 1,		
      });		
      currentIndex.current = currentIndex.current - 1;		
    }		
  }

  return(
    <>
      <View style={styles.item}>
        <Text style={styles.publishDate} >
         {props.timeDiffCalc}
        </Text>

      <RenderHtml
        contentWidth={width}
        tagsStyles={titleTagsStyles}
        source={{html: itemObject.title}}
      />

      <RenderHtml
        contentWidth={width}
        tagsStyles={descriptionTagsStyles}
        source={{html: itemObject.description}}
      /> 
      

        {/* <Text style={styles.title}>{itemObject.title}</Text>
        <Text style={styles.description}>{itemObject.description}</Text> */}
        <View style = {[styles.flatListContainer, {width: (itemObject.notificationType === "CarouselPortrait") ? deviceWidth - 50 : deviceWidth - 30 , left: (itemObject.notificationType === "CarouselPortrait") ? 10 : 0 ,  marginTop: 14  }]}>
          {
            <View style = {{flexDirection:'row'}}>
            <FlatList
            ref={flatListPortraitRef}
            data={carouselData}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onEndReachedThreshold={0}
            renderItem={({ item, index }) => ((
              <TouchableOpacity 
              onPress= {() => {props.handleDeeplink(item)}}
              style={ itemObject.notificationType === "CarouselPortrait" ? styles.itemPortraitCarousel : styles.itemCarousel}>
              <View style={ itemObject.notificationType === "CarouselPortrait" ? styles.itemPortraitCarousel : styles.itemCarousel}>
                <View style={{height: 200, width:'100%' , alignSelf:'center'}}>
                  <View style={{height: '75%', width:'100%', paddingRight: 0}}>
                    <ImageBackground 
                      resizeMode = {itemObject.notificationType === "CarouselPortrait" ? 'contain' : 'cover'}
                      style={{height: '100%', width:'100%',  alignItems:'flex-start', justifyContent:'center'}}
                      source={{
                          uri: item.imgUrl,
                      }}
                    >
                    </ImageBackground>
                  </View>
                  <View style={{height: '25%', width:'100%'}}>
                  {/* <TextInput
                    value={item.imgTitle}
                    placeholder="Type some #hashtags or @mentions to get started."
                    multiline
                    numberOfLines={4}
                  /> */}

                    <Text style={styles.itemCarouseText}>{item.imgTitle}</Text>
                    <Text style={[styles.itemCarouseText, {color:'#616161'}]}>{item.imgMsg}</Text>
                  </View>
                </View>

              </View>
              </TouchableOpacity>
              )
            )}
            />

            <TouchableOpacity 
              onPress={handleOnPrevPortrait}
              style={{
                height: 50, 
                width: 40, 
                backgroundColor:'#ffffff90', 
                alignSelf:'center', 
                justifyContent:'center',
                position:'absolute',
                
              }}>
                <Image 
                  style={[styles.prevNextImg, {transform: [{ rotate: '180deg'}]}, {marginLeft:12}]}
                  resizeMode = 'contain'
                  source={require('../../../assets/images/right-chevron.png')}
                />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleOnNextPortrait}
              style={{
                backgroundColor:'#ffffff90', 
                height: 50, 
                width: 40, 
                right:0,
                alignSelf:'center', 
                justifyContent:'center',
                position:'absolute'
              }}>
                <Image 
                  style={[styles.prevNextImg]}
                  resizeMode = 'contain'
                  source={require('../../../assets/images/right-chevron.png')}
                />
            </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    </>
)};

const styles = StyleSheet.create({
  itemCarouseText:{
    color:'#000000', 
    fontSize: 14, 
    alignSelf:'center',
    fontWeight:'bold'
  },
  item: {
    backgroundColor: '#ffffff',
    height:280,
    width: deviceWidth - 30,
    marginTop: 20,
    marginHorizontal: 16,
    flexDirection:'column',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  itemButtons: {
    backgroundColor: '#ffffff',
    height:50,
    width:"80%",
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection:'column',
    width: deviceWidth - 30,
  },
  title: {
    left:5, 
    width: deviceWidth - 40,
    fontWeight: "bold",
    color: '#000000',
    fontSize: 15
  },
  description: {
    top:15,
    left:20,
    color:'#616161',
    fontSize: 14,
    fontWeight:'bold'
  },
  lastItem: {
    marginLeft: 70,
    marginRight: 70,
  },
  imageOverlay: {
    borderWidth: 1,
    borderRadius: 100,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    height: 150,
    top:0,
    width: deviceWidth - 80,
    alignSelf:'center',
    justifyContent:'center'
  },
  itemContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  itemCarousel: {
    backgroundColor: '#ffffff',
    height:250,
    width: deviceWidth - 30,
    padding:5,
    marginVertical: 8,
    flexDirection:'column',
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 9,
    alignSelf:'center'
  },
  itemPortraitCarousel: {
    backgroundColor: '#ffffff',
    height:250,
    width:(deviceWidth - 30)/2 - 15,
    marginVertical: 8,
    flexDirection:'column',
    borderColor: '#ffffff',
    alignSelf:'center',
    flexDirection:'row', marginRight: 10
  },
  alternativeLayoutButtonContainer: {
    marginL: 0,
    height:50,
    flexDirection: 'row',
    justifyContent: 'space-between',
   },
   buttonview: {
    alignItems: 'center',
    width: '45%',
    padding: 10,
    alignSelf:'center',
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    elevation: 2,
  },
  buttontext: {
    color: 'black',
    fontSize: 15,
  },
  flatListContainer: {
    height:200, 
    width: deviceWidth - 30,
    alignItems:'center',
  },
  publishDate: {
    marginTop: 8,
    width:120,
    alignSelf:'flex-end',
    textAlign: 'right',
    marginRight: 20
  },
  prevNextTouch: {
    backgroundColor:'#ffffff90', 
    height: 40, 
    width: 40, 
    alignItems:'center', 
    justifyContent:'center'
  },
  prevNextImg: {
    height: 25, 
    width: 25, 
    tintColor: 'black'
  }
});

export default CarouselCell;