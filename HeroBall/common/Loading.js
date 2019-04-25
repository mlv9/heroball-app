import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBasketballBall  } from '@fortawesome/free-solid-svg-icons'
import {
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import colorScheme from './Colors.js'

export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.timeoutHandle = setTimeout(()=>{
      this.redirectToApp()
    }, 2000);
  }

  componentWillUnmount(){
      clearTimeout(this.timeoutHandle); 
  }
  
  redirectToApp = async () => {
    this.props.navigation.navigate('App');
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: colorScheme.primary}}>
        <View style={{flex:1}}>
          <View style={{flex: 1, marginTop:20, justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesomeIcon style={{color: colorScheme.buttons, marginBottom: 30}} icon={faBasketballBall} size={150} />
            <Text style={{fontSize:20, paddingBottom: 20, color: 'black'}}>Welcome to HeroBall</Text>
            <ActivityIndicator />
          </View>
        </View>
      </View>
    );
  }
}
