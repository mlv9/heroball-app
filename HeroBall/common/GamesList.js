import React from 'react';
import { ActivityIndicator, TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import GameResult from './GameResult';
import { ListItem } from 'react-native-elements';
import colorScheme from './Colors';
import { withNavigation } from 'react-navigation';

class GamesList extends React.Component {

  /* takes a pb.GamesCursor */
  // hideHeader = boolean = hides the Games header
  // minGames = number of games to load initially (if cursor empty)
  // gamesCursor = the cursor itself (*pb.GamesCursor)
  // showTotal = whether we should include a total trailer

  constructor(props) {
    super(props)
    this.state = {
      appending: false,
      gamesCursor: this.props.gamesCursor
    }
    this.onEndReachedCalledDuringMomentum = true;

    if (this.props.minGames !== undefined) {
      /* do we need to load any more? */
      if (this.props.gamesCursor.Games.length < this.props.minGames) {
        this.loadMoreGames(this.props.minGames - this.props.gamesCursor.Games.length)
      }
    }
  }
  
  loadMoreGames = (count) => {

    count = count || 15

    /* we want to do the callback */
    return doRPC('https://api.heroball.app/v1/get/games',
        {
          Filter: this.state.gamesCursor.Filter,
          Offset: this.state.gamesCursor.Games.length,
          Count: count,
        })
      .then((response) => response.json())
      .then((response) => {
        response.Games = this.state.gamesCursor.Games.concat(response.Games)
        this.setState({
          gamesCursor: response,
        })
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("Error loading games.");
      });
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.props.hideHeader !== true &&
        <Text style={styles.heading}>GAMES</Text> }
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
                <GameResult game={item} />
              </TouchableOpacity>
            )}
          />
          { this.props.showTotal && this.state.gamesCursor.Games.length < this.state.gamesCursor.Total &&
          <TouchableOpacity onPress={() => {this.props.navigation.navigate("Games", {GamesCursor: this.state.gamesCursor})}}>
            <ListItem
              chevron
              badge={{
                value: this.state.gamesCursor.Total || 0,
                badgeStyle: {
                  backgroundColor: 'grey',
                  paddingRight: 3,
                  paddingLeft: 3,
                }
              }}
              containerStyle={{
                borderWidth: 1,
              }}
              title='View All Games'
            />
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