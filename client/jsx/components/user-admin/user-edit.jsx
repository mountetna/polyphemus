import * as React from 'react';
import UserEntry from './user-entry';

export default class UserEdit extends React.Component{

  constructor(){

    super();
  }

  render(){

    let { users } = this.props;

    return (
      <div className='admin-edit-grouping'>
        <table id='user-edit-group'>
          <thead>
            <tr className='admin-edit-head-group'>
              <th id='user-email-column' className='admin-edit-title'>
                { 'email ' }
                <div className='admin-column-head-arrow-group'>
                  <span className='glyphicon glyphicon-triangle-bottom'></span>
                </div>
              </th>

              <th id='first-name-column' className='admin-edit-title'>
                { 'first ' }
                <div className='admin-column-head-arrow-group'>
                  <span className='glyphicon glyphicon-triangle-bottom'></span>
                </div>
              </th>

              <th id='last-name-column' className='admin-edit-title'>
                { 'last ' }
                <div className='admin-column-head-arrow-group'>
                  
                  <span className='glyphicon glyphicon-triangle-bottom'></span>
                </div>
              </th>

              <th id='user-control-column' className='admin-edit-title'>
                <button className='admin-add-btn'>
                  <span className='glyphicon glyphicon-plus white-glyphicon'></span>
                  { 'ADD USER' }
                </button>

                <button className='admin-add-btn' onClick={ this['props'].logoutAll }>
                  <span className='glyphicon glyphicon-lock white-glyphicon'></span>
                  { 'LOGOUT ALL' }
                </button>
              </th>
            </tr>
          </thead>
          <tbody id='user-edit-body-group'>
            { Object.values(users).map((user, index)=>{
              return <UserEntry user={ user } key={ 'user-entry-'+ index }/>
            }) }
          </tbody>
        </table>
      </div>
    );
  }
}
