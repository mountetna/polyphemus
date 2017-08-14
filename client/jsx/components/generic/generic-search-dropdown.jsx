import * as React from 'react';

export default class GenericSearchDropdown extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      trayActive: false,
      searchEnabled: false,
      selectedIndex: null
    };
  }

  setInputClass() {
    var className = 'search-dropdown-input';
    if (this.props.editActive) {
      className = 'search-dropdown-input';

      if (this.state.trayActive) {
        className = 'search-dropdown-input search-dropdown-input-active';
      }
      else {
        className = 'search-dropdown-input';
      }
    }
    else {
      className = 'search-dropdown-input-inactive';
    }

    return className;
  }

  setInputDisabled() {
    return !this.props.editActive || !this.state.searchEnabled
  }

  setButtonStyle() {
    return { display: this.props.editActive ? 'block' : 'none' }
  }

  setDropdownStyle() {
    return {
      display: this.state.trayActive ? 'block' : 'none',
      zIndex: this.state.trayActive ? 10000 : 0
    };
  }

  entrySelectedByClick(event) {
    let inputValue = event.target.getAttribute('data-val');
    this.setState({ 
      trayActive: false,
      selectedIndex: null
    }, () => this.props.onChange(inputValue));

    if (this.dropdownInput == undefined) return;
    this.dropdownInput.focus();
  }

  entrySelectedByEnter(inputValue) {
    this.setState({ 
      trayActive: false,
      selectedIndex: null
    }, () => this.props.onChange(inputValue));

    if (this.dropdownInput == undefined) return;
    this.dropdownInput.focus();
  }

  toggleDropdown(event) {
    this.setState({ trayActive: !this.state.trayActive });
  }

  openDropdownFromClick(event) {
    if (!this.state.searchEnabled) {
      this.toggleDropdown(event);
    }
  }

  updateInputValue(event) {
    let inputValue = event.target.value;
    let state = {
      ...this.state.searchEnabled && { trayActive: inputValue.length >= 2 }
    }
    this.setState(state);
    this.props.onChange(inputValue);
  }

  selectByKeyboard(event) {
    if (this.dropdownTrayComponent == undefined) return;
    if (!this.state.trayActive) return;
    if (!this.state.selectedIndex == null) return;

    event = event || window.event;
    var range = this.dropdownTrayComponent.childNodes.length;
    var index = this.state.selectedIndex;

    // Navigate the dropdown list using the arrow keys.
    if (event.keyCode == 38 || event.keyCode == 40) {
      if (event.keyCode == 38) {
        if (index == 0 || index == null) {
          index = range - 1;
        }
        else {
          --index;
        }
      }

      if (event.keyCode == 40) {
        if (index == (range - 1) || index == null) {
          index = 0;
        }
        else {
          ++index;
        }
      }

      this.setState({ selectedIndex: index });
    }

    // Select the entry using the 'enter' key.
    if (event.keyCode == 13) {
      var node = this.dropdownTrayComponent.childNodes[index];
      var val = node.getAttribute('data-val');
      this.entrySelectedByEnter(val);
    }
  }

  renderEntry(entry, index, selected) {
    var entryProps = {
      className: selected ?  'search-dropdown-tray-entry-active' : 'search-dropdown-tray-entry',
      key: (entry +'-'+ index),
      'data-val': entry,
      onClick: this.entrySelectedByClick.bind(this)
    };

    return (
      <button { ...entryProps }> 
        { entry }
      </button>
    );
  }

  renderEntries(entries) {
    if (!entries || entries.length == 0) return null;

    var dropdownTrayProps = {
      className: 'search-dropdown-tray',
      style: this.setDropdownStyle()
    };

    // Generate a list of  entries to display in the dropdown.
    return <div { ...dropdownTrayProps }>
      {
        entries.map(
          (entry, index) => this.renderEntry(entry, index, index == this.state.selectedIndex)
        )
      }
    </div>
  }

  render() {
    return (<div/>)
  }
}
