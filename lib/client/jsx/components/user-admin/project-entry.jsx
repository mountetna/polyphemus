import * as React from 'react';
import GenericAdminEntry from './generic-admin-entry';

export default class ProjectEntry extends GenericAdminEntry{
  render(){
    let { project_name, group_name } = this.props.project

    var adminEntryProps = {
      className: 'admin-edit-entry-group',
      onMouseEnter: this.showControlGroup.bind(this),
      onMouseLeave: this.hideControlGroup.bind(this)
    };

    var projectNameProps = {
      className: 'admin-entry-input',
      value: project_name,
      title: project_name,
      ...!this.state.editActive && { disabled: true, className: 'admin-entry-input-inactive' }
    };

    var groupNameProps = {
      className: 'admin-entry-input',
      value: group_name,
      title: group_name,
      ...!this.state.editActive && { disabled: true, className: 'admin-entry-input-inactive' }
    }

    return (
      <tr { ...adminEntryProps }>
        <td>
          <input { ...projectNameProps } />
        </td>

        <td>
          <input { ...groupNameProps } />
        </td>

        <td>
          { this.renderEditControlGroup() }
        </td>
      </tr>
    );
  }
}
