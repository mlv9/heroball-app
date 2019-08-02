import React from 'react';
import { View } from 'react-native';
import ViewHeader from './ViewHeader'
import GamesList from './GamesList'
import { withNavigation } from 'react-navigation';

class GamesPopOver extends React.Component {
    /* 
        options:
        gameCursor = pb.GamesCursor
    */

   constructor(props) {
     super(props)
     this.state = {
     }
   }
 

  render() {
    const gamesCursor = this.props.navigation.getParam("GamesCursor", undefined)
    return (
      <View style={{flex:1}}>
        <ViewHeader name='Listing Games' showBack={true}/>
             <GamesList
                hideHeader={true}
                minGames={15}
                gamesCursor={gamesCursor}
                showTotal={false} />
      </View>
    );
  }
}

export default withNavigation(GamesPopOver);
