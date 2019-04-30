import React from 'react';
import { View, TouchableOpacity} from 'react-native';
import {  Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import colorScheme from './Colors.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft  } from '@fortawesome/free-solid-svg-icons'

class ViewHeader extends React.Component {

  render() {
      return (
        <Header
        leftComponent= {
          this.props.showBack ?
          (
            <TouchableOpacity style={{height: 30, justifyContent: 'flex-end', width:50, alignItems:'center'}} onPress={() => {this.props.navigation.goBack(null)}}>
              <FontAwesomeIcon icon={ faChevronLeft } color={'white'} size={20}/>
            </TouchableOpacity>
          )
          : <View style={{width:50}} /> }
          containerStyle={{ backgroundColor: colorScheme.primary, height: 100}}
          centerComponent={{ text: this.props.name, style: { fontSize: 17, color: 'white' } }}
        /> )
      }
}

export default withNavigation(ViewHeader);
