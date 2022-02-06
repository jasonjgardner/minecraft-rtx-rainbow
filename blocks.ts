const blocks: Record<string, { enabled: boolean; color: string }> = {
  "red_50": { enabled: true, color: "#ffebee" },
  "red_100": { enabled: true, color: "#ffcdd2" },
  "red_200": { enabled: true, color: "#ef9a9a" },
  "red_300": { enabled: true, color: "#e57373" },
  "red_400": { enabled: true, color: "#ef5350" },
  "red_500": { enabled: true, color: "#f44336" },
  "red_600": { enabled: true, color: "#e53935" },
  "red_700": { enabled: true, color: "#d32f2f" },
  "red_800": { enabled: true, color: "#c62828" },
  "red_900": { enabled: true, color: "#b71c1c" },
  "red_a100": { enabled: true, color: "#ff8a80" },
  "red_a200": { enabled: true, color: "#ff5252" },
  "red_a400": { enabled: true, color: "#ff1744" },
  "red_a700": { enabled: true, color: "#d50000" },
  "pink_50": { enabled: true, color: "#fce4ec" },
  "pink_100": { enabled: true, color: "#f8bbd0" },
  "pink_200": { enabled: true, color: "#f48fb1" },
  "pink_300": { enabled: true, color: "#f06292" },
  "pink_400": { enabled: true, color: "#ec407a" },
  "pink_500": { enabled: true, color: "#e91e63" },
  "pink_600": { enabled: true, color: "#d81b60" },
  "pink_700": { enabled: true, color: "#c2185b" },
  "pink_800": { enabled: true, color: "#ad1457" },
  "pink_900": { enabled: true, color: "#880e4f" },
  "pink_a100": { enabled: true, color: "#ff80ab" },
  "pink_a200": { enabled: true, color: "#ff4081" },
  "pink_a400": { enabled: true, color: "#f50057" },
  "pink_a700": { enabled: true, color: "#c51162" },
  "purple_50": { enabled: true, color: "#f3e5f5" },
  "purple_100": { enabled: true, color: "#e1bee7" },
  "purple_200": { enabled: true, color: "#ce93d8" },
  "purple_300": { enabled: true, color: "#ba68c8" },
  "purple_400": { enabled: true, color: "#ab47bc" },
  "purple_500": { enabled: true, color: "#9c27b0" },
  "purple_600": { enabled: true, color: "#8e24aa" },
  "purple_700": { enabled: true, color: "#7b1fa2" },
  "purple_800": { enabled: true, color: "#6a1b9a" },
  "purple_900": { enabled: true, color: "#4a148c" },
  "purple_a100": { enabled: true, color: "#ea80fc" },
  "purple_a200": { enabled: true, color: "#e040fb" },
  "purple_a400": { enabled: true, color: "#d500f9" },
  "purple_a700": { enabled: true, color: "#aa00ff" },
  "deep_purple_50": { enabled: true, color: "#ede7f6" },
  "deep_purple_100": { enabled: true, color: "#d1c4e9" },
  "deep_purple_200": { enabled: true, color: "#b39ddb" },
  "deep_purple_300": { enabled: true, color: "#9575cd" },
  "deep_purple_400": { enabled: true, color: "#7e57c2" },
  "deep_purple_500": { enabled: true, color: "#673ab7" },
  "deep_purple_600": { enabled: true, color: "#5e35b1" },
  "deep_purple_700": { enabled: true, color: "#512da8" },
  "deep_purple_800": { enabled: true, color: "#4527a0" },
  "deep_purple_900": { enabled: true, color: "#311b92" },
  "deep_purple_a100": { enabled: true, color: "#b388ff" },
  "deep_purple_a200": { enabled: true, color: "#7c4dff" },
  "deep_purple_a400": { enabled: true, color: "#651fff" },
  "deep_purple_a700": { enabled: true, color: "#6200ea" },
  "indigo_50": { enabled: true, color: "#e8eaf6" },
  "indigo_100": { enabled: true, color: "#c5cae9" },
  "indigo_200": { enabled: true, color: "#9fa8da" },
  "indigo_300": { enabled: true, color: "#7986cb" },
  "indigo_400": { enabled: true, color: "#5c6bc0" },
  "indigo_500": { enabled: true, color: "#3f51b5" },
  "indigo_600": { enabled: true, color: "#3949ab" },
  "indigo_700": { enabled: true, color: "#303f9f" },
  "indigo_800": { enabled: true, color: "#283593" },
  "indigo_900": { enabled: true, color: "#1a237e" },
  "indigo_a100": { enabled: true, color: "#8c9eff" },
  "indigo_a200": { enabled: true, color: "#536dfe" },
  "indigo_a400": { enabled: true, color: "#3d5afe" },
  "indigo_a700": { enabled: true, color: "#304ffe" },
  "blue_gray_50": { enabled: true, color: "#eceff1" },
  "blue_gray_100": { enabled: true, color: "#cfd8dc" },
  "blue_gray_200": { enabled: true, color: "#b0bec5" },
  "blue_gray_300": { enabled: true, color: "#90a4ae" },
  "blue_gray_400": { enabled: true, color: "#78909c" },
  "blue_gray_500": { enabled: true, color: "#607d8b" },
  "blue_gray_600": { enabled: true, color: "#546e7a" },
  "blue_gray_700": { enabled: true, color: "#455a64" },
  "blue_gray_800": { enabled: true, color: "#37474f" },
  "blue_gray_900": { enabled: true, color: "#263238" },
  "blue_50": { enabled: true, color: "#e3f2fd" },
  "blue_100": { enabled: true, color: "#bbdefb" },
  "blue_200": { enabled: true, color: "#90caf9" },
  "blue_300": { enabled: true, color: "#64b5f6" },
  "blue_400": { enabled: true, color: "#42a5f5" },
  "blue_500": { enabled: true, color: "#2196f3" },
  "blue_600": { enabled: true, color: "#1e88e5" },
  "blue_700": { enabled: true, color: "#1976d2" },
  "blue_800": { enabled: true, color: "#1565c0" },
  "blue_900": { enabled: true, color: "#0d47a1" },
  "blue_a100": { enabled: true, color: "#82b1ff" },
  "blue_a200": { enabled: true, color: "#448aff" },
  "blue_a400": { enabled: true, color: "#2979ff" },
  "blue_a700": { enabled: true, color: "#2962ff" },
  "light_blue_50": { enabled: true, color: "#e1f5fe" },
  "light_blue_100": { enabled: true, color: "#b3e5fc" },
  "light_blue_200": { enabled: true, color: "#81d4fa" },
  "light_blue_300": { enabled: true, color: "#4fc3f7" },
  "light_blue_400": { enabled: true, color: "#29b6f6" },
  "light_blue_500": { enabled: true, color: "#03a9f4" },
  "light_blue_600": { enabled: true, color: "#039be5" },
  "light_blue_700": { enabled: true, color: "#0288d1" },
  "light_blue_800": { enabled: true, color: "#0277bd" },
  "light_blue_900": { enabled: true, color: "#01579b" },
  "light_blue_a100": { enabled: true, color: "#80d8ff" },
  "light_blue_a200": { enabled: true, color: "#40c4ff" },
  "light_blue_a400": { enabled: true, color: "#00b0ff" },
  "light_blue_a700": { enabled: true, color: "#0091ea" },
  "cyan_50": { enabled: true, color: "#e0f7fa" },
  "cyan_100": { enabled: true, color: "#b2ebf2" },
  "cyan_200": { enabled: true, color: "#80deea" },
  "cyan_300": { enabled: true, color: "#4dd0e1" },
  "cyan_400": { enabled: true, color: "#26c6da" },
  "cyan_500": { enabled: true, color: "#00bcd4" },
  "cyan_600": { enabled: true, color: "#00acc1" },
  "cyan_700": { enabled: true, color: "#0097a7" },
  "cyan_800": { enabled: true, color: "#00838f" },
  "cyan_900": { enabled: true, color: "#006064" },
  "cyan_a100": { enabled: true, color: "#84ffff" },
  "cyan_a200": { enabled: true, color: "#18ffff" },
  "cyan_a400": { enabled: true, color: "#00e5ff" },
  "cyan_a700": { enabled: true, color: "#00b8d4" },
  "teal_50": { enabled: true, color: "#e0f2f1" },
  "teal_100": { enabled: true, color: "#b2dfdb" },
  "teal_200": { enabled: true, color: "#80cbc4" },
  "teal_300": { enabled: true, color: "#4db6ac" },
  "teal_400": { enabled: true, color: "#26a69a" },
  "teal_500": { enabled: true, color: "#009688" },
  "teal_600": { enabled: true, color: "#00897b" },
  "teal_700": { enabled: true, color: "#00796b" },
  "teal_800": { enabled: true, color: "#00695c" },
  "teal_900": { enabled: true, color: "#004d40" },
  "teal_a100": { enabled: true, color: "#a7ffeb" },
  "teal_a200": { enabled: true, color: "#64ffda" },
  "teal_a400": { enabled: true, color: "#1de9b6" },
  "teal_a700": { enabled: true, color: "#00bfa5" },
  "green_50": { enabled: true, color: "#e8f5e9" },
  "green_100": { enabled: true, color: "#c8e6c9" },
  "green_200": { enabled: true, color: "#a5d6a7" },
  "green_300": { enabled: true, color: "#81c784" },
  "green_400": { enabled: true, color: "#66bb6a" },
  "green_500": { enabled: true, color: "#4caf50" },
  "green_600": { enabled: true, color: "#43a047" },
  "green_700": { enabled: true, color: "#388e3c" },
  "green_800": { enabled: true, color: "#2e7d32" },
  "green_900": { enabled: true, color: "#1b5e20" },
  "green_a100": { enabled: true, color: "#b9f6ca" },
  "green_a200": { enabled: true, color: "#69f0ae" },
  "green_a400": { enabled: true, color: "#00e676" },
  "green_a700": { enabled: true, color: "#00c853" },
  "light_green_50": { enabled: true, color: "#f1f8e9" },
  "light_green_100": { enabled: true, color: "#dcedc8" },
  "light_green_200": { enabled: true, color: "#c5e1a5" },
  "light_green_300": { enabled: true, color: "#aed581" },
  "light_green_400": { enabled: true, color: "#9ccc65" },
  "light_green_500": { enabled: true, color: "#8bc34a" },
  "light_green_600": { enabled: true, color: "#7cb342" },
  "light_green_700": { enabled: true, color: "#689f38" },
  "light_green_800": { enabled: true, color: "#558b2f" },
  "light_green_900": { enabled: true, color: "#33691e" },
  "light_green_a100": { enabled: true, color: "#ccff90" },
  "light_green_a200": { enabled: true, color: "#b2ff59" },
  "light_green_a400": { enabled: true, color: "#76ff03" },
  "light_green_a700": { enabled: true, color: "#64dd17" },
  "lime_50": { enabled: true, color: "#f9fbe7" },
  "lime_100": { enabled: true, color: "#f0f4c3" },
  "lime_200": { enabled: true, color: "#e6ee9c" },
  "lime_300": { enabled: true, color: "#dce775" },
  "lime_400": { enabled: true, color: "#d4e157" },
  "lime_500": { enabled: true, color: "#cddc39" },
  "lime_600": { enabled: true, color: "#c0ca33" },
  "lime_700": { enabled: true, color: "#afb42b" },
  "lime_800": { enabled: true, color: "#9e9d24" },
  "lime_900": { enabled: true, color: "#827717" },
  "lime_a100": { enabled: true, color: "#f4ff81" },
  "lime_a200": { enabled: true, color: "#eeff41" },
  "lime_a400": { enabled: true, color: "#c6ff00" },
  "lime_a700": { enabled: true, color: "#aeea00" },
  "yellow_50": { enabled: true, color: "#fffde7" },
  "yellow_100": { enabled: true, color: "#fff9c4" },
  "yellow_200": { enabled: true, color: "#fff59d" },
  "yellow_300": { enabled: true, color: "#fff176" },
  "yellow_400": { enabled: true, color: "#ffee58" },
  "yellow_500": { enabled: true, color: "#ffeb3b" },
  "yellow_600": { enabled: true, color: "#fdd835" },
  "yellow_700": { enabled: true, color: "#fbc02d" },
  "yellow_800": { enabled: true, color: "#f9a825" },
  "yellow_900": { enabled: true, color: "#f57f17" },
  "yellow_a100": { enabled: true, color: "#ffff8d" },
  "yellow_a200": { enabled: true, color: "#ffff00" },
  "yellow_a400": { enabled: true, color: "#ffea00" },
  "yellow_a700": { enabled: true, color: "#ffd600" },
  "amber_50": { enabled: true, color: "#fff8e1" },
  "amber_100": { enabled: true, color: "#ffecb3" },
  "amber_200": { enabled: true, color: "#ffe082" },
  "amber_300": { enabled: true, color: "#ffd54f" },
  "amber_400": { enabled: true, color: "#ffca28" },
  "amber_500": { enabled: true, color: "#ffc107" },
  "amber_600": { enabled: true, color: "#ffb300" },
  "amber_700": { enabled: true, color: "#ffa000" },
  "amber_800": { enabled: true, color: "#ff8f00" },
  "amber_900": { enabled: true, color: "#ff6f00" },
  "amber_a100": { enabled: true, color: "#ffe57f" },
  "amber_a200": { enabled: true, color: "#ffd740" },
  "amber_a400": { enabled: true, color: "#ffc400" },
  "amber_a700": { enabled: true, color: "#ffab00" },
  "orange_50": { enabled: true, color: "#fff3e0" },
  "orange_100": { enabled: true, color: "#ffe0b2" },
  "orange_200": { enabled: true, color: "#ffcc80" },
  "orange_300": { enabled: true, color: "#ffb74d" },
  "orange_400": { enabled: true, color: "#ffa726" },
  "orange_500": { enabled: true, color: "#ff9800" },
  "orange_600": { enabled: true, color: "#fb8c00" },
  "orange_700": { enabled: true, color: "#f57c00" },
  "orange_800": { enabled: true, color: "#ef6c00" },
  "orange_900": { enabled: true, color: "#e65100" },
  "orange_a100": { enabled: true, color: "#ffd180" },
  "orange_a200": { enabled: true, color: "#ffab40" },
  "orange_a400": { enabled: true, color: "#ff9100" },
  "orange_a700": { enabled: true, color: "#ff6d00" },
  "deep_orange_50": { enabled: true, color: "#fbe9e7" },
  "deep_orange_100": { enabled: true, color: "#ffccbc" },
  "deep_orange_200": { enabled: true, color: "#ffab91" },
  "deep_orange_300": { enabled: true, color: "#ff8a65" },
  "deep_orange_400": { enabled: true, color: "#ff7043" },
  "deep_orange_500": { enabled: true, color: "#ff5722" },
  "deep_orange_600": { enabled: true, color: "#f4511e" },
  "deep_orange_700": { enabled: true, color: "#e64a19" },
  "deep_orange_800": { enabled: true, color: "#d84315" },
  "deep_orange_900": { enabled: true, color: "#bf360c" },
  "deep_orange_a100": { enabled: true, color: "#ff9e80" },
  "deep_orange_a200": { enabled: true, color: "#ff6e40" },
  "deep_orange_a400": { enabled: true, color: "#ff3d00" },
  "deep_orange_a700": { enabled: true, color: "#dd2c00" },
  "brown_50": { enabled: true, color: "#efebe9" },
  "brown_100": { enabled: true, color: "#d7ccc8" },
  "brown_200": { enabled: true, color: "#bcaaa4" },
  "brown_300": { enabled: true, color: "#a1887f" },
  "brown_400": { enabled: true, color: "#8d6e63" },
  "brown_500": { enabled: true, color: "#795548" },
  "brown_600": { enabled: true, color: "#6d4c41" },
  "brown_700": { enabled: true, color: "#5d4037" },
  "brown_800": { enabled: true, color: "#4e342e" },
  "brown_900": { enabled: true, color: "#3e2723" },
  "grey_50": { enabled: true, color: "#fafafa" },
  "grey_100": { enabled: true, color: "#f5f5f5" },
  "grey_200": { enabled: true, color: "#eeeeee" },
  "grey_300": { enabled: true, color: "#e0e0e0" },
  "grey_400": { enabled: true, color: "#bdbdbd" },
  "grey_500": { enabled: true, color: "#9e9e9e" },
  "grey_600": { enabled: true, color: "#757575" },
  "grey_700": { enabled: true, color: "#616161" },
  "grey_800": { enabled: true, color: "#424242" },
  "grey_900": { enabled: true, color: "#212121" },
} as const;

export default blocks;
