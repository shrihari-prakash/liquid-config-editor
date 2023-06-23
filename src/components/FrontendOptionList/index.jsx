import {
  AppBar,
  Box,
  Button,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import FrontendOption from '../FrontendOption';
import { download, fileToText, matches } from '../BackendOptionList';

export default function FrontendOptionList() {
  const [loading, setLoading] = useState();
  const [originalOptions, setOriginalOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState();
  const searchRef = useRef();

  const importOptions = (e) => {
    setSearch();
    const file = e.target.files.item(0);
    fileToText(file, (text) => {
      const opts = JSON.parse(text);
      setOptions(opts);
      setLoading(true);
      setTimeout(() => setLoading(false), 100);
    });
  };

  const exportOptions = () => {
    const appConfig = {};
    options.forEach((option, index) => {
      if (originalOptions[index].default != option.default) {
        appConfig[option.name] = option.default;
      }
    });
    download('app-config.json', JSON.stringify(appConfig, null, '\t'));
  };

  const doSearch = (value) => {
    searchRef.current.querySelector('input').value = value;
    setSearch(value);
  };

  useEffect(() => {
    setLoading(true);
    fetch(
      'https://raw.githubusercontent.com/shrihari-prakash/liquid/main/src/public/configuration/options.json'
    )
      .then((response) => response.json())
      .then((options) => {
        setOptions(options);
        setOriginalOptions(JSON.parse(JSON.stringify(options)));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ width: '100%', position: 'absolute', top: '0', left: '0' }}>
        <LinearProgress />
      </Box>
    );
  }
  return (
    <div style={{ paddingTop: '70px' }}>
      <Typography
        variant='h5'
        component='div'
        color='text.secondary'
        sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}
      >
        <img
          src='https://github.com/shrihari-prakash/liquid/raw/main/src/public/images/app-icon-mini.png'
          style={{ height: '1em' }}
        ></img>
        Liquid Option Manager
      </Typography>
      <Typography color='text.secondary' sx={{ pl: '15px' }}>
        Frontend options.
      </Typography>
      {options.map((option, index) => {
        if (search && search !== '' && matches(search, option)) {
          return null;
        }
        return (
          <FrontendOption
            option={option}
            index={index}
            originalOptions={originalOptions}
            setOptions={setOptions}
            key={option.name}
            search={search}
            doSearch={doSearch}
          />
        );
      })}
      <AppBar
        position='fixed'
        sx={{ top: 0, p: '15px', flexDirection: 'row' }}
        color='inherit'
        enableColorOnDark
      >
        <TextField
          hiddenLabel
          id='filled-hidden-label-small'
          variant='outlined'
          placeholder='Search'
          size='small'
          sx={{ flex: 1, mr: '15px' }}
          ref={searchRef}
          onChange={(e) => {
            setSearch(
              e.target.value && e.target.value !== '' ? e.target.value : null
            );
          }}
        />
        <Button variant='outlined' component='label' sx={{ mr: '15px' }}>
          Import
          <input
            hidden
            accept='*'
            onChange={importOptions}
            multiple
            type='file'
          />
        </Button>
        <Button variant='contained' onClick={exportOptions}>
          Export
        </Button>
      </AppBar>
    </div>
  );
}
