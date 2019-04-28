import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser  } from '@fortawesome/free-solid-svg-icons'
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';

class Players extends React.Component {

  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
        <ViewHeader name='Players' />
      </View>
    );
  }
}

Players.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: true,
        tabBarIcon: ({ focused, tintColor }) => {
              return (
                  <FontAwesomeIcon icon={ faUser } color={focused ? tintColor : '#E5E7E9'} size={45}/>
              )
        }
    }
};

export default Players;