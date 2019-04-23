import React from 'react';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import colorScheme from './Colors.js';

class ViewHeader extends React.Component {

  render() {
      return (
        <Header
          containerStyle={{ backgroundColor: colorScheme.primary, height: 100}}
          centerComponent={{ text: this.props.name, style: { fontSize: 17, color: 'white' } }}
        /> )
      }
}

export default withNavigation(ViewHeader);
