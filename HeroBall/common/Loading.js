import React from 'react';
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
      <View style={{flex: 1, backgroundColor: colorScheme.primary, justifyContent: 'center', alignItems: 'center'}}>
        <View>
          <View style={{marginTop:20}}>
          <Text style={{fontSize:20, paddingBottom: 20, color: colorScheme.secondary}}>Welcome to HeroBall</Text>
          <ActivityIndicator />
          </View>
        </View>
      </View>
    );
  }
}
