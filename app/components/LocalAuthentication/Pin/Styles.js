import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: 'red',
    position: 'absolute',
    right: -99,
    // right: 0,
    top: Constants.statusBarHeight,
  },
  pinBox: {
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'black',
    height: 30,
    width: 30,
    marginRight: 14,
    justifyContent: 'center',
  },
  pinBoxList: {
    flex: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  btnCancel: {
    flex: -1,
    alignSelf: 'center',
    padding: '10%',
  },
  pinView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(239, 239, 244)',
  },
  pinPromptText: {
    marginBottom: 10,
  },
  errorMessage: {
    textAlign: 'center',
    color: '#ea3d13',
    height: 65,
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 20,
  },
});
