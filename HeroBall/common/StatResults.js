import React from 'react';
import { Alert, ScrollView, ActivityIndicator, Text, View } from 'react-native';
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import PlayerStatsResultLines from './PlayerStatsResultLines'
import { withNavigation } from 'react-navigation';
import { Button } from 'react-native-elements';

class StatResults extends React.Component {

    /* takes 2 navigation params, againstMd and forMd, to do a RPC and load the results */

  constructor(props) {
    super(props)
    this.state = {
        loading: false,
        results: [],
        startingRank: 1,
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
    this.setState({
        startingRank: this.state.startingRank + this.entriesPerPage
    })
    this.loadStatResults()
  }

  pageStatsBackward = () => {
    this.setState({
        startingRank: this.state.startingRank - this.entriesPerPage
    })
    this.loadStatResults()
  }

  loadStatResults = () => {

    this.setState({
        loading: true
    })

    const againstMd = this.props.navigation.getParam('againstMd', false);
    const forMd = this.props.navigation.getParam('forMd', false);
    const ordering = this.props.navigation.getParam('ordering', false);

    console.log(againstMd)

    if (againstMd === false || forMd === false || ordering === false) {
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
        'Count': this.entriesPerPage,
        'Offset': this.state.startingRank - 1,
        'MinimumGames': 0,
        'Ordering': ordering
    })
    .then((response) => response.json())
    .then((response) => {
        /* now we need to parse them and place into state */
        this.setState({
            results: response.AggregateStats,
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
        <ViewHeader name='Stat Search Results' showBack={true} />
        {this.state.loading === true && 
          <ActivityIndicator style={{marginTop: 50}}/>
        }
        {this.state.results.length == 0 && this.state.loading !== true && 
            <Text style={{textAlign: "center", fontSize: 20, marginTop: 50}}>No results found.</Text>
        }
        { this.state.loading === false && this.state.results.length > 0 && 
         <ScrollView>
          <PlayerStatsResultLines
            startingRank={this.state.startingRank}
            players={this.state.results}
            />
            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 1}}>
                    {this.state.startingRank > 1 && 
                        <Button 
                            buttonStyle={{backgroundColor: colorScheme.primary, marginRight: 5, marginLeft: 10}} 
                            onPress={this.pageStatsBackward} 
                            title={'<<  Backward'}
                            />
                    }
                </View>
                <View style={{flex: 1}}>
                    <Button buttonStyle={{backgroundColor: colorScheme.primary, marginRight: 10, marginLeft: 5}} onPress={this.pageStatsForward} title={'Forward  >>'}/>
                </View>
            </View>
        </ScrollView>
        }
      </View>
    );
  }
}

export default withNavigation(StatResults);