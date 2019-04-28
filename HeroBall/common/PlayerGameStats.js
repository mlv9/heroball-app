import React from 'react';
import { TouchableOpacity, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

class PlayerGameStats extends React.Component {
    /* 
        options:
        stats = array of PlayerGameStats
    */

  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <View>
          <FlatList
            data={this.props.stats}
            keyExtractor = {(item, index) => item.StatsId.toString()} 
            renderItem={({index, item }) =>
            (
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('Players', {playerId: item.Player.PlayerId}) }}>
                <ListItem 
                  title={item.Player.Name} 
                  subTitle={item.Player.Position}  />
               </TouchableOpacity> 
            )}
          />
      </View>
    );
  }
}

export default withNavigation(PlayerGameStats);