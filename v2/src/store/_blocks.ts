import type { IBlock } from "../../types/index.ts";
const blocks: IBlock[] = [
  { name: "red_50", enabled: true, color: "#ffebee" },
  { name: "red_100", enabled: true, color: "#ffcdd2" },
  { name: "red_200", enabled: true, color: "#ef9a9a" },
  { name: "red_300", enabled: true, color: "#e57373" },
  { name: "red_400", enabled: true, color: "#ef5350" },
  { name: "red_500", enabled: true, color: "#f44336" },
  { name: "red_600", enabled: true, color: "#e53935" },
  { name: "red_700", enabled: true, color: "#d32f2f" },
  { name: "red_800", enabled: true, color: "#c62828" },
  { name: "red_900", enabled: true, color: "#b71c1c" },
  { name: "red_a100", enabled: false, color: "#ff8a80" },
  { name: "red_a200", enabled: false, color: "#ff5252" },
  { name: "red_a400", enabled: false, color: "#ff1744" },
  { name: "red_a700", enabled: false, color: "#d50000" },
  { name: "pink_50", enabled: true, color: "#fce4ec" },
  { name: "pink_100", enabled: true, color: "#f8bbd0" },
  { name: "pink_200", enabled: true, color: "#f48fb1" },
  { name: "pink_300", enabled: true, color: "#f06292" },
  { name: "pink_400", enabled: true, color: "#ec407a" },
  { name: "pink_500", enabled: true, color: "#e91e63" },
  { name: "pink_600", enabled: true, color: "#d81b60" },
  { name: "pink_700", enabled: true, color: "#c2185b" },
  { name: "pink_800", enabled: true, color: "#ad1457" },
  { name: "pink_900", enabled: true, color: "#880e4f" },
  { name: "pink_a100", enabled: false, color: "#ff80ab" },
  { name: "pink_a200", enabled: false, color: "#ff4081" },
  { name: "pink_a400", enabled: false, color: "#f50057" },
  { name: "pink_a700", enabled: false, color: "#c51162" },
  { name: "purple_50", enabled: true, color: "#f3e5f5" },
  { name: "purple_100", enabled: true, color: "#e1bee7" },
  { name: "purple_200", enabled: true, color: "#ce93d8" },
  { name: "purple_300", enabled: true, color: "#ba68c8" },
  { name: "purple_400", enabled: true, color: "#ab47bc" },
  { name: "purple_500", enabled: true, color: "#9c27b0" },
  { name: "purple_600", enabled: true, color: "#8e24aa" },
  { name: "purple_700", enabled: true, color: "#7b1fa2" },
  { name: "purple_800", enabled: true, color: "#6a1b9a" },
  { name: "purple_900", enabled: true, color: "#4a148c" },
  { name: "purple_a100", enabled: false, color: "#ea80fc" },
  { name: "purple_a200", enabled: false, color: "#e040fb" },
  { name: "purple_a400", enabled: false, color: "#d500f9" },
  { name: "purple_a700", enabled: false, color: "#aa00ff" },
  { name: "deep_purple_50", enabled: true, color: "#ede7f6" },
  { name: "deep_purple_100", enabled: true, color: "#d1c4e9" },
  { name: "deep_purple_200", enabled: true, color: "#b39ddb" },
  { name: "deep_purple_300", enabled: true, color: "#9575cd" },
  { name: "deep_purple_400", enabled: true, color: "#7e57c2" },
  { name: "deep_purple_500", enabled: true, color: "#673ab7" },
  { name: "deep_purple_600", enabled: true, color: "#5e35b1" },
  { name: "deep_purple_700", enabled: true, color: "#512da8" },
  { name: "deep_purple_800", enabled: true, color: "#4527a0" },
  { name: "deep_purple_900", enabled: true, color: "#311b92" },
  { name: "deep_purple_a100", enabled: false, color: "#b388ff" },
  { name: "deep_purple_a200", enabled: false, color: "#7c4dff" },
  { name: "deep_purple_a400", enabled: false, color: "#651fff" },
  { name: "deep_purple_a700", enabled: false, color: "#6200ea" },
  { name: "indigo_50", enabled: true, color: "#e8eaf6" },
  { name: "indigo_100", enabled: true, color: "#c5cae9" },
  { name: "indigo_200", enabled: true, color: "#9fa8da" },
  { name: "indigo_300", enabled: true, color: "#7986cb" },
  { name: "indigo_400", enabled: true, color: "#5c6bc0" },
  { name: "indigo_500", enabled: true, color: "#3f51b5" },
  { name: "indigo_600", enabled: true, color: "#3949ab" },
  { name: "indigo_700", enabled: true, color: "#303f9f" },
  { name: "indigo_800", enabled: true, color: "#283593" },
  { name: "indigo_900", enabled: true, color: "#1a237e" },
  { name: "indigo_a100", enabled: false, color: "#8c9eff" },
  { name: "indigo_a200", enabled: false, color: "#536dfe" },
  { name: "indigo_a400", enabled: false, color: "#3d5afe" },
  { name: "indigo_a700", enabled: false, color: "#304ffe" },
  { name: "blue_gray_50", enabled: true, color: "#eceff1" },
  { name: "blue_gray_100", enabled: true, color: "#cfd8dc" },
  { name: "blue_gray_200", enabled: true, color: "#b0bec5" },
  { name: "blue_gray_300", enabled: true, color: "#90a4ae" },
  { name: "blue_gray_400", enabled: true, color: "#78909c" },
  { name: "blue_gray_500", enabled: true, color: "#607d8b" },
  { name: "blue_gray_600", enabled: true, color: "#546e7a" },
  { name: "blue_gray_700", enabled: true, color: "#455a64" },
  { name: "blue_gray_800", enabled: true, color: "#37474f" },
  { name: "blue_gray_900", enabled: true, color: "#263238" },
  { name: "blue_50", enabled: true, color: "#e3f2fd" },
  { name: "blue_100", enabled: true, color: "#bbdefb" },
  { name: "blue_200", enabled: true, color: "#90caf9" },
  { name: "blue_300", enabled: true, color: "#64b5f6" },
  { name: "blue_400", enabled: true, color: "#42a5f5" },
  { name: "blue_500", enabled: true, color: "#2196f3" },
  { name: "blue_600", enabled: true, color: "#1e88e5" },
  { name: "blue_700", enabled: true, color: "#1976d2" },
  { name: "blue_800", enabled: true, color: "#1565c0" },
  { name: "blue_900", enabled: true, color: "#0d47a1" },
  { name: "blue_a100", enabled: false, color: "#82b1ff" },
  { name: "blue_a200", enabled: false, color: "#448aff" },
  { name: "blue_a400", enabled: false, color: "#2979ff" },
  { name: "blue_a700", enabled: false, color: "#2962ff" },
  { name: "light_blue_50", enabled: true, color: "#e1f5fe" },
  { name: "light_blue_100", enabled: true, color: "#b3e5fc" },
  { name: "light_blue_200", enabled: true, color: "#81d4fa" },
  { name: "light_blue_300", enabled: true, color: "#4fc3f7" },
  { name: "light_blue_400", enabled: true, color: "#29b6f6" },
  { name: "light_blue_500", enabled: true, color: "#03a9f4" },
  { name: "light_blue_600", enabled: true, color: "#039be5" },
  { name: "light_blue_700", enabled: true, color: "#0288d1" },
  { name: "light_blue_800", enabled: true, color: "#0277bd" },
  { name: "light_blue_900", enabled: true, color: "#01579b" },
  { name: "light_blue_a100", enabled: false, color: "#80d8ff" },
  { name: "light_blue_a200", enabled: false, color: "#40c4ff" },
  { name: "light_blue_a400", enabled: false, color: "#00b0ff" },
  { name: "light_blue_a700", enabled: false, color: "#0091ea" },
  { name: "cyan_50", enabled: true, color: "#e0f7fa" },
  { name: "cyan_100", enabled: true, color: "#b2ebf2" },
  { name: "cyan_200", enabled: true, color: "#80deea" },
  { name: "cyan_300", enabled: true, color: "#4dd0e1" },
  { name: "cyan_400", enabled: true, color: "#26c6da" },
  { name: "cyan_500", enabled: true, color: "#00bcd4" },
  { name: "cyan_600", enabled: true, color: "#00acc1" },
  { name: "cyan_700", enabled: true, color: "#0097a7" },
  { name: "cyan_800", enabled: true, color: "#00838f" },
  { name: "cyan_900", enabled: true, color: "#006064" },
  { name: "cyan_a100", enabled: false, color: "#84ffff" },
  { name: "cyan_a200", enabled: false, color: "#18ffff" },
  { name: "cyan_a400", enabled: false, color: "#00e5ff" },
  { name: "cyan_a700", enabled: false, color: "#00b8d4" },
  { name: "teal_50", enabled: true, color: "#e0f2f1" },
  { name: "teal_100", enabled: true, color: "#b2dfdb" },
  { name: "teal_200", enabled: true, color: "#80cbc4" },
  { name: "teal_300", enabled: true, color: "#4db6ac" },
  { name: "teal_400", enabled: true, color: "#26a69a" },
  { name: "teal_500", enabled: true, color: "#009688" },
  { name: "teal_600", enabled: true, color: "#00897b" },
  { name: "teal_700", enabled: true, color: "#00796b" },
  { name: "teal_800", enabled: true, color: "#00695c" },
  { name: "teal_900", enabled: true, color: "#004d40" },
  { name: "teal_a100", enabled: false, color: "#a7ffeb" },
  { name: "teal_a200", enabled: false, color: "#64ffda" },
  { name: "teal_a400", enabled: false, color: "#1de9b6" },
  { name: "teal_a700", enabled: false, color: "#00bfa5" },
  { name: "green_50", enabled: true, color: "#e8f5e9" },
  { name: "green_100", enabled: true, color: "#c8e6c9" },
  { name: "green_200", enabled: true, color: "#a5d6a7" },
  { name: "green_300", enabled: true, color: "#81c784" },
  { name: "green_400", enabled: true, color: "#66bb6a" },
  { name: "green_500", enabled: true, color: "#4caf50" },
  { name: "green_600", enabled: true, color: "#43a047" },
  { name: "green_700", enabled: true, color: "#388e3c" },
  { name: "green_800", enabled: true, color: "#2e7d32" },
  { name: "green_900", enabled: true, color: "#1b5e20" },
  { name: "green_a100", enabled: false, color: "#b9f6ca" },
  { name: "green_a200", enabled: false, color: "#69f0ae" },
  { name: "green_a400", enabled: false, color: "#00e676" },
  { name: "green_a700", enabled: false, color: "#00c853" },
  { name: "light_green_50", enabled: true, color: "#f1f8e9" },
  { name: "light_green_100", enabled: true, color: "#dcedc8" },
  { name: "light_green_200", enabled: true, color: "#c5e1a5" },
  { name: "light_green_300", enabled: true, color: "#aed581" },
  { name: "light_green_400", enabled: true, color: "#9ccc65" },
  { name: "light_green_500", enabled: true, color: "#8bc34a" },
  { name: "light_green_600", enabled: true, color: "#7cb342" },
  { name: "light_green_700", enabled: true, color: "#689f38" },
  { name: "light_green_800", enabled: true, color: "#558b2f" },
  { name: "light_green_900", enabled: true, color: "#33691e" },
  { name: "light_green_a100", enabled: false, color: "#ccff90" },
  { name: "light_green_a200", enabled: false, color: "#b2ff59" },
  { name: "light_green_a400", enabled: false, color: "#76ff03" },
  { name: "light_green_a700", enabled: false, color: "#64dd17" },
  { name: "lime_50", enabled: true, color: "#f9fbe7" },
  { name: "lime_100", enabled: true, color: "#f0f4c3" },
  { name: "lime_200", enabled: true, color: "#e6ee9c" },
  { name: "lime_300", enabled: true, color: "#dce775" },
  { name: "lime_400", enabled: true, color: "#d4e157" },
  { name: "lime_500", enabled: true, color: "#cddc39" },
  { name: "lime_600", enabled: true, color: "#c0ca33" },
  { name: "lime_700", enabled: true, color: "#afb42b" },
  { name: "lime_800", enabled: true, color: "#9e9d24" },
  { name: "lime_900", enabled: true, color: "#827717" },
  { name: "lime_a100", enabled: false, color: "#f4ff81" },
  { name: "lime_a200", enabled: false, color: "#eeff41" },
  { name: "lime_a400", enabled: false, color: "#c6ff00" },
  { name: "lime_a700", enabled: false, color: "#aeea00" },
  { name: "yellow_50", enabled: true, color: "#fffde7" },
  { name: "yellow_100", enabled: true, color: "#fff9c4" },
  { name: "yellow_200", enabled: true, color: "#fff59d" },
  { name: "yellow_300", enabled: true, color: "#fff176" },
  { name: "yellow_400", enabled: true, color: "#ffee58" },
  { name: "yellow_500", enabled: true, color: "#ffeb3b" },
  { name: "yellow_600", enabled: true, color: "#fdd835" },
  { name: "yellow_700", enabled: true, color: "#fbc02d" },
  { name: "yellow_800", enabled: true, color: "#f9a825" },
  { name: "yellow_900", enabled: true, color: "#f57f17" },
  { name: "yellow_a100", enabled: false, color: "#ffff8d" },
  { name: "yellow_a200", enabled: false, color: "#ffff00" },
  { name: "yellow_a400", enabled: false, color: "#ffea00" },
  { name: "yellow_a700", enabled: false, color: "#ffd600" },
  { name: "amber_50", enabled: true, color: "#fff8e1" },
  { name: "amber_100", enabled: true, color: "#ffecb3" },
  { name: "amber_200", enabled: true, color: "#ffe082" },
  { name: "amber_300", enabled: true, color: "#ffd54f" },
  { name: "amber_400", enabled: true, color: "#ffca28" },
  { name: "amber_500", enabled: true, color: "#ffc107" },
  { name: "amber_600", enabled: true, color: "#ffb300" },
  { name: "amber_700", enabled: true, color: "#ffa000" },
  { name: "amber_800", enabled: true, color: "#ff8f00" },
  { name: "amber_900", enabled: true, color: "#ff6f00" },
  { name: "amber_a100", enabled: false, color: "#ffe57f" },
  { name: "amber_a200", enabled: false, color: "#ffd740" },
  { name: "amber_a400", enabled: false, color: "#ffc400" },
  { name: "amber_a700", enabled: false, color: "#ffab00" },
  { name: "orange_50", enabled: true, color: "#fff3e0" },
  { name: "orange_100", enabled: true, color: "#ffe0b2" },
  { name: "orange_200", enabled: true, color: "#ffcc80" },
  { name: "orange_300", enabled: true, color: "#ffb74d" },
  { name: "orange_400", enabled: true, color: "#ffa726" },
  { name: "orange_500", enabled: true, color: "#ff9800" },
  { name: "orange_600", enabled: true, color: "#fb8c00" },
  { name: "orange_700", enabled: true, color: "#f57c00" },
  { name: "orange_800", enabled: true, color: "#ef6c00" },
  { name: "orange_900", enabled: true, color: "#e65100" },
  { name: "orange_a100", enabled: false, color: "#ffd180" },
  { name: "orange_a200", enabled: false, color: "#ffab40" },
  { name: "orange_a400", enabled: false, color: "#ff9100" },
  { name: "orange_a700", enabled: false, color: "#ff6d00" },
  { name: "deep_orange_50", enabled: true, color: "#fbe9e7" },
  { name: "deep_orange_100", enabled: true, color: "#ffccbc" },
  { name: "deep_orange_200", enabled: true, color: "#ffab91" },
  { name: "deep_orange_300", enabled: true, color: "#ff8a65" },
  { name: "deep_orange_400", enabled: true, color: "#ff7043" },
  { name: "deep_orange_500", enabled: true, color: "#ff5722" },
  { name: "deep_orange_600", enabled: true, color: "#f4511e" },
  { name: "deep_orange_700", enabled: true, color: "#e64a19" },
  { name: "deep_orange_800", enabled: true, color: "#d84315" },
  { name: "deep_orange_900", enabled: true, color: "#bf360c" },
  { name: "deep_orange_a100", enabled: false, color: "#ff9e80" },
  { name: "deep_orange_a200", enabled: false, color: "#ff6e40" },
  { name: "deep_orange_a400", enabled: false, color: "#ff3d00" },
  { name: "deep_orange_a700", enabled: false, color: "#dd2c00" },
  { name: "brown_50", enabled: true, color: "#efebe9" },
  { name: "brown_100", enabled: true, color: "#d7ccc8" },
  { name: "brown_200", enabled: true, color: "#bcaaa4" },
  { name: "brown_300", enabled: true, color: "#a1887f" },
  { name: "brown_400", enabled: true, color: "#8d6e63" },
  { name: "brown_500", enabled: true, color: "#795548" },
  { name: "brown_600", enabled: true, color: "#6d4c41" },
  { name: "brown_700", enabled: true, color: "#5d4037" },
  { name: "brown_800", enabled: true, color: "#4e342e" },
  { name: "brown_900", enabled: true, color: "#3e2723" },
  { name: "grey_50", enabled: true, color: "#fafafa" },
  { name: "grey_100", enabled: true, color: "#f5f5f5" },
  { name: "grey_200", enabled: true, color: "#eeeeee" },
  { name: "grey_300", enabled: true, color: "#e0e0e0" },
  { name: "grey_400", enabled: true, color: "#bdbdbd" },
  { name: "grey_500", enabled: true, color: "#9e9e9e" },
  { name: "grey_600", enabled: true, color: "#757575" },
  { name: "grey_700", enabled: true, color: "#616161" },
  { name: "grey_800", enabled: true, color: "#424242" },
  { name: "grey_900", enabled: true, color: "#212121" },
];

export const filteredBlocks = Object.values(blocks).filter((
  { enabled }: IBlock,
) => enabled === true);

export default blocks;
