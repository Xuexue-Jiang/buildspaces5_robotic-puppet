import Slider from '@react-native-community/slider'
import { View, Text } from 'react-native'

interface SliderComponentProps {
  configValue: number;
  onValueChange: (value: number) => void;
  disabled: boolean;
  leftLabel: string; 
  rightLabel: string;
}

const SliderComponent = ({ configValue, onValueChange, disabled, leftLabel, rightLabel }: SliderComponentProps) => {

  return (
    <View>
      <Slider
        style={{width: 250, height: 40}}
        minimumValue={-100}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#4D611A"
        value={configValue}
        onValueChange={onValueChange}
        disabled={disabled}
        tapToSeek={true}
      />
      <View className="flex-row text-sm justify-between">
        <Text>
          {leftLabel}
        </Text>
        <Text>
          {rightLabel}
        </Text>
      </View>
    </View>
  )
}

export default SliderComponent