import React, { useState } from "react";
import { Tooltip, Popover, Typography, Box } from '@mui/material';
import Link from "@docusaurus/Link";

const popupStyle = {
  fontSize: "14px",
  padding: "10px",
  maxWidth: "300px",
};

const textStyle = {
  fontWeight: "bold",
  cursor: "pointer",
};

export default function Term(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    if (props.displayType === "popover") {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const displayType = props.displayType || "tooltip";

  if (displayType === "popover") {
    return (
      <>
        <Link to={props.reference}>
          <span 
            style={textStyle} 
            onClick={handleClick}
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
          >
            {props.children}
          </span>
        </Link>
        <Popover
          id="mouse-over-popover"
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={popupStyle}>
            <Typography>{props.popup}</Typography>
          </Box>
        </Popover>
      </>
    );
  } else {
    return (
      <Tooltip 
        title={<span style={popupStyle}>{props.popup}</span>}
        arrow={true}
      >
        <Link to={props.reference}>
          <span style={textStyle}>{props.children}</span>
        </Link>
      </Tooltip>
    );
  }
}