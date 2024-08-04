import { View } from 'react-native'
import { MoodConfigurations } from '@/utils/configTypes'
import  SliderComponent  from '@/components/SliderComponent'

interface MoodConfigProps {
  isEditMode: boolean;
  config: MoodConfigurations;
  setConfig: (config: MoodConfigurations) => void;
}

const MoodConfig = ({ isEditMode, config, setConfig }: MoodConfigProps ) => {

  const handleValueChange = (field: keyof MoodConfigurations, value: number) => {
    if (config) {
      // Round the value to the nearest integer
      const roundedValue = Math.round(value);
      // Clamp the value within the range [-100, 100]
      const clampedValue = Math.max(-100, Math.min(100, roundedValue))
      setConfig({ ...config, [field]: clampedValue });
    }
  }

  const configKeys: (keyof MoodConfigurations)[] = ['joy', 'fear', 'trust', 'surprise']

  const getRightLabels = (key: keyof MoodConfigurations): string => {
    const rightLabels: Record<keyof MoodConfigurations, string> = {
      joy: 'Joy 😊',
      fear: 'Fear 😱',
      trust: 'Trust 🤓',
      surprise: 'Surprise 😮'
    };
    return rightLabels[key];
  };

  const getLeftLabels = (key: keyof MoodConfigurations): string => {
    const leftLabels: Record<keyof MoodConfigurations, string> = {
      joy: '😢 Sadness',
      fear: '😡 Anger',
      trust: '🤢 Disgust',
      surprise: '🤔 Anticipation'
    };
    return leftLabels[key]
  }
  
  return (
    <View className="flex-1 justify-center items-center gap-10">
      {configKeys.map((key) => (
        <View key={key}>
          <SliderComponent
            configValue={config[key]}
            onValueChange={isEditMode ? (value) => handleValueChange(key, value) : () => {}}
            disabled={!isEditMode}
            leftLabel={getLeftLabels(key)}
            rightLabel={getRightLabels(key)}
          />
        </View>
      ))}
    </View>
  )
}

export default MoodConfig