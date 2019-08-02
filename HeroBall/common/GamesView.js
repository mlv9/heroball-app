import React from 'react';
import { Alert, Text, View } from 'react-native';
import ViewHeader from './ViewHeader'
import GamesList from './GamesList'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBasketballBall  } from '@fortawesome/free-solid-svg-icons'
import { faSlidersH  } from '@fortawesome/free-solid-svg-icons'

class GamesView extends React.Component {

   constructor(props) {
     super(props)
     this.state = {
        loading: false,
        hasReturns: false,
        gamesCursor: {},
     }
   }

   subscription = null

   componentDidMount() {
     subscription = this.props.navigation.addListener('willFocus', this.loadGames);
   }
 
   componentWillUnmount() {
     subscription.remove()
   }
 
    /* 
        TODO load our GamesFilter from storage 
    */

   loadedGamesFilter = {
        CompetitionIds: [1],
        PlayerIds: [4],
    }

   loadGames = () => {

    this.setState({
      loading: true,
    })

    /* lets do a query and pass the results to GamesList - if any */
    return doRPC('https://api.heroball.app/v1/get/games',
        {
          Filter: this.loadedGamesFilter,
          Offset: 0,
          Count: 15,
        })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
            loading:false,
        })
        if (response.Games.length == 0) {
            /* nil returns, bail out */
            this.setState({
                hasReturns: false,
            })
            return
        }
        this.setState({
          gamesCursor: response,
          hasReturns: true,
        })
      })
      .catch((error) => {
        this.setState({
            loading: false,
            hasReturns: false,
          })
        console.log(error)
        Alert.alert("Error loading games.");
      });
  }

  render() {
    return (
      <View style={{flex:1}}>
        <ViewHeader name='Games' showMenu={true}/>
            {this.state.hasReturns === false && 
                <Text>No games found - change filter or date.</Text>
            }
            {this.state.hasReturns === true && 
             <GamesList
                hideHeader={true}
                minGames={15}
                gamesCursor={this.state.gamesCursor}
                showTotal={false} />
            }
      </View>
    );
  }
}

GamesView.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: true,
        tabBarIcon: ({ focused, tintColor }) => {
              return (
                  <FontAwesomeIcon icon={ faBasketballBall } color={focused ? tintColor : '#E5E7E9'} size={45}/>
              )
        }
    }
};

export default GamesView;
