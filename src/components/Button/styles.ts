import { StyleSheet } from 'react-native';
import theme from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.PRIMARY,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.COLORS.WHITE,
    fontSize: theme.FONT_SIZE.MD,
    fontFamily: theme.FONT_FAMILY.BOLD,
  }
});
