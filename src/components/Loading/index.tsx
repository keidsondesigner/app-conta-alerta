import { ActivityIndicator, View } from 'react-native';
import { styles } from './styles';
import theme from '@/theme';

export function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator 
        color={theme.COLORS.PRIMARY}
        size="large"
      />
    </View>
  );
}
