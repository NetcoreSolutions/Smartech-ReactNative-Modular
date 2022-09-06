import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Text, Pressable, Platform } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const CategoryCell = ({...props}) => {
  const item = props.item;
  const [isCategorySelected, setIsCategorySelected] = useState(item.isSelected);
  const [isCheckboxDisable, setIsCheckboxDisable] = useState(false);

  useEffect(() => {
      if (Platform.OS == 'android'){
         setIsCheckboxDisable(false)
      }else {
         setIsCheckboxDisable(true)
      }
  }, [])

  return(
    <Pressable onPress = {(index) => {( 
       props.checkBoxClicked(props.index,!isCategorySelected),
       setIsCategorySelected(!isCategorySelected)
      )} }>
      <View style={styles.item}>
      <Text style={styles.title}>{item !== null ? item.categoryName: ""}</Text>
        <CheckBox
            disabled = {isCheckboxDisable}
            style={styles.tinyLogo}
            value={isCategorySelected}
            boxType={'square'}
            onValueChange={() => {
              props.checkBoxClicked(props.index,!isCategorySelected)
              setIsCategorySelected(!isCategorySelected)
            }}
          /> 
      </View>
      <View style = {{width:'100%', height: 0.5, backgroundColor:'grey'}}>

      </View>
    </Pressable>
)};

const styles = StyleSheet.create({
  
  item: {
    flexDirection:'row',
    margin: 5,
    alignItems:'center',
    height:40,
    flexDirection: 'row',
  },
  title: {
    left:10,
    fontSize: 15,
    flex:1
  },
  tinyLogo: {
    alignItems:'flex-end',
    width: 50,
    height: 20,
    left:10
  },
});

export default CategoryCell;