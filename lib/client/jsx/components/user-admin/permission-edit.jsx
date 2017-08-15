import * as React from 'react';
import PermissionEntry from './permission-entry';

export default class PermissionEdit extends React.Component {
  constructor() {
    super();
  }

  selectFile() {
    /*
     * We are using a button to surragate the file input so we may have 
     * a custom browse button.
     */
    document.getElementById('permission-file-selector').click();
  }

  fileSelected(event) {
    if(event === undefined) return;
    var fileSelector = event.target;
    var file = fileSelector.files[0];
    this.props.uploadPermissions(file);
  }

  render() {
    let { permissions, projects, users } = this.props

    var permFileSelector = {
      id: 'permission-file-selector',
      type: 'file',
      name: 'upload-file',
      onChange: this.fileSelected.bind(this)
    };

    var uploadPermBtnProps = {
      className: 'admin-add-btn',
      onClick: this.selectFile.bind(this)
    };

    var dwnldPermBtnProps = {
      className: 'admin-add-btn',
      onClick: this.props.downloadPermissions.bind(this)
    };

    var addPermBtnProps = {
      className: 'admin-add-btn',
      onClick: this.props.addPermission.bind(this)
    };

    var callbacks = {
      removeUnsavedPermission: this.props.removeUnsavedPermission,
      savePermission: this.props.savePermission,
      removePermission: this.props.removePermission
    };
    
    return (
      <div className='admin-edit-grouping'>
        <table id='permission-edit-group'>
          <thead>
            <tr className='admin-edit-head-group'>
              <th id='permission-user-column' className='admin-edit-title'>
                { 'user email ' }
                <div className='admin-column-head-arrow-group'>
                  <span className="glyphicon glyphicon-triangle-bottom"></span>
                </div>
              </th>

              <th id='permission-project-column' className='admin-edit-title'>
                { 'project ' }
                <div className='admin-column-head-arrow-group'>
                  <span className="glyphicon glyphicon-triangle-bottom"></span>
                </div>
              </th>
              <th id='permission-column' className='admin-edit-title'>
                { 'permission ' }
                <div className='admin-column-head-arrow-group'>
                  <span className="glyphicon glyphicon-triangle-bottom"></span>
                </div>
              </th>
              <th id='permission-control-column' className='admin-edit-title'>
                <button { ...addPermBtnProps }>
                  <span className='glyphicon glyphicon-plus white-glyphicon'></span>
                  { ' ADD PERM' }
                </button>
                <button { ...dwnldPermBtnProps }>
                  { 'DOWN' }
                </button>
                <button { ...uploadPermBtnProps }>
                  <input { ...permFileSelector } />
                  { 'UP' }
                </button>
              </th>
            </tr>
          </thead>
          <tbody id='permission-edit-body-group'>
            {
              Object.values(permissions).map(
                (project) => Object.values(project).map(
                  (permission, index) => {
                    var permEntryProps = {
                      permission,
                      projects,
                      users,
                      ...callbacks,
                      key: permission.key
                    };
                    return <PermissionEntry { ...permEntryProps } />
                  }
                )
              ).reduce((a,b) => a.concat(b), [])
            }
          </tbody>
        </table>
      </div>
    );
  }
}
