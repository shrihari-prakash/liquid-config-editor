import React, { useEffect, useState } from "react";
import Option from "./Option";
import AppBar from "@mui/material/AppBar";
import { TextField } from "@mui/material";

const matches = (searchString, option) => {
  const fields = [option.name, option.description];
  return !fields.some((field) =>
    field.toLowerCase().includes(searchString.toLowerCase())
  );
};

export default function BackendConfig() {
  const [originalOptions, setOriginalOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/shrihari-prakash/liquid/main/src/service/configuration/options.json"
    )
      .then((response) => response.json())
      .then((options) => {
        console.log(options);
        setOptions(options);
        setOriginalOptions(options);
      });
  }, []);

  return (
    <>
      {options.map((option) => {
        if (search && search !== "" && matches(search, option)) {
          return null;
        }
        return <Option option={option} key={option.name} />;
      })}
      <AppBar
        position="fixed"
        sx={{ top: "auto", bottom: 0, p: "15px" }}
        color="inherit"
        enableColorOnDark
      >
        <TextField
          hiddenLabel
          id="filled-hidden-label-small"
          variant="outlined"
          placeholder="Search"
          size="small"
          onChange={(e) => {
            setSearch(
              e.target.value && e.target.value !== "" ? e.target.value : null
            );
          }}
        />
      </AppBar>
    </>
  );
}
