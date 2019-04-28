import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import GameResult from './GameResult'
import GameStats from './GameStats'
import { withNavigation } from 'react-navigation';
import colorScheme from './Colors'

class GameModal extends React.Component {
    /* 
        options:
        gameId = int32 = gameId of game to show
    */

   subscription = null

   componentDidMount() {
     subscription = this.props.navigation.addListener('willFocus', this.showModal);
     this.loadGame()
   }
 
   componentWillUnmount() {
     subscription.remove()
   }
 
   constructor(props) {
     super(props)
     this.state = {
       modalVisible: false,
     }
   }
 
   showModal = () => {
     this.setState({
       modalVisible: true
     })
   }
 
   hideModal = () => {
     this.setState({
       modalVisible: false
     })
     this.props.navigation.goBack(null);
   }

  loadGame = () => {

    gameId = this.props.navigation.getParam("gameId", 0)

    if (this.state.gameInfo !== undefined && game == this.state.gameInfo.Game.GameId) {
      return;
    }

    this.state.gameInfo = undefined

    return doRPC('https://api.heroball.app/v1/get/game/info',
        {
          GameId: gameId,
        })
      .then((response) => response.json())
      .then((response) => {
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
      <Modal
        isVisible={this.state.modalVisible}
        onBackdropPress={this.hideModal}
        animationOutTiming={100}
        animationInTiming={100}
        >
        {this.state.gameInfo === undefined && (
          <ActivityIndicator />
        )}
          {this.state.gameInfo !== undefined && 
            <View style={styles.modalContent}>
              <GameResult game={this.state.gameInfo.Game} />
              <ScrollView>
                <Text style={styles.heading}>{this.state.gameInfo.Game.HomeTeam.Name}</Text>
                <GameStats stats={this.state.gameInfo.PlayerStats.filter(player => player.Team.TeamId == this.state.gameInfo.Game.HomeTeam.TeamId)} />
                <Text style={styles.heading}>{this.state.gameInfo.Game.AwayTeam.Name}</Text>
                <GameStats stats={this.state.gameInfo.PlayerStats.filter(player => player.Team.TeamId == this.state.gameInfo.Game.AwayTeam.TeamId)} />
              </ScrollView>
            </View>
          }
      </Modal>
    );
  }
}

export default withNavigation(GameModal);

const styles = StyleSheet.create({
  modalContent: {
    marginTop: 100,
    marginBottom: 150,
    backgroundColor: "white",
  },
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})