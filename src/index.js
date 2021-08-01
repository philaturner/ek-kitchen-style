import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { SelectField, Option } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import axios from "axios";

export const App = ({sdk}) => {
  const [value, setValue] = useState(sdk.field.getValue() || '');
  const [fieldOptions, setFieldOptions] = useState([]);

  const onExternalChange = value => {
    setValue(value);
  }

  const onChange = e => {
    const value = e.currentTarget.value;
    setValue(value);
    if (value) {
      sdk.field.setValue(value);
    } else {
      sdk.field.removeValue();
    }
  }

  useEffect(() => {
    const API_ENDPOINT = sdk.parameters.installation.apiEndpoint;
    const headers = {
      'Content-Type': 'application/json',
    }
    axios.get(API_ENDPOINT, headers).then(response => {
      setFieldOptions(response.data[0]);
    });
  }, [])

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, []);

  useEffect(() => {
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    const detatchValueChangeHandler = sdk.field.onValueChanged(onExternalChange);
    return detatchValueChangeHandler;
  });

  return (
    <SelectField
        id={"kitchen-style"}
        name={"kitchen-style"}
        selectProps="large"
        onChange={onChange}
        helpText="Add the associated Kitchen Style with this item"
    >
      {fieldOptions.map(item =>
          <Option selected={item.value == value} key={item.value} value={item.value}>{item.label}</Option>
      )}
    </SelectField>
  );
}

App.propTypes = {
  sdk: PropTypes.object.isRequired
};

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
