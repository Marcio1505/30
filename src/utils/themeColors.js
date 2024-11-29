// Copy of src/assets/scss/core/variables/_variables.scss

// $white: #fff;
// $body-bg: #f8f8f8;
// $gray-100: #babfc7; // $gray-lightest
// $gray-200: #ededed; // $gray-lighter
// $gray-300: #dae1e7; // $gray-light
// $gray-400: #636363;
// $gray-500: #adb5bd;
// $gray-600: #b8c2cc; // $gray
// $gray-700: #4e5154;
// $gray-800: #1e1e1e; // $gray-dark
// $gray-900: #2a2e30;
// $black: #22292f;

// $blue: #00cfe8; //$info
// $red: #ea5455; //$danger
// $orange: #ff9f43; //$warning
// $green: #28c76f; //$success
// $cyan: #7367f0; //$primary

// // $primary: $cyan;
// $primary: #36BBA4;
// $iuli-light: #7CCBBF;
// $iuli-medim: #36BBA4;
// $iuli-dark: #238E7D;

// $info: $blue;
// $warning: $orange;

const colors = {
    primary: {
      main: '#36BBA4',
      light: '#36BBA444',
    },
    secondary: {
      main: '#7CCBBF',
      light: '#7CCBBF44',
    },
    success: {
      main: '#28C76F',
      light: '#28C76F44',
    },
    danger: {
      main: '#ea5455',
      light: '#ea545544',
    },
    warning: {
      main: '#ff9f43',
      light: '#ff9f4344',
    },
    info: {
      main: '#00cfe8',
      light: '#00cfe844',
    },
};

const trackBgColor = '#e9ecef';

const arrayThemeColors = [
    colors.primary.main, 
    colors.success.main, 
    colors.danger.main,
    colors.warning.main,
    colors.info.main,
];

export default {
    colors,
    arrayThemeColors,
    trackBgColor,
    success: colors.success.main,
    primary: colors.primary.main,
    danger: colors.danger.main,
    warning: colors.warning.main,
    info: colors.info.main,
    success_light: colors.success.light,
    primary_light: colors.primary.light,
    danger_light: colors.danger.light,
    warning_light: colors.warning.light,
    info_light: colors.info.light,
}