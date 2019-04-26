import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUsers  } from '@fortawesome/free-solid-svg-icons'
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';

class LandingScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  
  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
        <ViewHeader name='Title' />
          <Text>Blank Page</Text>}
      </View>
    );
  }
}

LandingScreen.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: true,
        tabBarIcon: ({ focused, tintColor }) => {
              return (
                  <FontAwesomeIcon icon={ faUsers } color={focused ? tintColor : '#E5E7E9'} size={60}/>
              )
        }
    }
};

export default LandingScreen;