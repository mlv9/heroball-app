import React from 'react';
import { ActivityIndicator, StyleSheet, Image, Alert, Text, View, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import moment from 'moment';
import GamesList from './GamesList';
import Progress from 'react-native-progress/Circle';
import CompetitionLadder from './CompetitionLadder';

class CompetitionsView extends React.Component {

  subscription = null

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    subscription = this.props.navigation.addListener('willFocus', this.loadPlayer);
  }

  componentWillUnmount() {
    subscription.remove()
  }

  loadPlayer = () => {

    competitionIdToLoad = this.props.navigation.getParam("competitionId", 0)

    console.log("loading competition " + competitionIdToLoad)

    /* for development, lets just show something */
    if (competitionIdToLoad == 0) {
      competitionIdToLoad = 1
    }

    if (this.state.compInfo !== undefined && competitionIdToLoad == this.state.compInfo.Competition.CompetitionId) {
      return;
    }

    /* else set blank */
    this.setState({
      compInfo: undefined
    })

    return doRPC('https://api.heroball.app/v1/get/competition/info',
        {
          CompetitionId: competitionIdToLoad
        })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          compInfo: response,
        })
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("Error loading competition.");
      });
  }

  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
        <ViewHeader name='Competitions' />
        {this.state.compInfo === undefined && 
          <ActivityIndicator style={{marginTop: 50}} size={'large'}/>        
        }
        {this.state.compInfo !== undefined &&
          <ScrollView>
            <Image style={{height:150}}
              source={{uri: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAh8AAADICAYAAABI+YNvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2MjkyZjFmNi04NzYxLTRiNDMtYTg5OS0zMmQ3NjE5ZDkxMTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENCNUE0MEM0RUE3MTFFOUFEQUVFREY1MUQwRTkxQjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENCNUE0MEI0RUE3MTFFOUFEQUVFREY1MUQwRTkxQjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MjkyZjFmNi04NzYxLTRiNDMtYTg5OS0zMmQ3NjE5ZDkxMTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjI5MmYxZjYtODc2MS00YjQzLWE4OTktMzJkNzYxOWQ5MTEw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`}}
              indicator={Progress.Circle}
            />
            <Text>{this.state.compInfo.Competition.League.Name + ' ' + this.state.compInfo.Competition.League.Division}</Text>
            <Text>{this.state.compInfo.Competition.Name}</Text>
            <Text>Played a total of {this.state.compInfo.RecentGames.Total} games from {moment(this.state.compInfo.FirstGameTime).format("ddd D MMM YYYY")} to {moment(this.state.compInfo.LastGameTime).format("ddd D MMM YYYY")}
            </Text>
            <Text style={styles.heading}>STANDINGS</Text>
            <CompetitionLadder teams={this.state.compInfo.Teams} />
            <GamesList
              gamesCursor={this.state.compInfo.RecentGames} 
              showTotal={true}/>
          </ScrollView>
          }
      </View>
    );
  }
}

CompetitionsView.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: true,
        tabBarIcon: ({ focused, tintColor }) => {
              return (
                  <FontAwesomeIcon icon={ faTrophy } color={focused ? tintColor : '#E5E7E9'} size={45}/>
              )
        }
    }
};

export default CompetitionsView;

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})