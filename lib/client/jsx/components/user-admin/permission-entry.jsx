import * as React from 'react';
import GenericAdminEntry from './generic-admin-entry';
import ProjectSearchDropdown from './project-search-dropdown';
import RoleDropdown from './role-dropdown';

export default class PermissionEntry extends GenericAdminEntry {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      revisedPermission: {}
    }
    /* if (permission.projectId == null) {
      this.setState({
        editShow: true,
        editActive: true
      });
    } */
  }

  checkForPrimary() {
    var perm = this.props.permission;
    if (perm.role == 'administrator'
      && perm.projectName == "administration") {
      alert('You cannot edit the primary permission.');
      return false;
    }
    return true;
  }

  activateEntryEdit() {
    if (!this.checkForPrimary()) return;
    this.setState({
      editActive: true,
      revisedPermission: { ...this.props.permission }
    });
  }

  deactivateEntryEdit() {
    this.setState({ editActive: false, revisedPermission: {} });
  }

  resetEntry() {
    this.setState({ revisedPermission: { ... this.props.permission } });
    //this.forceUpdate();
  }

  deleteEntry() {
    let { permission } = this.props;
    if (!this.checkForPrimary()) return;
    if (this.props.permission.id == undefined) {
      var reactKey = this.props.permission.reactKey;
      this.props.removeUnsavedPermission(reactKey);
    }
    else {
      this.props.removePermission(this.props.permission);
    }
  }

  saveEntry() {
    if (!this.checkForPrimary()) return;
    /*
     * These are only simple validations to keep the UI tidy. There are more 
     * stringent validations higher up in the UI and definately on the server.
     */
    let { user_email, project_name, role } = this.state.revisedPermission

    if (!this.validateUser(user_email)) {
      alert('Please select a valid user.');
      return;
    }

    if (!this.validateProject(project_name)) {
      alert('Please select a valid project.');
      return;
    }

    if (!this.validateRole(role)) {
      alert('Please select a permission');
      return;
    }

    let permission = { user_email, role, project_name }

    this.props.savePermission(permission);
  }

  emailSelected(user_email) {
    this.updatePermission('user_email', user_email)
  }

  updatePermission(name, value) {
    let revisedPermission = {
      ...this.state.revisedPermission,
      [name]: value
    }
    this.setState({ revisedPermission })
  }

  validateUser(email) {
    if (!VALIDATE_EMAIL(email)) return null;
    return Object.values(this.props.users).find(
      (user) => user.email.toLowerCase() == email
    )
  }

  validateProject(projectName) {
    return this.props.projects.hasOwnProperty(projectName)
  }

  validateRole(role) {
    return role
  }

  render() {
    let { permission, projects } = this.props
    let { revisedPermission, editActive } = this.state
    let { user_email, project_name, role } = editActive ? revisedPermission : permission

    if (user_email == 'john.engelhardt@bms.com') {
      console.log(`Using ${user_email} ${project_name} ${role}`)
    }

    var adminEntryProps = {
      className: 'admin-edit-entry-group',
      onMouseEnter: this.showControlGroup.bind(this),
      onMouseLeave: this.hideControlGroup.bind(this)
    };

    var userEmailEntryProps = {
      className: editActive ? 'admin-entry-input' : 'admin-entry-input-inactive',
      disabled: !editActive,
      value: user_email,
      onChange: (e) => this.updatePermission('user_email', e.target.value),
      ref: (input)=>{ this.userEmailInput = input }
    };

    var projectDropdownProps = {
      value: project_name,
      entries: Object.values(projects).map(p=>p.project_name),
      editActive,
      onChange: this.updatePermission.bind(this,'project_name')
    };

    var roleDropdownProps = {
      value: role,
      entries: [ 'administrator', 'editor', 'viewer' ],
      editActive,
      onChange: this.updatePermission.bind(this,'role')
    };

    return (
      <tr { ...adminEntryProps }>
        <td>
          <input { ...userEmailEntryProps } />
        </td>
        <td>
          <ProjectSearchDropdown { ...projectDropdownProps } />
        </td>
        <td>
          <RoleDropdown { ...roleDropdownProps } />
        </td>
        <td>
          { this.renderEditControlGroup() }
        </td>
      </tr>
    );
  }
}
