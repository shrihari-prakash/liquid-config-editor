import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Highlighter from 'react-highlight-words';
import Chip from '@mui/material/Chip';

const debounce = (func) => {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, 500);
  };
};

export default function FrontendOption({
  option,
  index,
  setOptions,
  search,
  originalOptions,
}) {
  const [mounted, setMounted] = useState(true);

  const onClear = () => {
    setOptions((options) => {
      const newOptions = { ...options };
      newOptions[index] = originalOptions[index];
      return newOptions;
    });
    setMounted(false);
    setTimeout(() => setMounted(true), 0);
  };

  const onChange = (e) =>
    setOptions((options) => {
      const newOptions = [...options];
      let value = e.target.value;
      if (!isNaN(value)) {
        value = parseInt(value);
      }
      if (value === 'true' || value === 'false') {
        value = value === 'true' ? true : false;
      }
      newOptions[index].default = value;
      return newOptions;
    });

  const optimizedOnChange = useCallback(debounce(onChange), []);

  const getHighlightned = (key) => (
    <Highlighter
      highlightClassName='YourHighlightClass'
      searchWords={search ? search.split(' ') : []}
      autoEscape={true}
      textToHighlight={option[key]}
    />
  );

  return (
    <Box
      sx={{
        display: 'flex',
        '& > :not(style)': {
          m: 1,
          width: '100%',
          padding: 1,
        },
      }}
    >
      <Card variant='outlined'>
        <CardContent>
          <Typography
            sx={{
              height: '24px',
              display: 'flex',
              alignItems: 'center',
            }}
            color='text.secondary'
          >
            {getHighlightned('name')}
            {originalOptions[index].default != option.default && (
              <Chip
                label='Modified'
                size='small'
                color='primary'
                sx={{ ml: '8px' }}
                onDelete={onClear}
              />
            )}
          </Typography>
          <Typography variant='h6' component='div'>
            {getHighlightned('displayName')}
          </Typography>
          <Typography sx={{ mb: 1, fontSize: 14 }} color='text.secondary'>
            {option.type}
          </Typography>
          <Typography sx={{ mb: 1}} variant='body2'>
            {getHighlightned('description')}
          </Typography>
          {mounted ? (
            <TextField
              label='Value'
              variant='outlined'
              fullWidth
              defaultValue={option.default}
              size='small'
              onChange={optimizedOnChange}
              InputProps={{
                startAdornment:
                  typeof option.default === 'string' &&
                  option.default.startsWith('#') ? (
                    <div
                      style={{
                        height: '18px',
                        width: '18px',
                        borderRadius: '100%',
                        margin: '0 4px',
                        backgroundColor: option.default,
                      }}
                    ></div>
                  ) : null,
              }}
            ></TextField>
          ) : (
            <span>
              <TextField
                variant='outlined'
                size='small'
                label='Value'
                fullWidth
              />
            </span>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
