import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E0F7FA',
  },
  userSettings: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  balanceContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  balanceHeader: {
    fontSize: 16,
    color: '#333',
    marginTop: 25,
  },
  balance: {
    fontSize: 32,
    marginVertical: 0,
    color: '#007ACC',
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: '#007ACC',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  keyFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  featureCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  movementsContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  movementsHeader: {
    fontSize: 18,
    marginBottom: 10,
  },
  movementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amount: {
    color: 'red',
  },
  balanceScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  balanceScreenHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  currency: {
    fontSize: 18,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default globalStyles;
