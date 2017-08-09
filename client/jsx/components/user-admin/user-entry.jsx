import * as React from 'react';
import GenericAdminEntry from './generic-admin-entry';

export default class UserEntry extends GenericAdminEntry{

  render(){

    let { email, first_name, last_name } = this.props.user || {}

    var adminEntryProps = {
      'className': 'admin-edit-entry-group',
      'onMouseEnter': this['showControlGroup'].bind(this),
      'onMouseLeave': this['hideControlGroup'].bind(this)
    };

    var emailEntryProps = {
      'className': 'admin-entry-input',
      'value': email,
      'title': email
    };

    var firstNameEntryProps = {
      'className': 'admin-entry-input',
      'value': first_name,
      'title': first_name
    };

    var lastNameEntryProps = {
      'className': 'admin-entry-input',
      'value': last_name,
      'title': last_name
    };

    if(!this['state']['editActive']){

      emailEntryProps['className'] = 'admin-entry-input-inactive';
      emailEntryProps['disabled'] = true;

      firstNameEntryProps['className'] = 'admin-entry-input-inactive';
      firstNameEntryProps['disabled'] = true;

      lastNameEntryProps['className'] = 'admin-entry-input-inactive';
      lastNameEntryProps['disabled'] = true;
    }

    return (

      <tr { ...adminEntryProps }>

        <td>

          <input { ...emailEntryProps } />
        </td>
        <td>

          <input { ...firstNameEntryProps } />
        </td>
        <td>

          <input { ...lastNameEntryProps } />
        </td>
        <td>
  
          { this.renderEditControlGroup() }
        </td>
      </tr>
    );
  }
}
