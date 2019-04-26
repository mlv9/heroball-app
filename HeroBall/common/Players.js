import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser  } from '@fortawesome/free-solid-svg-icons'
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';

class Players extends React.Component {

  subscription = null

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    subscription = this.props.navigation.addListener('willFocus', this.loadGame);
  }

  componentWillUnmount() {
    subscription.remove()
  }

  loadGame = () => {
    return doRPC('https://api.heroball.app/v1/get/game/info',
        {
          GameId: parseInt("1"),
        })
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.setState({
          gameInfo: response,
        })
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("Error loading game.");
      });
  }

  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
        <ViewHeader name='Players' />
        {this.state.gameInfo !== undefined && 
          <Text>{this.state.gameInfo.Game.Location.Name}</Text>}
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