import { StyleSheet } from 'react-native';
import theme from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.COLORS.PRIMARY,
  },
  filterButtonText: {
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#666',
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  billCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  billActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
  billInfo: {
    marginTop: 8,
  },
  billAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.PRIMARY,
  },
  billDueDate: {
    color: '#666',
    marginTop: 4,
  },
  billStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  billStatusText: {
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: theme.COLORS.PRIMARY,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
