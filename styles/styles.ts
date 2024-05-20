import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  userSettings: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  balance: {
    fontSize: 24,
    marginVertical: 20,
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
  movements: {
    width: '100%',
    marginTop: 20,
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
});

export default globalStyles;
