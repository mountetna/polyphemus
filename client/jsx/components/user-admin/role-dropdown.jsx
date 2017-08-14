import * as React from 'react';
import GenericSearchDropdown from '../generic/generic-search-dropdown';

export default class RoleDropdown extends GenericSearchDropdown{
  render() {
    // Return the input value to the parent.
    let { value } = this.props;

    var dropdownGroupProps = {
      className: 'search-dropdown-group',
      onClick: this.openDropdownFromClick.bind(this)
    };

    var dropdownInputProps = {
      className: this.setInputClass(),
      disabled: this.setInputDisabled(),
      value
    };

    var dropdownBtnProps = {
      className: 'search-dropdown-btn',
      onClick: this.toggleDropdown.bind(this),
      style: this.setButtonStyle()
    };

    let entries = this.props.editActive ? this.props.entries : null

    return (
      <div { ...dropdownGroupProps }>
        <input { ...dropdownInputProps } />
        <button { ...dropdownBtnProps } >
          <span className='glyphicon glyphicon-triangle-bottom'></span>
        </button>

        { this.renderEntries(entries) }
      </div>
    );
  }
}
