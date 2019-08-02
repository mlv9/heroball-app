import React from 'react';
import { View, TouchableOpacity} from 'react-native';
import {  Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import colorScheme from './Colors.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSlidersH, faChevronLeft  } from '@fortawesome/free-solid-svg-icons'
import Menu, { MenuItem } from 'react-native-material-menu';


class ViewHeader extends React.Component {

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };


  render() {
      return (
        <Header
        leftComponent= {
          this.props.showBack ?
          (
            <TouchableOpacity style={{height: 30, justifyContent: 'flex-end', width:50, alignItems:'center'}} onPress={() => {this.props.navigation.goBack(null)}}>
              <FontAwesomeIcon icon={ faChevronLeft } color={'white'} size={20}/>
            </TouchableOpacity>
          )
          : <View style={{width:50}} /> }
          containerStyle={{ backgroundColor: colorScheme.primary, height: 100}}
          centerComponent={{ text: this.props.name, style: { fontSize: 17, color: 'white' } }}
          rightComponent={
            this.props.showMenu  ?
            (<Menu
                ref={this.setMenuRef}
                button={
                  <TouchableOpacity style={{height: 30, justifyContent: 'flex-end', width:50, alignItems: 'center'}} onPress={this.showMenu}>
                    <FontAwesomeIcon icon={ faSlidersH } style={{color:'white'}} name='bars' size={18}/>
                  </TouchableOpacity>
                }>
                <MenuItem onPress={this.setGameFilter}>Set Game Filter</MenuItem>
              </Menu>)
            : <View style={{width:50}} />
          }
        /> )
      }
}

export default withNavigation(ViewHeader);
