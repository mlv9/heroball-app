import React from 'react';
import { Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUsers  } from '@fortawesome/free-solid-svg-icons'
import { ListItem } from 'react-native-elements';
import moment from 'moment';

class GameResult extends React.Component {

    gameSubtitle = (game) => {
        return moment(new Date(game.GameTime)).format("ddd D MMM YYYY") + ' @ ' + game.Location.Name
    }

    render() {
        return (
            <View style={{flex: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'lightgrey', backgroundColor: 'white'}}>
                <View style={{height: 16, flexDirection: 'row', justifyContent:'center', marginTop: 5}}>
                    <Text style={{color: 'grey', fontSize: 14}}>{printCompName(this.props.game.Competition)}</Text>
                </View>
                <View style={{height:60, flexDirection: 'row', justifyContent:'center'}}>
                    <View style={{flex:1, alignItems:'center'}}>
                        <FontAwesomeIcon icon={ faUsers } color={'black'} size={40}/>
                        <Text style={{fontSize: 20}}>{this.props.game.HomeTeam.Name}</Text>
                    </View>
                    <View style={{flex:1, alignItems:'center'}}>
                        <Text style={{fontSize: 40}}>{this.props.game.Result.HomeTeamPoints}</Text>
                    </View>
                    <View style={{flex:1, alignItems:'center'}}>
                        <Text style={{fontSize: 40}}>{this.props.game.Result.AwayTeamPoints}</Text>
                    </View>                    
                    <View style={{flex:1, alignItems:'center'}}>
                        <FontAwesomeIcon icon={ faUsers } color={'black'} size={40}/>
                        <Text style={{fontSize: 20}}>{this.props.game.AwayTeam.Name}</Text>
                    </View>
                </View>
                <View style={{height: 16, flexDirection: 'row', justifyContent:'center', marginBottom: 5}}>
                    <Text style={{color: 'grey', fontSize: 14}}>{this.gameSubtitle(this.props.game)}</Text>
                </View>
            </View>
        );
    }
}

export default GameResult;

