import React from 'react';
import { TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator, Alert, Text, View } from 'react-native';
import ViewHeader from './ViewHeader'
import GamesList from './GamesList'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBasketballBall, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

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
        PlayerIds: [4]
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
        /* TODO lets not redraw everything on a refresh - inspect what already is visible to avoid jumpy reloads */
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
            {this.state.loading === true && 
            <ActivityIndicator size='large' style={{marginTop: 20, marginBottom: 20}}/>
            }
            <View style={{paddingTop: 10, paddingBottom: 10, flexDirection: 'row', justifyContent:'center'}}>
              <TouchableOpacity style={{paddingRight: 30, paddingLeft: 30}}>
                <FontAwesomeIcon icon={ faChevronLeft } color={'grey'} size={18}/>
              </TouchableOpacity>
              <Text style={{textAlign: 'center'}}>21 Aug 2019</Text>
              <TouchableOpacity style={{paddingLeft: 30, paddingRight: 30}}>
                <FontAwesomeIcon icon={ faChevronRight } color={'grey'} size={18}/>
              </TouchableOpacity>
            </View>
            {this.state.hasReturns === false && this.state.loading === false && 
                <Text>No games found - change filter or date.</Text>
            }
            {this.state.hasReturns === true && 
            <ScrollView 
            refreshControl={
                <RefreshControl
                  refreshing={this.state.loading}
                  onRefresh={this.loadGames}
                />
              }>
             <GamesList
                hideHeader={true}
                minGames={15}
                gamesCursor={this.state.gamesCursor}
                showTotal={false} />
                </ScrollView>
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
