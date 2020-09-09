import React from 'react';
import { TouchableOpacity, FlatList, Text } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';


class CompetitionLadder extends React.Component {

  render() {
    return (
        <FlatList
        data={this.props.teams}
        keyExtractor = {(item, index) => item.Team.TeamId.toString()} 
        renderItem={({index, item }) =>
        (
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Teams', {teamId: item.Team.TeamId}) }}>
            <ListItem
              containerStyle={{
                borderWidth: 1,
              }}>
              <Avatar>{<Text>{(index+1) + '.'}</Text>}</Avatar>
              <ListItem.Content>
                <ListItem.Title>
                  {item.Team.Name}
                </ListItem.Title>
              </ListItem.Content>
              {<Text>{item.Won + ' - ' + item.Lost + ' - ' + item.Drawn}</Text>}
            </ListItem>
          </TouchableOpacity>
        )} />
    );
  }
}


export default withNavigation(CompetitionLadder);
