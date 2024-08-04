import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Image,
  TouchableOpacity, 
  StatusBar, 
  Text, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Icons } from '@/constants/Icons';
import { Images } from '@/constants/Images';
import Create from '@/components/Create'
import Edit from '@/components/Edit'
import MoodConfig from './moodConfig';
import PersonalityConfig from './personalityConfig'
import { MoodConfigurations, PersonalityConfigurations } from '@/utils/configTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMoodConfig, fetchPersonalityConfig, updateMoodConfig, updatePersonalityConfig } from '@/utils/api';

export default function ConfigurationLayout() {

  const [selectedConfig, setSelectedConfig] = useState<'Mood' | 'Personality'>('Mood')
  
  const [moodConfigurations, setMoodConfigurations] = useState<MoodConfigurations>({
    fear: 0,
    joy: 0,
    surprise: 0,
    trust: 0,
  })

  const [intialMoodConfigurations, setInitialMoodConfigurations] = useState<MoodConfigurations>({
    fear: 0,
    joy: 0,
    surprise: 0,
    trust: 0,
  })

  const [personalityConfigurations, setPersonalityConfigurations] =   useState<PersonalityConfigurations>({
    positive: 0,
    peaceful: 0,
    open: 0,
    extravert: 0,
  })
  
  const [initialPersonalityConfigurations, setInitialPersonalityConfigurations] = useState<PersonalityConfigurations>({
    positive: 0,
    peaceful: 0,
    open: 0,
    extravert: 0,
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getConfigurations = async () => {
      try {
        const moodData = await AsyncStorage.getItem('moodConfigurations');
        if (moodData) {
          setMoodConfigurations(JSON.parse(moodData))
          setInitialMoodConfigurations(JSON.parse(moodData))
        } else {
          const fetchedMoodData = await fetchMoodConfig();
          setMoodConfigurations(fetchedMoodData);
          await AsyncStorage.setItem('moodConfigurations', JSON.stringify(fetchedMoodData));
          setInitialMoodConfigurations(JSON.parse(fetchedMoodData))
        }

        const personalityData = await AsyncStorage.getItem('personalityConfigurations');
        if (personalityData) {
          setPersonalityConfigurations(JSON.parse(personalityData));
          setInitialPersonalityConfigurations(JSON.parse(personalityData))
        } else {
          const fetchedPersonalityData = await fetchPersonalityConfig();
          setPersonalityConfigurations(fetchedPersonalityData);
          await AsyncStorage.setItem('personalityConfigurations', JSON.stringify(fetchedPersonalityData))
          setInitialPersonalityConfigurations(JSON.parse(fetchedPersonalityData))
        }

        setLoading(false)
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Error loading configuration...');
      }
    }

    getConfigurations();
  }, [])

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  }

  const handleSaveConfigurations = async () => {
    try {
      if (selectedConfig === 'Mood') {
        if (JSON.stringify(moodConfigurations) !== JSON.stringify(intialMoodConfigurations)){
          await updateMoodConfig(moodConfigurations)
          AsyncStorage.setItem('moodConfigurations', JSON.stringify(moodConfigurations))
          Alert.alert('Success', 'Mood configuration saved successfully!')
          setInitialMoodConfigurations(moodConfigurations)
        }
      } else if (selectedConfig === 'Personality') {
        if (JSON.stringify(personalityConfigurations) !== JSON.stringify(initialPersonalityConfigurations)) {
          await updatePersonalityConfig(personalityConfigurations)
          AsyncStorage.setItem('personalityConfigurations', JSON.stringify(personalityConfigurations))
          Alert.alert('Success', 'Personality configuration saved successfully!')
          setInitialPersonalityConfigurations(personalityConfigurations)
        }
      }
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <ActivityIndicator className='flex-1 justify-center items-center' size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex-1 h-full">
          <View className='flex-row justify-between items-center'>
            <View className='flex-col justify-center items-center ml-10'>
              <Image
                source={Images.eljo}
                className="w-[70px] h-[70px] mt-8"
                resizeMode="contain"
                />
              <Text className='font-psemibold text-lg'>
                Eljo
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.navigate('/')}>
              <Image
                source={Icons.speaker}
                className="w-[70px] h-[40px] mr-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mt-10">
            <TouchableOpacity className="relative w-[110px] h-[50px] ml-10" onPress={() => setSelectedConfig('Mood')}>
              <Image source={Images.mood} resizeMode="contain" className="w-[110px] h-[50px]"/>
              <Text className="font-psemibold absolute bottom-[15px] left-9">Mood</Text>
            </TouchableOpacity>

            <TouchableOpacity className="relative w-[150px] h-[50px] mr-10" onPress={() => setSelectedConfig('Personality')}>
              <Image source={Images.personality} resizeMode="contain" className="w-[150px] h-[50px] mr-6"/>
              <Text className="font-psemibold absolute bottom-[15px] right-9">
                Personality
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center items-center gap-10 mt-10 ml-3">
          {selectedConfig === 'Mood' && (
            <MoodConfig isEditMode={isEditMode} config={moodConfigurations} setConfig={setMoodConfigurations} />
          )}
          {selectedConfig === 'Personality' && (
            <PersonalityConfig isEditMode={isEditMode} config={personalityConfigurations} setConfig={setPersonalityConfigurations} />
          )}
          </View>
          <View className='flex-row justify-between items-center mb-12'>
            <Edit 
              isEditMode={isEditMode} 
              handleToggleEditMode={handleToggleEditMode} 
              saveConfigurations={handleSaveConfigurations} 
            />
            <Create />
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" barStyle="dark-content" />
    </SafeAreaView>
  )
}
