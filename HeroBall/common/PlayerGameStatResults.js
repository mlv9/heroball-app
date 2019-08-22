import React from 'react';
import { Alert, ScrollView, ActivityIndicator, Text, View } from 'react-native';
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import PlayersStatLine from './PlayersStatLine'
import { withNavigation } from 'react-navigation';
import { Button } from 'react-native-elements';

class PlayerGameStatResults extends React.Component {

    /* takes two navigation params:
        playerId  = int = the player who's games we want to see
        againstRequest = pb.AgainstStatsRequest = filter for games to which we want to see  - empty is no filter*/

  constructor(props) {
    super(props)
    this.state = {
        loading: false,
        playerStats: [],
        offset: 1,
        playerGames: [],
    }
  }

  subscription = null

  entriesPerPage = 25

  componentDidMount() {
    subscription = this.props.navigation.addListener('willFocus', this.loadStatResults);
  }

  componentWillUnmount() {
    subscription.remove()
  }

  pageStatsForward = () => {
    /* make sync */
    this.setState((previousState) => {
        return {offset: this.state.offset + this.entriesPerPage};
      }, () => {
        this.loadStatResults()
      });
  }

  pageStatsBackward = () => {
    /* make sync */
    this.setState((previousState) => {
        return {offset: this.state.offset - this.entriesPerPage};
      }, () => {
        this.loadStatResults()
      });
  }

  loadStatResults = () => {

    this.setState({
        loading: true
    })

    const againstMd = this.props.navigation.getParam('againstMd', false);
    const playerId = this.props.navigation.getParam('playerId', false);

    if (againstMd === false || playerId === undefined) {
        this.setState({loading: false})
        Alert.alert("Error getting query parameters")
    }

    /* now do the RPC */
    doRPC('https://api.heroball.app/v1/get/stats/player/games', 
    {
        'PlayerId': playerId,
        'Against': {
            'CompetitionIds': againstMd.Competitions,
            'TeamIds': againstMd.Teams,
        },
        'Count': this.entriesPerPage,
        'Offset': this.state.offset - 1,
    })
    .then((response) => response.json())
    .then((response) => {
        /* now we need to parse them and place into state */
        console.log(response)
        this.setState({
            playerGames: response.Games,
            playerStats: response.Stats,
            loading: false,
        })
    })
    .catch((error) => {
        console.log(error)
        Alert.alert("Error loading stats.");
        this.setState({
            loading: false
        })
    });
  }

  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
        <ViewHeader name='Games' showBack={true} />
        {this.state.loading === true && 
          <ActivityIndicator style={{marginTop: 50}} size={'large'}/>
        }
        {this.state.playerGames.length == 0 && this.state.loading !== true && 
            <Text style={{textAlign: "center", fontSize: 20, marginTop: 50}}>No games found.</Text>
        }
        { this.state.loading === false && this.state.playerGames.length > 0 && this.state.playerStats.length > 0 && 
         <ScrollView>
          <PlayersStatLine
            rowHeader={'games'}
            players={this.state.playerStats}
            games={this.state.playerGames}
            />
            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 1}}>
                    {this.state.offset > 1 && 
                        <Button 
                            buttonStyle={{backgroundColor: colorScheme.primary, marginRight: 5, marginLeft: 10, borderRadius: 15}} 
                            onPress={this.pageStatsBackward} 
                            title={'<<  Backward'}
                            />
                    }
                </View>
                <View style={{flex: 1}}>
                    {this.entriesPerPage === this.state.playerGames.length &&
                       <Button buttonStyle={{backgroundColor: colorScheme.primary, marginRight: 10, marginLeft: 5, borderRadius: 15}} onPress={this.pageStatsForward} title={'Forward  >>'}/>
                    }
                </View>
            </View>
        </ScrollView>
        }
      </View>
    );
  }
}

export default withNavigation(PlayerGameStatResults);