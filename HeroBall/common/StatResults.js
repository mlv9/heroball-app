import React from 'react';
import { Alter, Image, ScrollView, ActivityIndicator, Text, View } from 'react-native';
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import Progress from 'react-native-progress/Circle';
import GamesList from './GamesList'
import PlayerStatsResultLines from './PlayerStatsResultLines'
import { withNavigation } from 'react-navigation';

class StatResults extends React.Component {

    /* takes 2 navigation params, againstMd and forMd, to do a RPC and load the results */

  constructor(props) {
    super(props)
    this.state = {
        loading: false,
        results: [],
    }
  }

  subscription = null

  componentDidMount() {
    subscription = this.props.navigation.addListener('willFocus', this.loadStatResults);
  }

  componentWillUnmount() {
    subscription.remove()
  }

  loadStatResults = () => {

    this.setState({
        loading: true
    })

    const againstMd = this.props.navigation.getParam('againstMd', false);
    const forMd = this.props.navigation.getParam('forMd', false);

    console.log(againstMd)

    if (againstMd === false || forMd === false) {
        this.setState({loading: false})
        Alert.alert("Error getting query parameters")
    }

    /* now do the RPC */
    doRPC('https://api.heroball.app/v1/get/stats', 
    {
        'For': {
            'CompetitionIds': forMd.Competitions,
            'TeamIds': forMd.Teams,
            'PlayerIds': forMd.Players,
        },
        'Against': {
            'CompetitionIds': againstMd.Competitions,
            'TeamIds': againstMd.Teams,
        },
        'Count': 10,
        'Offset': 0,
        'MinimumGames': 0
    })
    .then((response) => response.json())
    .then((response) => {
        /* now we need to parse them and place into state */
        console.log(response)
        this.setState({
            results: response.AggregateStats,
            loading: false,
        })
    })
    .catch((error) => {
        console.log(error)
        Alert.alert("Error loading stats.");
        this.setState({
            loading: false,
        })
    });
  }

  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
        <ViewHeader name='Stat Search Results' showBack={true} />
        {this.state.loading === true && 
          <ActivityIndicator style={{marginTop: 50}}/>
        }
        {this.state.results.length == 0 && 
            <Text style={{textAlign: "center", fontSize: 20, marginTop: 50}}>No results found.</Text>
        
        }
        { this.state.loading === false && this.state.results.length > 0 && 
         <ScrollView>
          <PlayerStatsResultLines
            players={this.state.results}
            />
        </ScrollView>
        }
      </View>
    );
  }
}

export default withNavigation(StatResults);