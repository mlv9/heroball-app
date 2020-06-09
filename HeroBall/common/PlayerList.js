import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import colorScheme from './Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { withNavigation } from 'react-navigation';

  /* takes a pb.PlayersCursor */
  // hideHeader = boolean = hides the Players header
  // minPlayers = min number of players to load initially TODO (if cursor empty)
  // playersCursor = the cursor itself (*pb.PlayersCursor)
  // showTotal = whether we should include a total trailer

class PlayerList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          appending: false,
          gamesCursor: this.props.gamesCursor
        }
        this.onEndReachedCalledDuringMomentum = true;
    
        if (this.props.minPlayers !== undefined) {
          /* do we need to load any more? */
          if (this.props.playersCursor.Players.length < this.props.minPlayers) {
            this.loadMorePlayers(this.props.minPlayers - this.props.gamesCursor.Games.length)
          }
        }
      }

      loadMorePlayers = (count) => {

        count = count || 15
    
        /* we want to do the callback */
        return doRPC('v1/get/players',
            {
              Filter: this.state.playersCursor.Filter,
              Offset: this.state.playersCursor.Players.length,
              Count: count,
            })
          .then((response) => response.json())
          .then((response) => {
            response.Players = this.state.playersCursor.Players.concat(response.Players)
            this.setState({
                playersCursor: response,
            })
          })
          .catch((error) => {
            console.log(error)
            Alert.alert("Error loading players.");
          });
      }
  
  render() {
    return (
      <View>
          {this.props.playersCursor !== undefined &&
            <View>
            {this.props.hideHeader !== true &&
            <Text style={styles.heading}>PLAYERS</Text> }
                <FlatList
                data={this.props.playersCursor.Players}
                keyExtractor = {(item, index) => item.PlayerId.toString()} 
                renderItem={({index, item }) =>
                (
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('PlayerProfile', {playerId: item.PlayerId}) }}>
                        <ListItem
                        chevron
                        containerStyle={{
                            borderWidth: 1,
                        }}
                        title={item.Name}
                        subtitle={item.Position.charAt(0).toUpperCase() + item.Position.slice(1)}
                        leftIcon={<FontAwesomeIcon icon={ faUser } size={30}/>}
                        />
                    </TouchableOpacity>
                )}
                />
                { this.props.showTotal && this.props.playersCursor.Players.length < this.props.playersCursor.Players.length &&
                    <ListItem
                    chevron
                    badge={{
                        value: this.props.playersCursor.Players.length || 0,
                        badgeStyle: {
                        backgroundColor: 'grey',
                        paddingRight: 3,
                        paddingLeft: 3,
                        }
                    }}
                    containerStyle={{
                        borderWidth: 1,
                    }}
                    title='View All Players'
                    />}
            </View>}
      </View>
    );
  }
}

export default withNavigation(PlayerList);

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})