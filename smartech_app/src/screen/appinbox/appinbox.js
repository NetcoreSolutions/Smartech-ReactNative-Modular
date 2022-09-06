import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import { View, StyleSheet,FlatList, SafeAreaView, TouchableOpacity, Text, Modal, Pressable, Platform, Image, Dimensions, RefreshControl } from 'react-native';

import SimpleCell from './cells/simplecell.js';
import CategoryCell from './cells/categorycell.js';
import AudioCell from './cells/audiocell';
import VideoCell from './cells/videocell';
import GifCell from './cells/gifcell';
import CarouselCell from './cells/carouselcell';
import {kNotificationCategoryVideoNotification, kActionNameCopy, kActionNameDeeplink, kActionNameURL} from '../../utills/constants';
import { LogBox } from 'react-native';
import moment from 'moment';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const SmartechAppInboxReact = require('smartech-appinbox-react-native');
const deviceWidth = Dimensions.get('window').width;

const AppInbox = ({navigation}) => {

  const refs = useRef([]);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [appInboxMessages, setAppInboxMessages] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

    useEffect(() => {
        LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
        getAppInboxMessagesAPICall()
        //getAppInboxMsgs()
    }, []);

   const getAppInboxMessagesAPICall = () => {
      SmartechAppInboxReact.getAppInboxMessagesByApiCall(30,1,(Platform.OS === 'android') ? JSON.stringify(selectedFilters) : selectedFilters,(error, appInboxMessages) => {
       getAppInboxCategory() 
       getCategoryList()
      })
    }

    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => {setIsShowFilter(true)}}>
            <Image source={require('../../assets/images/filterNotifications.png')} style={{height: 23, width: 23, marginRight: 15}} />
          </TouchableOpacity>
        ),
      });
    }, [navigation]);

    const getCategoryList = () => {
      SmartechAppInboxReact.getAppInboxCategoryList((error, categoryList) => {
        setCategoryList([])
        let categoryListData = (Platform.OS === 'android') ? JSON.parse(categoryList) : categoryList
        setCategoryList(categoryListData)
      });
    }

    const getAppInboxCategory = () => {
      SmartechAppInboxReact.getAppInboxMessagesWithCategory( (Platform.OS === 'android') ? JSON.stringify(selectedFilters) : selectedFilters , (error, appInboxMessages) => {
        let appInboxData = (Platform.OS === 'android') ? JSON.parse(appInboxMessages) : appInboxMessages
        setAppInboxMessages(appInboxData)
      });
    }

    const pullToRefreshApiCall = () => {
      setIsRefreshing(true);
      SmartechAppInboxReact.getAppInboxMessagesByApiCall(30,2,(Platform.OS === 'android') ? JSON.stringify(selectedFilters) : selectedFilters,(error, appInboxMessages) => {
            setIsRefreshing(false);
            getAppInboxCategory()
            getCategoryList()
      })
    }

    const getAppInboxMsgs = () => {
      //ALL_MESSAGE = 0, DISMISS_MESSAGE = 1, READ_MESSAGE = 2, UNREAD_MESSAGE =3
      SmartechAppInboxReact.getAppInboxMessages(0 , (error, appInboxMessages) => {
          let appInboxData = (Platform.OS === 'android') ? JSON.parse(appInboxMessages) : appInboxMessages
          setAppInboxMessages(appInboxData)
      });
    }

    const renderSelectedFilters = ({item, index}) => {
      return item.isSelected ? (
        <View style={styles.filterItem}>
            <Text style={[styles.selectedFilterCat, {marginLeft: 5}]}>
                {item.categoryName}
            </Text>
            <TouchableOpacity style={{marginRight: 5}} onPress={() => handleCrossCheckbox(index, item.categoryName)}>
              <Image 
                source={require('../../assets/images/cross.png')} 
                style={styles.selectedFilterImg}
              />
            </TouchableOpacity>
        </View>
      ) : null
    }

    const renderCell = (item, itemIndex) => {
      const actionBtnParsed =  (Platform.OS === 'android') ? JSON.parse(item.actionButton) : item.actionButton;
      console.log('item---',item)
      if (item.notificationType == "Simple"){
        return ( <Pressable  onPress={() =>{ _onPress(item)}} ><SimpleCell timeDiffCalc={timeDiffCalc(item.publishedDate)} item={item} index={item.id} actionButtons={() => actionBtnParsed.length > 0 ? actionButtons(actionBtnParsed, item, itemIndex) : null} /></Pressable>)
      }else if (item.notificationType == "Audio"){
        return (<Pressable  onPress={() =>{ _onPress(item)}} ><AudioCell timeDiffCalc={timeDiffCalc(item.publishedDate)} item={item} index={item.id} actionButtons={() =>actionBtnParsed.length > 0 ? actionButtons(actionBtnParsed, item, itemIndex) : null} /></Pressable>)
      }else if (item.notificationType == kNotificationCategoryVideoNotification){
        return (<Pressable  onPress={() =>{ _onPress(item)}} ><VideoCell timeDiffCalc={timeDiffCalc(item.publishedDate)} item={item} index={item.id} actionButtons={() =>actionBtnParsed.length > 0 ? actionButtons(actionBtnParsed, item, itemIndex) : null} /></Pressable>)
      }else if (item.notificationType == "Image" || item.notificationType == "Gif"){
        return (<Pressable  onPress={() =>{ _onPress(item)}} ><GifCell timeDiffCalc={timeDiffCalc(item.publishedDate)} item={item} index={item.id} actionButtons={() => actionBtnParsed.length > 0 ? actionButtons(actionBtnParsed, item, itemIndex) : null} /></Pressable>)
      }else if (item.notificationType == "CarouselLandscape"|| item.notificationType == "CarouselPortrait"){
         return (<Pressable  onPress={() =>{ _onPress(item)}} ><CarouselCell timeDiffCalc={timeDiffCalc(item.publishedDate)} item={item} index={item.id} actionButtons={() => actionBtnParsed.length > 0 ? actionButtons(actionBtnParsed, item, itemIndex) : null} handleDeeplink = { () => {handleDeeplink(item)}} /></Pressable>)
      }
    };

    const handleDeeplink = (item) => {		
      let carousel = (Platform.OS === 'android') ? JSON.parse(item.carousel) : item.carousel;
      if (carousel[0].imgDeeplink){
        SmartechAppInboxReact.markMessageAsClicked(item.trid, carousel[0].imgDeeplink)
      }
    }
    
    const applyCategoryfilter = (isShowFilter, updatedCategoryList) => { 
      var tempAppInboxMessages

      if (isShowFilter === 1){
        setIsShowFilter(false)
        tempAppInboxMessages = categoryList.filter(item => item.isSelected === true);
      }else{
         tempAppInboxMessages = updatedCategoryList.filter(item => item.isSelected === true);
      }
 
      setSelectedFilters(tempAppInboxMessages)
    
      console.log('tempAppInboxMessages',tempAppInboxMessages)
      SmartechAppInboxReact.getAppInboxMessagesWithCategory( (Platform.OS === 'android') ? JSON.stringify(tempAppInboxMessages) : tempAppInboxMessages , (error, appInboxMessages) => {
        let appInboxData = (Platform.OS === 'android') ? JSON.parse(appInboxMessages) : appInboxMessages
        setAppInboxMessages(appInboxData)
      });
    }
    
    const handleCheckbox = (index,selectedStatus) => {
       const selectedCategory = {
        'categoryName': categoryList[index].categoryName,
        'isSelected': !categoryList[index].isSelected   
       }
       let temCatList = [...categoryList];
       temCatList[index] = selectedCategory;
       setCategoryList(temCatList);
       applyCategoryfilter(0,temCatList)
    }

    const handleCrossCheckbox = (index,categoryName) => {
      let clickIndex = categoryList.findIndex(obj => obj.categoryName === categoryName);
       const selectedCategory = {
        'categoryName': categoryName,
        'isSelected': false  
       }
       let temCatList = [...categoryList];
       temCatList[clickIndex] = selectedCategory;
       setCategoryList(temCatList);
       applyCategoryfilter(0,temCatList)
    }

    const  _onPress = (item) => {
      // //ALL_MESSAGE = 0, DISMISS_MESSAGE = 1, READ_MESSAGE = 2, UNREAD_MESSAGE =3
      // SmartechAppInboxReact.getAppInboxMessageCount( 0, (error, count) => {
      //   console.log('getAppInboxMessageCount = ', count);
      // });
      if (item.deeplink){
        SmartechAppInboxReact.markMessageAsClicked(item.trid, item.deeplink)
      }
    };

    const onPressActionBtn = (item, props, itemIndex) => {
      console.log(props,'onPressActionBtn item',item)
      switch (item.aTyp) {
        case kActionNameDeeplink || kActionNameURL: {
          console.log(kActionNameDeeplink);
          SmartechAppInboxReact.markMessageAsClicked(props.trid,item.actionDeeplink)
        }
         break;

         case kActionNameCopy : {
          let itemObj = (Platform.OS === 'android') ?  JSON.stringify(item) : item
          SmartechAppInboxReact.copyMessageAsClicked(itemObj,props.trid)
        }
         break;
        // case kActionNameDismiss: {
        //   let itemObj = (Platform.OS === 'android') ?  JSON.stringify(props) : props
        //   SmartechAppInboxReact.markMessageAsDismissed( itemObj, (error, status) => {
        //     if (status){
        //       //Remove data from array and refresh the table view
        //       console.log('Deleted---',status);
        //       let tempAppinbox = [...appInboxMessages];
        //       tempAppinbox.splice(itemIndex,1);
        //       setAppInboxMessages(tempAppinbox)  
        //     }
        //   });
        // }
        // break;
      
        default:
          break;
      }
    }

    const actionButtons = (props,itemObject, itemIndex) => {
      console.log('actionButtons props', props)
      return(
        <View style={[styles.actionBtnView, {paddingHorizontal: 10}]}>
          {props.map((item, index) => {
            return(
              <TouchableOpacity key={index} onPress={() => onPressActionBtn(item, itemObject, itemIndex)}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>{item.actionName}</Text>
              </TouchableOpacity>
            )
            
          })}

        </View>
      )
    }

    const onDismissMessage = (item, itemIndex) => {
      let itemObj = (Platform.OS === 'android') ?  JSON.stringify(item) : item
      SmartechAppInboxReact.markMessageAsDismissed( itemObj, (error, status) => {
        if (status){
          let tempAppinbox = [...appInboxMessages];
          tempAppinbox.splice(itemIndex,1);
          setAppInboxMessages(tempAppinbox)  
        }
      });
    }

    const viewabilityConfig = {
      viewAreaCoveragePercentThreshold: 50,
    };

    const rightSwipeActions = (item, index) => {
      return (
          <View
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignSelf:'center',
            }}
          >
            <View style={{paddingHorizontal: 10,paddingHorizontal: 30,paddingVertical: 20, alignItems:'center', justifyContent:"center"}}>
              <Image style={{
                  width: 25,
                  height: 25
                }} 
                source={require('../../assets/images/delete_icon.png')} 
              />
            </View>
          </View>
      );
    };

    const onViewRef = React.useRef((viewableItems, changed)=> {
      for (let index = 0; index < viewableItems.viewableItems.length; index++) {
         const item = viewableItems.viewableItems[index];
         let itemObj = (Platform.OS === 'android') ?  JSON.stringify(item) : item

         if (Platform.OS === 'android') {
            let itemDetail = JSON.parse(itemObj)
            if(itemDetail.item.status != "viewed") {
                SmartechAppInboxReact.markMessageAsViewed(JSON.stringify(itemDetail.item))
            }
         }else {
          console.log('item object----', itemObj.item);
          if(itemObj.item.status != "viewed") {
            SmartechAppInboxReact.markMessageAsViewed(itemObj.item)
           }
         }
      }
    })
    
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

    const swipeAction = (item, swipeable, index) => {
      // process data
      onDismissMessage(item, index)
      swipeable.close()
    }

    const timeDiffCalc = publishedDate => {

      console.log('publish date', publishedDate);

      if (Platform.OS == 'android'){

        const formattedOldDate = moment(new Date(publishedDate));
        const formattedCurrentDate = moment(new Date());
        const formattedPublishedDate = moment(new Date(publishedDate)).format('D MMMM YYYY');
        let diffInMilliSeconds = Math.abs(formattedOldDate - formattedCurrentDate) / 1000;
    
        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;
        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
    
        let difference = '';
        if (days > 0) {
          difference = (days === 1) ? `${days} day ago` : `${formattedPublishedDate}`;
        } else if(hours > 0) {
          difference = (hours === 1) ? `${hours} hour ago` : `${hours} hours ago`;
        } else if(minutes >= 0){
            difference = (minutes === 0) ? 'Just now' : (minutes === 1) ? `${minutes} minute ago` : `${minutes} minutes ago`;
        }
        return difference;

    } else {
        return publishedDate
    }
    }

    const renderModal = () => {
      return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isShowFilter}
          onRequestClose={() => {
            setIsShowFilter(false)
          }}
        >
        <SafeAreaView style={{flex:1}}>
        <TouchableOpacity style={{flex:1}} onPress={() => { setIsShowFilter(false)}}>
          <View style={styles.containerStyle}>
            <Image 
                source={require('../../assets/images/play.png')} 
                style={styles.arrowImg}
              /> 
            <View style={[styles.content,  {height : '20%'}]}>
              <FlatList
                data={categoryList}
                nestedScrollEnabled={true}
                renderItem={({ item, index }) => (
                  <CategoryCell
                      item={item}
                      index={index}
                      categoryList={categoryList}
                      checkBoxClicked={handleCheckbox}
                  />
                )}
              /></View>
          </View>
          </TouchableOpacity>
          </SafeAreaView>
          {/* </> */}
        </Modal>
      )
    }

    return (
        <View style = {{flex:1}}>
          <View style={{marginVertical: 10}}>
            <FlatList
              style={{}}
              horizontal
              data={selectedFilters}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem = {renderSelectedFilters}
            />
          </View>
          <View style={[styles.flatList]}>
            <FlatList
              data={appInboxMessages}
              refreshControl={
                <RefreshControl 
                    refreshing={isRefreshing} 
                    onRefresh={pullToRefreshApiCall}
                    tintColor="#F8852D"/>
              }
              renderItem={({item, index}) =>  
                <Swipeable
                  key={item.trid}
                  ref={swipeable => refs.current[index] = swipeable}
                  overshootRight={true}
                  renderRightActions={rightSwipeActions}
                  onSwipeableRightOpen={() => swipeAction(item, refs.current[index], index)}
                >
                {renderCell(item, index)}
                </Swipeable>
              }
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={<View style={{height: 15}}/>}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
            />
          </View>
          {renderModal()}
        </View>
    )
};
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column'
    },
    flatList:{
      flex:1
    },
    containerStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      top:50,
      backgroundColor: 'rgba(52, 52, 52, 0.6)',
      Radius: 16,
    },
    content: {
      alignSelf:'flex-start',
      width: '38%',
      backgroundColor: '#FFFFFF',
      top:17,
      justifyContent:'flex-end',
      marginHorizontal:'2%',
      padding:'2%'
    },
    alternativeLayoutButtonContainer: {
      marginL: 0,
      height:50,
      flexDirection: 'row'
    },
    buttonview: {
      alignItems: 'center',
      width: '45%',
      padding: 10,
      marginTop: 0,
      marginLeft: 5,
      marginRight: 18,
      marginBottom: 5,
      elevation: 2,
      backgroundColor: '#3578F6'
    },
    buttontext: {
      color: '#ffffff',
      fontSize: 20
    },
    filterItem: {
      borderWidth: 1, 
      borderColor: '#d3d3d3', 
      marginHorizontal: 10, 
      borderRadius: 15,
      backgroundColor:'#ffffff',
      flexDirection: 'row',
      alignItems: 'center',
      height: 35
    },
    selectedFilterCat: {
      color:'#000000', 
      fontSize: 15,
    },
    selectedFilterImg: {
      height: 20, 
      width: 20, 
      alignSelf:'center', 
      marginLeft: 5, 
      marginTop: 2
    },
    actionBtnView: {
      width: deviceWidth - 30, 
      height: 30, 
      backgroundColor: '#d3d3d395', 
      alignSelf:'center', 
      borderBottomRightRadius: 9, 
      borderBottomLeftRadius: 9, 
      flexDirection: 'row', 
      alignItems:'center', 
      justifyContent:'space-between'
    },
    arrowImg: {
      height: 20, 
      width: 20, 
      justifyContent:'flex-end',
      right:15,
      position:'absolute',
      transform: [{rotate: '270deg'}]
    },
});

export default AppInbox;
