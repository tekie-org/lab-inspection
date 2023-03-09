const colourStyles = {
  singleValue: (styles: any) => {
    return {
      ...styles,
      fontFamily: 'Inter-Medium',
    };
  },
  option: (styles: any) => {
    return {
      ...styles,
      zIndex: 9999,
      fontFamily: 'Inter-Medium',
    };
  },
  menuPortal: (styles: any) => {
    return {
      ...styles,
      zIndex: 9999,
    };
  },
  menu: (styles: any) => {
    return {
      ...styles,
      zIndex: 9999,
    };
  },
};

export default colourStyles;
