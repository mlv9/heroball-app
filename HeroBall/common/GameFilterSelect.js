import React from 'react';
import { Alert, Text, View } from 'react-native'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import colorScheme from './Colors'
import { Button } from 'react-native-elements';

class GameFilterSelect extends React.Component {

    /* props
        - onFilterPersistentChange (optional) = callbac taking boolean indicate if there is a filter or not
    */

    constructor(props) {
        super(props)
        this.state = {
          gamesFilterValues: [],
          gamesFilter: {},
          selectedItems: [],
        }
      }

    loadFilterFromStorage = async () => {
        filters = await readFilterFromStorage()
        selections = []

        /* now we need to store them in selectedItems to match the key format */
        for (var i in filters.Competitions) {
            selections.push("Competition_" + filters.Competitions[i])
        }

        for (var i in filters.Teams) {
            selections.push("Team_" + filters.Teams[i])
        }        

        for (var i in filters.Players) {
            selections.push("Player_" + filters.Players[i])
        }

        this.props.onFilterPersistentChange(selections.length > 0)
        this.setState({
            selectedItems: selections
        })
    }

    async componentDidMount() {
        /* get the values from storage */
        this.loadFilterFromStorage()
    }

    saveMetadataInState = (metadata) => {
        
        items = serialiseMetadataToSelectItems(metadata)

        this.setState({
            gamesFilterValues: [items.Competitions, items.Teams, items.Players],
        })

        return;
    }

    selectedItemsChanged = (selections) => {
        this.setState({
            selectedItems: selections
        })
    }

    saveFilter = () => {

        selections = this.state.selectedItems

        md = deserialiseSelectItemsToMetadata(selections)

        /* store in storage */
        this.storeFilterInStorage(md.Competitions, md.Teams, md.Players)
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
        this.props.onFilterPersistentChange(this.state.selectedItems.length > 0)
        if (open === true) {
            getMetadata({"Competitions": true, "Teams": true, "Players": true}, this.saveMetadataInState);
            this.loadFilterFromStorage()
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

GameFilterSelect.defaultProps = {
    onFilterPersistentChange: function(){}
  };

export default GameFilterSelect;

