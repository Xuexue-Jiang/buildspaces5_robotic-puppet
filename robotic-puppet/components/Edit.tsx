import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Images } from '@/constants/Images'

interface EditProps {
  isEditMode: boolean;
  handleToggleEditMode: () => void;
  saveConfigurations: () => void;
}

const Edit = ({
  isEditMode, 
  handleToggleEditMode, 
  saveConfigurations
}: EditProps) => {

  return (
    <View>
      <TouchableOpacity onPress={isEditMode ? saveConfigurations : handleToggleEditMode} className='relative w-[120px] h-[50px] mt-10 ml-10'>
        <Image source={Images.edit} resizeMode="contain" className="w-[120px] h-[50px]" />
        <Text className={`text-2xl font-psemibold absolute bottom-2 ${isEditMode ? 'ml-8 text-white' : 'ml-10'}`}>{isEditMode ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Edit