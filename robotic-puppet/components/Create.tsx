import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Icons } from '@/constants/Icons';

const Create = () => {
  return (
    <View>
      <TouchableOpacity className='relative w-[60px] h-[60px] mt-12 mr-12'>
        <Image 
          source={Icons.plus}
          className='w-[60px] h-[60px]'
          resizeMode='contain'
        />
      </TouchableOpacity>
    </View>
  )
}

export default Create