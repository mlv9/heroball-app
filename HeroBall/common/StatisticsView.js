import React from 'react';
import { ScrollView, Picker, Alert, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChalkboardTeacher  } from '@fortawesome/free-solid-svg-icons'
import ViewHeader from './ViewHeader';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import colorScheme from './Colors'
import { Button } from 'react-native-elements';

class StatisticsView extends React.Component {

  /* TODO: this.select2 does not allow filter items to be removed */

  constructor(props) {
    super(props)
    this.state = {
      ordering: 'PPG',
      selectedLimit: [],
      selectedAgainst: [],
      limitValues: [],
      againstValues: [],
    }
  }

  selectedLimitItemsChangedd = (selections) => {
    this.setState({
        selectedLimit: selections
    })
  }

  loadStats = () => {

    if (this.state.selectedAgainst.length === 0 && this.state.selectedLimit.length === 0) {
      Alert.alert("You must select at least one value")
      return
    }

    forMd = deserialiseSelectItemsToMetadata(this.state.selectedLimit)
    againstMd = deserialiseSelectItemsToMetadata(this.state.selectedAgainst)
    
    /* navigate to Stat Results */
    this.props.navigation.navigate('StatResults', {'forMd': forMd, 'againstMd': againstMd, 'ordering': this.state.ordering})
  }

  selectedAgainstItemsChangedd = (selections) => {
    this.setState({
      selectedAgainst: selections
    })
  }

  saveMetadataInState = (metadata) => {
        
    items = serialiseMetadataToSelectItems(metadata)

    this.setState({
      limitValues: [items.Competitions, items.Teams, items.Players],
      againstValues: [items.Competitions, items.Teams]
    })

    return;
  }

  /* we need to load the values */
  modalToggled = (open) => {
    if (open === true) {
        getMetadata({"Competitions": true, "Teams": true, "Players": true}, this.saveMetadataInState);
    }
  }

  clearSelects = () => {
    this.select._removeAllItems()
    this.select2._removeAllItems()
  }

  customChipsRenderer = (props) => {
    return (
      <View style={{marginLeft: 20, marginRight: 20}}>
        {props.selectedItems.map((singleSelectedItem) => {

          const item = this.select._findItem(singleSelectedItem)
          if (!item || !item[props.displayKey]) return null

          return (
            <View key={item[props.uniqueKey]} style={{borderRadius: 15, backgroundColor: colorScheme.primary, marginBottom: 2}}>
              <TouchableOpacity onPress={() => { this.select._removeItem(item) }}>
                  <Text style={{paddingTop: 2, paddingBottom: 2, fontSize: 20, textAlign: 'center', color: 'white'}}>{item.type + ': ' + item[props.displayKey]}</Text>
              </TouchableOpacity>
            </View>
            )
        })} 
      </View>
    )
  }

  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
      <ViewHeader name='Statistics' />
      <ScrollView>
        <SectionedMultiSelect
          items={this.state.limitValues}
          uniqueKey="id"
          subKey="children"
          colors={{
            primary: colorScheme.primary
          }}
          selectText={"Who's stats are you viewing?"}
          showDropDowns={true}
          hideSelect={false}
          onToggleSelector={this.modalToggled}
          ref={(ref) => this.select = ref}
          confirmText={"Finished"}
          noItemsComponent={
                <Text style={{textAlign: 'center'}}>No information loaded</Text>
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
          customChipsRenderer={this.customChipsRenderer}
          modalWithTouchable={true}
          modalWithSafeAreaView={true}
          onSelectedItemsChange={this.selectedLimitItemsChangedd}
          showChips={true}
          selectedItems={this.state.selectedLimit}
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
            </View>
            }
          />
        <SectionedMultiSelect
          items={this.state.againstValues}
          uniqueKey="id"
          subKey="children"
          colors={{
            primary: colorScheme.primary
          }}
          selectText={"Against?"}
          showDropDowns={true}
          hideSelect={false}
          onToggleSelector={this.modalToggled}
          ref={(ref) => this.select2 = ref}
          confirmText={"Finished"}
          noItemsComponent={
                <Text style={{textAlign: 'center'}}>No information loaded.</Text>
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
          customChipsRenderer={this.customChipsRenderer}
          modalWithTouchable={true}
          modalWithSafeAreaView={true}
          onSelectedItemsChange={this.selectedAgainstItemsChangedd}
          showChips={true}
          selectedItems={this.state.selectedAgainst}
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
                onPress={() => this.select2._removeAllItems()}
                title='Clear Selections'/>              
            </View>
            }
          />
        </ScrollView>
        <View>
          <Text style={{fontSize: 20}}>Select a stat to sort by</Text>
          <Picker
            selectedValue={this.state.ordering}
            onValueChange={(selection, itemIndex) =>
              this.setState({ordering: selection})
            }>
            <Picker.Item label={getStatFriendlyName("2PFG")} value="2PFG" />
            <Picker.Item label={getStatFriendlyName("3PFG")} value="3PFG" />
            <Picker.Item label={getStatFriendlyName("APG")} value="APG" />
            <Picker.Item label={getStatFriendlyName("PPG")} value="PPG" />
            <Picker.Item label={getStatFriendlyName("RPG")} value="RPG" />
            <Picker.Item label={getStatFriendlyName("SPG")} value="SPG" />
            <Picker.Item label={getStatFriendlyName("SPG")} value="SPG" />
            <Picker.Item label={getStatFriendlyName("MPG")} value="MPG" />
            <Picker.Item label={getStatFriendlyName("BPG")} value="BPG" />
            <Picker.Item label={getStatFriendlyName("MPG")} value="MPG" />
            <Picker.Item label={getStatFriendlyName("TPG")} value="TPG" />
            <Picker.Item label={getStatFriendlyName("FT")} value="FT" />
          </Picker>   
        </View>
        <View style={{paddingBottom: 10}}>
          <Button
            buttonStyle={{
              marginTop: 10,
              backgroundColor: colorScheme.primary,
              marginRight: 35,
              marginLeft: 35,
              borderRadius: 15,
            }}
            titleStyle={{
              fontWeight: '500'
            }}
            onPress={() => this.loadStats()}
            title='Search Statistics'/>
          <Button
            buttonStyle={{
              marginTop: 10,
              backgroundColor: colorScheme.primary,
              marginRight: 35,
              marginLeft: 35,
              borderRadius: 15
            }}
            onPress={this.clearSelects}
            title='Clear Selections'/> 
        </View>
      </View>
    );
  }
}

StatisticsView.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: true,
        tabBarIcon: ({ focused, tintColor }) => {
              return (
                  <FontAwesomeIcon icon={ faChalkboardTeacher } color={focused ? tintColor : '#E5E7E9'} size={45}/>
              )
        }
    }
};

export default StatisticsView;