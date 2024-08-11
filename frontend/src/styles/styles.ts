import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginTop: 40,
  },
  containerLogin: {
    height: '100%',
    justifyContent: 'space-between',
    padding: 16,
  },
  item: {
    marginVertical: 8,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginVertical: 8,
  },
  userSettings: {
    position: 'absolute',
    left: '5%',
    top: '5%',
  },
  balance: {
    fontSize: 32,
    color: '#277ca5',
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: '#007ACC',
    textDecorationLine: 'underline',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  movementsCard: {
    margin: 16,
    width: '100%',
  },
  screenHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  currency: {
    fontSize: 18,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    alignSelf: "center",
    margin: 16,
    padding: 8,
    borderRadius: 8,
    width: '100%',
  }
});

export default globalStyles;
