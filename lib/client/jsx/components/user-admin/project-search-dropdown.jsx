import * as React from 'react';
import GenericSearchDropdown from '../generic/generic-search-dropdown';

export default class ProjectSearchDropdown extends GenericSearchDropdown {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      searchEnabled: true
    }
  }

  render() {
    let { value, entries } = this.props
    
    var dropdownGroupProps = {
      className: 'search-dropdown-group'
    };

    var dropdownInputProps = {
      className: this.setInputClass(),
      disabled: this.setInputDisabled(),
      value,
      onChange: this.updateInputValue.bind(this),
      onKeyUp: this.selectByKeyboard.bind(this),
      ref: (component)=>{ this.dropdownInput = component }
    };

    var dropdownBtnProps = {
      className: 'search-dropdown-btn',
      onClick: this.toggleDropdown.bind(this),
      style: this.setButtonStyle()
    };

    if (!this.props.editActive)
      entries = null
    else if (value.length < 2) 
      entries = [ 'type to search...' ]
    else {
      // We do a simple string pattern match for entries
      entries = entries.filter(entry => entry.indexOf(value) != -1)
      // If there are no matching entries then add a blank entry that says so.
      if (entries.length == 0) entries.push('no matching entries...')
    }

    return <div { ...dropdownGroupProps }>
        <input { ...dropdownInputProps } />

        <button { ...dropdownBtnProps } >
          <span className='glyphicon glyphicon-triangle-bottom'></span>
        </button>
        { this.renderEntries(entries) }
      </div>
  }
}
