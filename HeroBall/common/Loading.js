import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBasketballBall  } from '@fortawesome/free-solid-svg-icons'
import {
  View,
} from 'react-native';
import colorScheme from './Colors.js'
import * as Animatable from 'react-native-animatable';

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
            <Animatable.View
              animation="bounceIn" 
              easing="ease-out" 
              duration={1500}
              iterationCount={1}>
              <FontAwesomeIcon style={{color: '#d16d2b', }} icon={faBasketballBall} size={200} />
            </Animatable.View>
            <Animatable.Text animation="flipInX" delay={600} iterationCount={1} style={{fontWeight: 'bold', fontSize:30, fontFamily: 'System', paddingBottom: 20, color: 'white', marginTop: 20}}>HeroBall</Animatable.Text>
          </View>
        </View>
      </View>
    );
  }
}
