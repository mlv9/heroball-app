import React from 'react';
import { Text, View } from 'react-native';
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import Icon from 'react-native-vector-icons/FontAwesome';

class LandingScreen extends React.Component {

  subscription = null

  constructor(props) {
    super(props)

    this.state = {
    }

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
        <ViewHeader name='Landing Page' />
        {this.state.gameInfo !== undefined && 
          <Text>{this.state.gameInfo.Game.Location.Name}</Text>}
      </View>
    );
  }
}

LandingScreen.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: true,
        tabBarIcon: ({ focused, tintColor }) => {
              return (
                  <Icon type="MaterialIcons" name='user' color={focused ? tintColor : '#bdbec2'} size={30}/>
              )
        }
    }
};

export default LandingScreen;