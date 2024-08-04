import { 
  View, 
  SafeAreaView, 
  ScrollView, 
  StatusBar, 
  Image, 
  TouchableOpacity,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native'
import { router } from "expo-router"
import { Images } from '@/constants/Images'
import { Icons } from '@/constants/Icons'
import { useEffect, useRef, useState } from 'react';
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Buffer } from 'buffer';


const App = () => {
  const [isRecording, setIsRecording] = useState<Boolean>(false);
  const [client, setClient] = useState<WebSocket | null>(null);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  useEffect(() => {
    requestPermissions();
  }, []);

  const websocketUrl = Platform.OS === 'ios' ? 'ws://192.168.1.214:8000/ws' : 'ws://10.0.2.2:8000/ws';

  useEffect(() => {
    const newClient = new WebSocket(websocketUrl);
    setClient(newClient);

    newClient.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    newClient.onmessage = (message) => {
      console.log('Received message:', message.data);
    };

    newClient.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    newClient.onclose = () => {
      console.log('WebSocket Client Disconnected');
    };

    return () => {
      newClient.close();
    };
  }, [websocketUrl]);

  const startRecording = async () => {
    // const hasPermission = await requestPermissions();
    // if (!hasPermission) {
    //   return;
    // }

    setIsRecording(true);
    const audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
    await AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      MeteringEnabled: false,
      IncludeBase64: true,
    });

    AudioRecorder.onProgress = (data: any) => {
      console.log('Recording progress', data);
      if (client && client.readyState === WebSocket.OPEN) {
        // Sending base64 encoded data as bytes
        const audioBuffer = Buffer.from(data.currentTime.toString(), 'base64');
        client.send(audioBuffer);
      }
    };

    AudioRecorder.onFinished = (data: any) => {
      console.log(`Recording finished.`);
      setIsRecording(false);
      // Here you can handle the saved file if needed
    };

    await AudioRecorder.startRecording();
  };

  const stopRecording = async () => {
    await AudioRecorder.stopRecording();
    setIsRecording(false);
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      const microphoneStatus = await check(PERMISSIONS.IOS.MICROPHONE);
      console.log('Microphone status:', microphoneStatus);
      if (microphoneStatus !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.IOS.MICROPHONE);
        console.log('Microphone request result:', result);
      }
    } else if (Platform.OS === 'android') {
      const microphoneStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      console.log('Microphone status:', microphoneStatus);
      if (!microphoneStatus) {
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        console.log('Microphone request result:', result);
      }
    }
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
          
        }}
      >
        <View className="w-full flex-1 h-full">
          <View className='flex-row justify-between items-center'>
            <Image
              source={Icons.volume}
              className="w-[70px] h-[40px] ml-8 mt-12"
              resizeMode="contain"
            />

            <TouchableOpacity onPress={() => router.navigate('/moodConfig')}>
              <Image
                source={Icons.chatbot}
                className="w-[70px] h-[40px] mr-8 mt-12"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center items-center">
          
            <Image
              source={Images.voice}
              className="w-[200px] h-[175px] mt-20"
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity 
            className='flex-row justify-center items-center'
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text className="text-2xl font-psemibold mt-10">
              {isRecording ? 'Stop' : 'Start'}
            </Text>
            <Image 
              source={Images.microphone}
              resizeMode='contain'
              className='w-[200px] h-[200px] mb-4'
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" barStyle="dark-content" />
    </SafeAreaView>
  )
}

export default App