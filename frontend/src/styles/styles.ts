import { StyleSheet } from 'react-native';
import {theme} from "./color"

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
  cardBalance:{
    // backgroundColor: theme.colors.primary,
    shadowRadius: 10,
   
  },

  saldo:{
display: 'flex',
flexDirection: "column",
alignItems: 'flex-end',
  },
  balanceAmountInUSD: {
    fontSize: 14,
    color: 'gray'
    },
      card:{
    // backgroundColor: theme.colors.primary,
    shadowRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 10,
    paddingLeft:50,
  },
  currency: {
    fontSize: 28,
        
  },
  balanceAmount: {
    fontSize: 28,
    color: "#277ca5",
    fontWeight: 'bold',
  },
  button: {
    alignSelf: "center",
    margin: 16,
    padding: 4,
    borderRadius: 8,
    width: '100%',
  }
});

export default globalStyles;
