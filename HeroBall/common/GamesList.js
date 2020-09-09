import React from 'react';
import { Alert, ActivityIndicator, TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import GameResult from './GameResult';
import { Badge, ListItem } from 'react-native-elements';
import colorScheme from './Colors';
import { withNavigation } from 'react-navigation';

class GamesList extends React.Component {

  /* takes a pb.GamesCursor */
  // hideHeader = boolean = hides the Games header
  // minGames = number of games to load initially (if cursor empty)
  // gamesCursor = the cursor itself (*pb.GamesCursor)
  // showTotal = whether we should include a total trailer
  // title = optional title for list, defaults to RECENT GAMES

  constructor(props) {
    super(props)
    this.state = {
      appending: false,
      loading: false,
      gamesCursor: this.props.gamesCursor //TODO this is an anti-pattern and means I need componentDidUpdate to watch for changes
    }
    this.onEndReachedCalledDuringMomentum = true;
  }

    componentDidUpdate(prevProps) {
        /* TODO maybe find a better way */
        if (JSON.stringify(prevProps.gamesCursor) !== JSON.stringify(this.props.gamesCursor)) {
            /* we need to re-render */
            this.setState({
              gamesCursor: this.props.gamesCursor
            })
        }
    }

  subscription = null

  componentDidMount() {
    subscription = this.props.navigation.addListener('willFocus', this.showGames);
  }

  componentWillUnmount() {
    subscription.remove()
  }

  showGames = () => {
    if (this.state.gamesCursor === undefined) {
      /* we have an error */
      Alert.alert("Error loading games: cursor undefined.");
      return;
    } 
    
    /* ensure it is a list */
    if (this.state.gamesCursor.Games === undefined ) {
      this.state.gamesCursor.Games = []
    }

    if (this.state.gamesCursor.Games.length < 1) {
      /* lets try and load */
      this.loadMoreGames()
      return;
    }
    if (this.props.minGames !== undefined) {
      /* do we need to load any more? */
      if (this.state.gamesCursor.Games.length < this.props.minGames) {
        this.loadMoreGames(this.props.minGames - this.state.gamesCursor.Games.length)
      }
    } else {
      console.log('not loading games ' + this.props.minGames + ' ' + this.state.gamesCursor.Games.length)
    }
  }
  
  loadMoreGames = (count) => {

    this.setState({
      loading: true,
    })

    count = count || 15

    /* if nothing loaded, set offset 0 */
    if (this.state.gamesCursor.Games !== undefined) {
      offset = this.state.gamesCursor.Games.length
    } else {
      offset = 0
    }

    /* we want to do the callback for more games */
    return doRPC('v1/get/games',
        {
          Filter: this.state.gamesCursor.Filter,
          Offset: offset,
          Count: count,
        })
      .then((response) => response.json())
      .then((response) => {
        response.Games = this.state.gamesCursor.Games.concat(response.Games)
        this.setState({
          gamesCursor: response,
          loading: false,
        })
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("Error loading games.");
        this.setState({
          loading: false,
        })
      });
  }

  render() {
    if (this.state.gamesCursor === undefined) {
      return (<View style={{flex:1}}></View>)
    }
    return (
      <View style={{flex:1}}>
        {this.props.hideHeader !== true &&
        <Text style={styles.heading}>{this.props.title !== undefined ? this.props.title : 'RECENT GAMES'}</Text> }
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            onEndReachedThreshold={0.05}
            onMomentumScrollBegin={() => { 
              this.onEndReachedCalledDuringMomentum = false; 
            }}
            onEndReached={(distance) => {
              if (this.props.showTotal === true) {
                return;
              }
              if(!this.onEndReachedCalledDuringMomentum){
                this.setState({
                  appending: true
                })
                this.loadMoreGames().then(() => {
                  this.setState({
                    appending: false
                  })
                });
                this.onEndReachedCalledDuringMomentum = true;
              }
            }}
            data={this.state.gamesCursor.Games}
            keyExtractor = {(item, index) => item.GameId.toString()} 
            renderItem={({index, item }) =>
            (
              <TouchableOpacity onPress={ () => { this.props.navigation.navigate('GameBoxScore', {gameId: item.GameId}) }}>
                <GameResult game={item} key={item.GameId.toString()}/>
              </TouchableOpacity>
            )}
          />
          { this.props.showTotal && this.state.gamesCursor.Games.length < this.state.gamesCursor.Total &&
          <TouchableOpacity onPress={() => {this.props.navigation.navigate("GamesPopOver", {GamesCursor: this.state.gamesCursor})}}>
            <ListItem
              containerStyle={{
                borderWidth: 1,
              }}>
              <Badge
                value={this.state.gamesCursor.Total || 0}
                containerStyle={{
                  backgroundColor: 'grey',
                  paddingRight: 3,
                  paddingLeft: 3,
                }}/>
              <ListItem.Content>
                <ListItem.Title>View All Games</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            </TouchableOpacity>}
            {  this.state.appending &&
              <ActivityIndicator style={{flex: 1, paddingTop: 30, paddingBottom: 30}} size='large'/> 
            }
      </View>
    );
  }
}

export default withNavigation(GamesList);

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})