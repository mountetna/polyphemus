import * as React from 'react';

import TitleBar  from './nav/title-bar'
import MenuBar from '../containers/menu-bar'
import UserEdit from '../containers/user-edit'
import ProjectEdit from '../containers/project-edit'
import PermissionEdit from '../containers/permission-edit'

export default class UserAdminView extends React.Component{

  constructor(){
    super()
  }

  render(){
    return (
      <div id='admin-group'>
        <div id='header-group'>
          <TitleBar />
          <MenuBar />
        </div>
        <div className='logo-group'>

          <img src='/img/logo_basic.png' alt='' />
        </div>
        <div id='left-column-group'>
        </div>
        <UserEdit />
        <ProjectEdit />
        <PermissionEdit />
      </div>
    );
  }
}
