import { View } from 'react-native'
import { PersonalityConfigurations } from '@/utils/configTypes'
import  SliderComponent  from '@/components/SliderComponent'

interface PersonalityConfigProps {
  isEditMode: boolean
  config: PersonalityConfigurations
  setConfig: (config: PersonalityConfigurations) => void
}

const PersonalityConfig = ({ isEditMode, config, setConfig }: PersonalityConfigProps) => {

  const handleValueChange = (field: keyof PersonalityConfigurations, value: number) => {
    if (config) {
      // Round the value to the nearest integer
      const roundedValue = Math.round(value);
      // Clamp the value within the range [-100, 100]
      const clampedValue = Math.max(-100, Math.min(100, roundedValue))
      setConfig({ ...config, [field]: clampedValue });
    }
  }

  const configKeys: (keyof PersonalityConfigurations)[] = ['positive', 'peaceful', 'open', 'extravert']

  const getLeftLabels = (key: keyof PersonalityConfigurations): string => {
    const leftLabels: Record<keyof PersonalityConfigurations, string> = {
      positive: '😞 Negative',
      peaceful: '🥶 Hostile',
      open: '🔒 Closed',
      extravert: '🫣 Introvert'
    };
    return leftLabels[key];
  };

  const getRightLabel = (key: keyof PersonalityConfigurations): string => {
    const rightLabels: Record<keyof PersonalityConfigurations, string> = {
      positive: 'Positive 🤩',
      peaceful: 'Peaceful 😇',
      open: 'Open 🤗',
      extravert: 'Extravert 😎'
    };
    return rightLabels[key];
  };

  return (
    <View className="flex-1 justify-center items-center gap-10">
      {configKeys.map((key) => (
          <View key={key}>
            <SliderComponent
              configValue={config[key]}
              onValueChange={isEditMode ? (value) => handleValueChange(key, value) : () => {}}
              disabled={!isEditMode}
              leftLabel={getLeftLabels(key)}
              rightLabel={getRightLabel(key)}
            />
          </View>
        ))}
    </View>
  )
}

export default PersonalityConfig