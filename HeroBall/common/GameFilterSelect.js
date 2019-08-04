import React from 'react';
import { Alert, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUsers  } from '@fortawesome/free-solid-svg-icons'
import { ListItem } from 'react-native-elements';
import moment from 'moment';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import colorScheme from './Colors'
import { withNavigation } from 'react-navigation';
import { Button } from 'react-native-elements';

class GameFilterSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          gamesFilterValues: [],
          gamesFilter: {},
          selectedItems: [],
        }
      }

    storeGamesFilterValues = (filterObject) => {
        items = {
                'Competitions': {
                    name: 'Competitions',
                    id: 0,
                    children: [],
                },
                'Teams': {
                    name: 'Teams',
                    id: 1,
                    children: [],
                },
                'Players': {
                    name: 'Players',
                    id: 2,
                    children: [],
                }
            }

        for (var i in filterObject.Competitions) {
            items.Competitions.children.push({
                name: printCompName(filterObject.Competitions[i]),
                id: 'Competition_' + filterObject.Competitions[i].CompetitionId,
            })
        }

        for (var i in filterObject.Teams) {
            items.Teams.children.push({
                name: filterObject.Teams[i].Name,
                id: 'Team_' + filterObject.Teams[i].TeamId,
            })
        }

        for (var i in filterObject.Players) {
            items.Players.children.push({
                name: filterObject.Players[i].Name,
                id: 'Player_' + filterObject.Players[i].PlayerId,
            })
        }

        this.setState({
            gamesFilterValues: [items.Competitions, items.Teams, items.Players],
        })

        return;
    }

    /* we need to load the values */
    updateGamesFilterValues = () => {
        doRPC('https://api.heroball.app/v1/get/metadata',{"Competitions": true, "Teams": true, "Players": true})
            .then((response) => response.json())
            .then((response) => {
                /* now we need to parse them and place into state */
                this.storeGamesFilterValues(response)
            })
            .catch((error) => {
                console.log(error)
                Alert.alert("Error loading games filter values.");
            });
    }


    selectedItemsChanged = (selections) => {
        this.setState({
            selectedItems: selections
        })
    }

    saveFilter = () => {

        selections = this.state.selectedItems

        competitions = []
        teams = []
        players = []

        /* we need to pull the original values out of the saved gamesFilterValues */
        for (var i in selections) {
            /* we split on the _ */
            var fields = selections[i].split('_')
            if (fields[0] === 'Competition') {
                competitions.push(fields[1])
            }
            if (fields[0] === 'Team') {
                teams.push(fields[1])
            }
            if (fields[0] === 'Player') {
                players.push(fields[1])
            }                        
        }

        /* store in storage */
        this.storeFilterInStorage(competitions, teams, players)
    }
    
    storeFilterInStorage = async (competitions, teams, players) => {
        await storeFilterInStorage(competitions, teams, players)
    }

    toggleSelect = ()  => {
        if (this.select !== undefined) {
            this.select._toggleSelector()
        }
    }
    
    modalToggled = (open) => {
        if (open === true) {
            this.updateGamesFilterValues();
        }
    }

    render() {
        return (
            <SectionedMultiSelect
              items={this.state.gamesFilterValues}
              uniqueKey="id"
              subKey="children"
              colors={{
                primary: colorScheme.primary
              }}
              selectText={"Select Filter"}
              showDropDowns={true}
              hideSelect={true}
              ref={(ref) => this.select = ref}
              confirmText={"Save Filter"}
              noItemsComponent={
                    <Text style={{textAlign: 'center'}}>No filter information available</Text>
                  }
              searchPlaceholderText={"Search"}
              styles={{
                container: {
                  flex:1,
                  borderRadius:15,
                  paddingBottom: 20,
                },
                button: {
                  marginRight: 35,
                  marginLeft: 35,
                  borderRadius: 15
                }
              }}
              noResultsComponent={(
                <Text style={{textAlign: 'center'}}>No matching teams, players or competitions</Text>
              )}
              readOnlyHeadings={true}
              modalWithTouchable={true}
              modalWithSafeAreaView={true}
              onSelectedItemsChange={this.selectedItemsChanged}
              onConfirm={this.saveFilter}
              showChips={false}
              onToggleSelector={this.modalToggled}
              selectedItems={this.state.selectedItems}
              headerComponent={this.state.selectedItems.length === 0 ?
                (<View style={{paddingTop: 10, paddingBottom: 10}}>
                    <Text size={24} style={{textAlign: 'center'}}>You currently have no filter selected and will view all games.  Choose a filter below to only view a subset.</Text>
                </View>) : (<View></View>)
              }
              stickyFooterComponent={
                <View>

                  <Button
                    buttonStyle={{
                      marginTop: 10,
                      backgroundColor: colorScheme.primary,
                      marginRight: 35,
                      marginLeft: 35,
                      borderRadius: 15
                    }}
                    onPress={() => this.select._removeAllItems()}
                    title='Clear Selections'/>
                  <Button
                    buttonStyle={{
                      marginTop: 10,
                      backgroundColor: colorScheme.primary,
                      marginRight: 35,
                      marginLeft: 35,
                      borderRadius: 15
                    }}
                    onPress={() => this.select._toggleSelector()}
                    title='Close'/>                    
                </View>
                }
              />
        );
    }
}

export default GameFilterSelect;

