import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUsers  } from '@fortawesome/free-solid-svg-icons'
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

class GameResult extends React.Component {

    gameTitle = (game) => {

        if (game.Result.HomeTeamPoints > game.Result.AwayTeamPoints) {
            /* hometeam wins */
            return game.HomeTeam.Name + ' (' + game.Result.HomeTeamPoints + ') defeat (' + game.Result.AwayTeamPoints + ') ' + game.AwayTeam.Name
        } else if (game.Result.HomeTeamPoints < game.Result.AwayTeamPoints) {
            /* away team wins */
            return game.HomeTeam.Name + ' (' + game.Result.HomeTeamPoints + ') defeated by (' + game.Result.AwayTeamPoints + ') ' + game.AwayTeam.Name
        }

        /* drawn */
        return game.HomeTeam.Name + ' (' + game.Result.HomeTeamPoints + ') drawn (' + game.Result.AwayTeamPoints + ') ' + game.AwayTeam.Name
    }

    gameSubtitle = (game) => {
        return new Date(game.GameTime).toLocaleDateString() + ' @ ' + game.Location.Name
    }

    render() {
        return (
            <View>
                <ListItem
                    containerStyle={{
                        borderWidth: 1,
                    }}
                    contentContainerStyle={{
                        alignItems: 'center'
                    }}
                    leftIcon={<FontAwesomeIcon icon={ faUsers } size={30}/>}
                    rightIcon={<FontAwesomeIcon icon={ faUsers } size={30}/>}
                    title={this.gameTitle(this.props.game)}
                    subtitle={this.gameSubtitle(this.props.game)}
                    subtitleStyle={{
                        color: 'grey'
                    }}
                />
            </View>
        );
    }
}

export default GameResult;

