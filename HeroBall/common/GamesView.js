import React from 'react';
import { TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator, Alert, Text, View } from 'react-native';
import ViewHeader from './ViewHeader'
import GamesList from './GamesList'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBasketballBall, faAngleRight, faAngleLeft, faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons'
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

Date.prototype.subDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
}

class GamesView extends React.Component {

   constructor(props) {
     super(props)
     this.state = {
        loading: false,
        hasReturns: false,
        gamesCursor: {},
        date: new Date(),
        isDateTimePickerVisible: false,
     }
   }

   subscription = null

   componentDidMount() {
     subscription = this.props.navigation.addListener('willFocus', this.loadGames);
   }
 
   componentWillUnmount() {
     subscription.remove()
   }
 
    /* 
        TODO load our GamesFilter from storage!
    */

   loadGames = () => {

    this.setState({
      loading: true,
    })

    /* lets do a query and pass the results to GamesList - if any */
    return doRPC('https://api.heroball.app/v1/get/games',
        {
          Filter: {
            CompetitionIds: [1],
            PlayerIds: [4],
            Date: {
              Day: this.state.date.getDate(),
              Month: this.state.date.getMonth() + 1,
              Year: this.state.date.getFullYear(),
            }
          },
          Offset: 0,
          Count: 15,
        })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
            loading:false,
        })
        if (response.Games.length == 0) {
            /* nil returns, bail out */
            this.setState({
                hasReturns: false,
            })
            return
        }
        /* TODO lets not redraw everything on a refresh - inspect what already is visible to avoid jumpy reloads */
        this.setState({
          gamesCursor: response,
          hasReturns: true,
        })
      })
      .catch((error) => {
        this.setState({
            loading: false,
            hasReturns: false,
          })
        console.log(error)
        Alert.alert("Error loading games.");
      });
  }

  setGamesDate = (newDate) => {
    this.setState((previousState) => {
      return {date: newDate};
    }, () => {
      this.loadGames();
    });
  }

  incrementDay = () => {
    this.setGamesDate(this.state.date.addDays(1));
  }

  decrementDay = () => {
    this.setGamesDate(this.state.date.subDays(1));
  }

  incrementWeek = () => {
    this.setGamesDate(this.state.date.addDays(7));
  }

  decrementWeek = () => {
    this.setGamesDate(this.state.date.subDays(7));
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = newDate => {
    /* to avoid race condition */
    this.setGamesDate(newDate);
    this.hideDateTimePicker();
  };

  render() {
    return (
      <View style={{flex:1}}>
        <ViewHeader name='HeroBall Games' showMenu={true}/>
            <View style={{paddingTop: 10, paddingBottom: 10, flexDirection: 'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={this.decrementWeek} style={{paddingRight: 20}}>
                <FontAwesomeIcon icon={ faAngleDoubleLeft } color={'grey'} size={20}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.decrementDay} style={{paddingLeft: 30, paddingRight: 30}}>
                <FontAwesomeIcon icon={ faAngleLeft } color={'grey'} size={20}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.showDateTimePicker}>
                <Text style={{textAlign: 'center'}}>{moment(this.state.date).format("ddd D MMM YYYY")}</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                date={this.state.date}
              />
              <TouchableOpacity style={{paddingLeft: 30, paddingRight: 30}} onPress={this.incrementDay}>
                <FontAwesomeIcon icon={ faAngleRight } color={'grey'} size={20}/>
              </TouchableOpacity>
              <TouchableOpacity style={{paddingLeft: 20}} onPress={this.incrementWeek}>
                <FontAwesomeIcon icon={ faAngleDoubleRight } color={'grey'} size={20}/>
              </TouchableOpacity>        
            </View>
            {this.state.loading === true && 
              <ActivityIndicator size='large' style={{marginTop: 20, marginBottom: 20}}/>
            }            
            {this.state.hasReturns === false && this.state.loading === false && 
                <Text style={{textAlign: 'center', paddingTop: 10}}>No games found - change your game filter or date.</Text>
            }
            {this.state.hasReturns === true && 
            <ScrollView 
            refreshControl={
                <RefreshControl
                  refreshing={this.state.loading}
                  onRefresh={this.loadGames}
                />
              }>
             <GamesList
                hideHeader={true}
                minGames={15}
                gamesCursor={this.state.gamesCursor}
                showTotal={false} />
                </ScrollView>
            }
      </View>
    );
  }
}

GamesView.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: true,
        tabBarIcon: ({ focused, tintColor }) => {
              return (
                  <FontAwesomeIcon icon={ faBasketballBall } color={focused ? tintColor : '#E5E7E9'} size={45}/>
              )
        }
    }
};

export default GamesView;
