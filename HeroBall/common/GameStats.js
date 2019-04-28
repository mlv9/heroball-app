import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

export default class GameStats extends React.Component {
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
              <ListItem 
                title={item.Player.Name} 
                subTitle={item.Player.Position}  />
            )}
          />
      </View>
    );
  }
}
