import { hex2rgb } from "../../_utils.ts";
import HueBlock from "../blocks/HueBlock.ts";

const materialPalette: HueBlock[] = [
  new HueBlock(hex2rgb("#ffebee"), { en_US: "Red 50", en_GB: "Red 50" }),
  new HueBlock(hex2rgb("#ffcdd2"), { en_US: "Red 100", en_GB: "Red 100" }),
  new HueBlock(hex2rgb("#ef9a9a"), { en_US: "Red 200", en_GB: "Red 200" }),
  new HueBlock(hex2rgb("#e57373"), { en_US: "Red 300", en_GB: "Red 300" }),
  new HueBlock(hex2rgb("#ef5350"), { en_US: "Red 400", en_GB: "Red 400" }),
  new HueBlock(hex2rgb("#f44336"), { en_US: "Red 500", en_GB: "Red 500" }),
  new HueBlock(hex2rgb("#e53935"), { en_US: "Red 600", en_GB: "Red 600" }),
  new HueBlock(hex2rgb("#d32f2f"), { en_US: "Red 700", en_GB: "Red 700" }),
  new HueBlock(hex2rgb("#c62828"), { en_US: "Red 800", en_GB: "Red 800" }),
  new HueBlock(hex2rgb("#b71c1c"), { en_US: "Red 900", en_GB: "Red 900" }),
  new HueBlock(hex2rgb("#ff8a80"), { en_US: "Red A100", en_GB: "Red A100" }),
  new HueBlock(hex2rgb("#ff5252"), { en_US: "Red A200", en_GB: "Red A200" }),
  new HueBlock(hex2rgb("#ff1744"), { en_US: "Red A400", en_GB: "Red A400" }),
  new HueBlock(hex2rgb("#d50000"), { en_US: "Red A700", en_GB: "Red A700" }),
  new HueBlock(hex2rgb("#fce4ec"), { en_US: "Pink 50", en_GB: "Pink 50" }),
  new HueBlock(hex2rgb("#f8bbd0"), { en_US: "Pink 100", en_GB: "Pink 100" }),
  new HueBlock(hex2rgb("#f48fb1"), { en_US: "Pink 200", en_GB: "Pink 200" }),
  new HueBlock(hex2rgb("#f06292"), { en_US: "Pink 300", en_GB: "Pink 300" }),
  new HueBlock(hex2rgb("#ec407a"), { en_US: "Pink 400", en_GB: "Pink 400" }),
  new HueBlock(hex2rgb("#e91e63"), { en_US: "Pink 500", en_GB: "Pink 500" }),
  new HueBlock(hex2rgb("#d81b60"), { en_US: "Pink 600", en_GB: "Pink 600" }),
  new HueBlock(hex2rgb("#c2185b"), { en_US: "Pink 700", en_GB: "Pink 700" }),
  new HueBlock(hex2rgb("#ad1457"), { en_US: "Pink 800", en_GB: "Pink 800" }),
  new HueBlock(hex2rgb("#880e4f"), { en_US: "Pink 900", en_GB: "Pink 900" }),
  new HueBlock(hex2rgb("#ff80ab"), { en_US: "Pink A100", en_GB: "Pink A100" }),
  new HueBlock(hex2rgb("#ff4081"), { en_US: "Pink A200", en_GB: "Pink A200" }),
  new HueBlock(hex2rgb("#f50057"), { en_US: "Pink A400", en_GB: "Pink A400" }),
  new HueBlock(hex2rgb("#c51162"), { en_US: "Pink A700", en_GB: "Pink A700" }),
  new HueBlock(hex2rgb("#f3e5f5"), { en_US: "Purple 50", en_GB: "Purple 50" }),
  new HueBlock(hex2rgb("#e1bee7"), {
    en_US: "Purple 100",
    en_GB: "Purple 100",
  }),
  new HueBlock(hex2rgb("#ce93d8"), {
    en_US: "Purple 200",
    en_GB: "Purple 200",
  }),
  new HueBlock(hex2rgb("#ba68c8"), {
    en_US: "Purple 300",
    en_GB: "Purple 300",
  }),
  new HueBlock(hex2rgb("#ab47bc"), {
    en_US: "Purple 400",
    en_GB: "Purple 400",
  }),
  new HueBlock(hex2rgb("#9c27b0"), {
    en_US: "Purple 500",
    en_GB: "Purple 500",
  }),
  new HueBlock(hex2rgb("#8e24aa"), {
    en_US: "Purple 600",
    en_GB: "Purple 600",
  }),
  new HueBlock(hex2rgb("#7b1fa2"), {
    en_US: "Purple 700",
    en_GB: "Purple 700",
  }),
  new HueBlock(hex2rgb("#6a1b9a"), {
    en_US: "Purple 800",
    en_GB: "Purple 800",
  }),
  new HueBlock(hex2rgb("#4a148c"), {
    en_US: "Purple 900",
    en_GB: "Purple 900",
  }),
  new HueBlock(hex2rgb("#ea80fc"), {
    en_US: "Purple A100",
    en_GB: "Purple A100",
  }),
  new HueBlock(hex2rgb("#e040fb"), {
    en_US: "Purple A200",
    en_GB: "Purple A200",
  }),
  new HueBlock(hex2rgb("#d500f9"), {
    en_US: "Purple A400",
    en_GB: "Purple A400",
  }),
  new HueBlock(hex2rgb("#aa00ff"), {
    en_US: "Purple A700",
    en_GB: "Purple A700",
  }),
  new HueBlock(hex2rgb("#ede7f6"), {
    en_US: "Deep Purple 50",
    en_GB: "Deep Purple 50",
  }),
  new HueBlock(hex2rgb("#d1c4e9"), {
    en_US: "Deep Purple 100",
    en_GB: "Deep Purple 100",
  }),
  new HueBlock(hex2rgb("#b39ddb"), {
    en_US: "Deep Purple 200",
    en_GB: "Deep Purple 200",
  }),
  new HueBlock(hex2rgb("#9575cd"), {
    en_US: "Deep Purple 300",
    en_GB: "Deep Purple 300",
  }),
  new HueBlock(hex2rgb("#7e57c2"), {
    en_US: "Deep Purple 400",
    en_GB: "Deep Purple 400",
  }),
  new HueBlock(hex2rgb("#673ab7"), {
    en_US: "Deep Purple 500",
    en_GB: "Deep Purple 500",
  }),
  new HueBlock(hex2rgb("#5e35b1"), {
    en_US: "Deep Purple 600",
    en_GB: "Deep Purple 600",
  }),
  new HueBlock(hex2rgb("#512da8"), {
    en_US: "Deep Purple 700",
    en_GB: "Deep Purple 700",
  }),
  new HueBlock(hex2rgb("#4527a0"), {
    en_US: "Deep Purple 800",
    en_GB: "Deep Purple 800",
  }),
  new HueBlock(hex2rgb("#311b92"), {
    en_US: "Deep Purple 900",
    en_GB: "Deep Purple 900",
  }),
  new HueBlock(hex2rgb("#b388ff"), {
    en_US: "Deep Purple A100",
    en_GB: "Deep Purple A100",
  }),
  new HueBlock(hex2rgb("#7c4dff"), {
    en_US: "Deep Purple A200",
    en_GB: "Deep Purple A200",
  }),
  new HueBlock(hex2rgb("#651fff"), {
    en_US: "Deep Purple A400",
    en_GB: "Deep Purple A400",
  }),
  new HueBlock(hex2rgb("#6200ea"), {
    en_US: "Deep Purple A700",
    en_GB: "Deep Purple A700",
  }),
  new HueBlock(hex2rgb("#e8eaf6"), { en_US: "Indigo 50", en_GB: "Indigo 50" }),
  new HueBlock(hex2rgb("#c5cae9"), {
    en_US: "Indigo 100",
    en_GB: "Indigo 100",
  }),
  new HueBlock(hex2rgb("#9fa8da"), {
    en_US: "Indigo 200",
    en_GB: "Indigo 200",
  }),
  new HueBlock(hex2rgb("#7986cb"), {
    en_US: "Indigo 300",
    en_GB: "Indigo 300",
  }),
  new HueBlock(hex2rgb("#5c6bc0"), {
    en_US: "Indigo 400",
    en_GB: "Indigo 400",
  }),
  new HueBlock(hex2rgb("#3f51b5"), {
    en_US: "Indigo 500",
    en_GB: "Indigo 500",
  }),
  new HueBlock(hex2rgb("#3949ab"), {
    en_US: "Indigo 600",
    en_GB: "Indigo 600",
  }),
  new HueBlock(hex2rgb("#303f9f"), {
    en_US: "Indigo 700",
    en_GB: "Indigo 700",
  }),
  new HueBlock(hex2rgb("#283593"), {
    en_US: "Indigo 800",
    en_GB: "Indigo 800",
  }),
  new HueBlock(hex2rgb("#1a237e"), {
    en_US: "Indigo 900",
    en_GB: "Indigo 900",
  }),
  new HueBlock(hex2rgb("#8c9eff"), {
    en_US: "Indigo A100",
    en_GB: "Indigo A100",
  }),
  new HueBlock(hex2rgb("#536dfe"), {
    en_US: "Indigo A200",
    en_GB: "Indigo A200",
  }),
  new HueBlock(hex2rgb("#3d5afe"), {
    en_US: "Indigo A400",
    en_GB: "Indigo A400",
  }),
  new HueBlock(hex2rgb("#304ffe"), {
    en_US: "Indigo A700",
    en_GB: "Indigo A700",
  }),
  new HueBlock(hex2rgb("#eceff1"), {
    en_US: "Blue Gray  50",
    en_GB: "Blue Gray 50",
  }),
  new HueBlock(hex2rgb("#cfd8dc"), {
    en_US: "Blue Gray  100",
    en_GB: "Blue Gray 100",
  }),
  new HueBlock(hex2rgb("#b0bec5"), {
    en_US: "Blue Gray  200",
    en_GB: "Blue Gray 200",
  }),
  new HueBlock(hex2rgb("#90a4ae"), {
    en_US: "Blue Gray  300",
    en_GB: "Blue Gray 300",
  }),
  new HueBlock(hex2rgb("#78909c"), {
    en_US: "Blue Gray  400",
    en_GB: "Blue Gray 400",
  }),
  new HueBlock(hex2rgb("#607d8b"), {
    en_US: "Blue Gray  500",
    en_GB: "Blue Gray 500",
  }),
  new HueBlock(hex2rgb("#546e7a"), {
    en_US: "Blue Gray  600",
    en_GB: "Blue Gray 600",
  }),
  new HueBlock(hex2rgb("#455a64"), {
    en_US: "Blue Gray  700",
    en_GB: "Blue Gray 700",
  }),
  new HueBlock(hex2rgb("#37474f"), {
    en_US: "Blue Gray  800",
    en_GB: "Blue Gray 800",
  }),
  new HueBlock(hex2rgb("#263238"), {
    en_US: "Blue Gray  900",
    en_GB: "Blue Gray 900",
  }),
  new HueBlock(hex2rgb("#e3f2fd"), { en_US: "Blue 50", en_GB: "Blue 50" }),
  new HueBlock(hex2rgb("#bbdefb"), { en_US: "Blue 100", en_GB: "Blue 100" }),
  new HueBlock(hex2rgb("#90caf9"), { en_US: "Blue 200", en_GB: "Blue 200" }),
  new HueBlock(hex2rgb("#64b5f6"), { en_US: "Blue 300", en_GB: "Blue 300" }),
  new HueBlock(hex2rgb("#42a5f5"), { en_US: "Blue 400", en_GB: "Blue 400" }),
  new HueBlock(hex2rgb("#2196f3"), { en_US: "Blue 500", en_GB: "Blue 500" }),
  new HueBlock(hex2rgb("#1e88e5"), { en_US: "Blue 600", en_GB: "Blue 600" }),
  new HueBlock(hex2rgb("#1976d2"), { en_US: "Blue 700", en_GB: "Blue 700" }),
  new HueBlock(hex2rgb("#1565c0"), { en_US: "Blue 800", en_GB: "Blue 800" }),
  new HueBlock(hex2rgb("#0d47a1"), { en_US: "Blue 900", en_GB: "Blue 900" }),
  new HueBlock(hex2rgb("#82b1ff"), { en_US: "Blue A100", en_GB: "Blue A100" }),
  new HueBlock(hex2rgb("#448aff"), { en_US: "Blue A200", en_GB: "Blue A200" }),
  new HueBlock(hex2rgb("#2979ff"), { en_US: "Blue A400", en_GB: "Blue A400" }),
  new HueBlock(hex2rgb("#2962ff"), { en_US: "Blue A700", en_GB: "Blue A700" }),
  new HueBlock(hex2rgb("#e1f5fe"), {
    en_US: "Light Blue 50",
    en_GB: "Light Blue 50",
  }),
  new HueBlock(hex2rgb("#b3e5fc"), {
    en_US: "Light Blue 100",
    en_GB: "Light Blue 100",
  }),
  new HueBlock(hex2rgb("#81d4fa"), {
    en_US: "Light Blue 200",
    en_GB: "Light Blue 200",
  }),
  new HueBlock(hex2rgb("#4fc3f7"), {
    en_US: "Light Blue 300",
    en_GB: "Light Blue 300",
  }),
  new HueBlock(hex2rgb("#29b6f6"), {
    en_US: "Light Blue 400",
    en_GB: "Light Blue 400",
  }),
  new HueBlock(hex2rgb("#03a9f4"), {
    en_US: "Light Blue 500",
    en_GB: "Light Blue 500",
  }),
  new HueBlock(hex2rgb("#039be5"), {
    en_US: "Light Blue 600",
    en_GB: "Light Blue 600",
  }),
  new HueBlock(hex2rgb("#0288d1"), {
    en_US: "Light Blue 700",
    en_GB: "Light Blue 700",
  }),
  new HueBlock(hex2rgb("#0277bd"), {
    en_US: "Light Blue 800",
    en_GB: "Light Blue 800",
  }),
  new HueBlock(hex2rgb("#01579b"), {
    en_US: "Light Blue 900",
    en_GB: "Light Blue 900",
  }),
  new HueBlock(hex2rgb("#80d8ff"), {
    en_US: "Light Blue A100",
    en_GB: "Light Blue A100",
  }),
  new HueBlock(hex2rgb("#40c4ff"), {
    en_US: "Light Blue A200",
    en_GB: "Light Blue A200",
  }),
  new HueBlock(hex2rgb("#00b0ff"), {
    en_US: "Light Blue A400",
    en_GB: "Light Blue A400",
  }),
  new HueBlock(hex2rgb("#0091ea"), {
    en_US: "Light Blue A700",
    en_GB: "Light Blue A700",
  }),
  new HueBlock(hex2rgb("#e0f7fa"), { en_US: "Cyan 50", en_GB: "Cyan 50" }),
  new HueBlock(hex2rgb("#b2ebf2"), { en_US: "Cyan 100", en_GB: "Cyan 100" }),
  new HueBlock(hex2rgb("#80deea"), { en_US: "Cyan 200", en_GB: "Cyan 200" }),
  new HueBlock(hex2rgb("#4dd0e1"), { en_US: "Cyan 300", en_GB: "Cyan 300" }),
  new HueBlock(hex2rgb("#26c6da"), { en_US: "Cyan 400", en_GB: "Cyan 400" }),
  new HueBlock(hex2rgb("#00bcd4"), { en_US: "Cyan 500", en_GB: "Cyan 500" }),
  new HueBlock(hex2rgb("#00acc1"), { en_US: "Cyan 600", en_GB: "Cyan 600" }),
  new HueBlock(hex2rgb("#0097a7"), { en_US: "Cyan 700", en_GB: "Cyan 700" }),
  new HueBlock(hex2rgb("#00838f"), { en_US: "Cyan 800", en_GB: "Cyan 800" }),
  new HueBlock(hex2rgb("#006064"), { en_US: "Cyan 900", en_GB: "Cyan 900" }),
  new HueBlock(hex2rgb("#84ffff"), { en_US: "Cyan A100", en_GB: "Cyan A100" }),
  new HueBlock(hex2rgb("#18ffff"), { en_US: "Cyan A200", en_GB: "Cyan A200" }),
  new HueBlock(hex2rgb("#00e5ff"), { en_US: "Cyan A400", en_GB: "Cyan A400" }),
  new HueBlock(hex2rgb("#00b8d4"), { en_US: "Cyan A700", en_GB: "Cyan A700" }),
  new HueBlock(hex2rgb("#e0f2f1"), { en_US: "Teal 50", en_GB: "Teal 50" }),
  new HueBlock(hex2rgb("#b2dfdb"), { en_US: "Teal 100", en_GB: "Teal 100" }),
  new HueBlock(hex2rgb("#80cbc4"), { en_US: "Teal 200", en_GB: "Teal 200" }),
  new HueBlock(hex2rgb("#4db6ac"), { en_US: "Teal 300", en_GB: "Teal 300" }),
  new HueBlock(hex2rgb("#26a69a"), { en_US: "Teal 400", en_GB: "Teal 400" }),
  new HueBlock(hex2rgb("#009688"), { en_US: "Teal 500", en_GB: "Teal 500" }),
  new HueBlock(hex2rgb("#00897b"), { en_US: "Teal 600", en_GB: "Teal 600" }),
  new HueBlock(hex2rgb("#00796b"), { en_US: "Teal 700", en_GB: "Teal 700" }),
  new HueBlock(hex2rgb("#00695c"), { en_US: "Teal 800", en_GB: "Teal 800" }),
  new HueBlock(hex2rgb("#004d40"), { en_US: "Teal 900", en_GB: "Teal 900" }),
  new HueBlock(hex2rgb("#a7ffeb"), { en_US: "Teal A100", en_GB: "Teal A100" }),
  new HueBlock(hex2rgb("#64ffda"), { en_US: "Teal A200", en_GB: "Teal A200" }),
  new HueBlock(hex2rgb("#1de9b6"), { en_US: "Teal A400", en_GB: "Teal A400" }),
  new HueBlock(hex2rgb("#00bfa5"), { en_US: "Teal A700", en_GB: "Teal A700" }),
  new HueBlock(hex2rgb("#e8f5e9"), { en_US: "Green 50", en_GB: "Green 50" }),
  new HueBlock(hex2rgb("#c8e6c9"), { en_US: "Green 100", en_GB: "Green 100" }),
  new HueBlock(hex2rgb("#a5d6a7"), { en_US: "Green 200", en_GB: "Green 200" }),
  new HueBlock(hex2rgb("#81c784"), { en_US: "Green 300", en_GB: "Green 300" }),
  new HueBlock(hex2rgb("#66bb6a"), { en_US: "Green 400", en_GB: "Green 400" }),
  new HueBlock(hex2rgb("#4caf50"), { en_US: "Green 500", en_GB: "Green 500" }),
  new HueBlock(hex2rgb("#43a047"), { en_US: "Green 600", en_GB: "Green 600" }),
  new HueBlock(hex2rgb("#388e3c"), { en_US: "Green 700", en_GB: "Green 700" }),
  new HueBlock(hex2rgb("#2e7d32"), { en_US: "Green 800", en_GB: "Green 800" }),
  new HueBlock(hex2rgb("#1b5e20"), { en_US: "Green 900", en_GB: "Green 900" }),
  new HueBlock(hex2rgb("#b9f6ca"), {
    en_US: "Green A100",
    en_GB: "Green A100",
  }),
  new HueBlock(hex2rgb("#69f0ae"), {
    en_US: "Green A200",
    en_GB: "Green A200",
  }),
  new HueBlock(hex2rgb("#00e676"), {
    en_US: "Green A400",
    en_GB: "Green A400",
  }),
  new HueBlock(hex2rgb("#00c853"), {
    en_US: "Green A700",
    en_GB: "Green A700",
  }),
  new HueBlock(hex2rgb("#f1f8e9"), {
    en_US: "Light Green 50",
    en_GB: "Light Green 50",
  }),
  new HueBlock(hex2rgb("#dcedc8"), {
    en_US: "Light Green 100",
    en_GB: "Light Green 100",
  }),
  new HueBlock(hex2rgb("#c5e1a5"), {
    en_US: "Light Green 200",
    en_GB: "Light Green 200",
  }),
  new HueBlock(hex2rgb("#aed581"), {
    en_US: "Light Green 300",
    en_GB: "Light Green 300",
  }),
  new HueBlock(hex2rgb("#9ccc65"), {
    en_US: "Light Green 400",
    en_GB: "Light Green 400",
  }),
  new HueBlock(hex2rgb("#8bc34a"), {
    en_US: "Light Green 500",
    en_GB: "Light Green 500",
  }),
  new HueBlock(hex2rgb("#7cb342"), {
    en_US: "Light Green 600",
    en_GB: "Light Green 600",
  }),
  new HueBlock(hex2rgb("#689f38"), {
    en_US: "Light Green 700",
    en_GB: "Light Green 700",
  }),
  new HueBlock(hex2rgb("#558b2f"), {
    en_US: "Light Green 800",
    en_GB: "Light Green 800",
  }),
  new HueBlock(hex2rgb("#33691e"), {
    en_US: "Light Green 900",
    en_GB: "Light Green 900",
  }),
  new HueBlock(hex2rgb("#ccff90"), {
    en_US: "Light Green A100",
    en_GB: "Light Green A100",
  }),
  new HueBlock(hex2rgb("#b2ff59"), {
    en_US: "Light Green A200",
    en_GB: "Light Green A200",
  }),
  new HueBlock(hex2rgb("#76ff03"), {
    en_US: "Light Green A400",
    en_GB: "Light Green A400",
  }),
  new HueBlock(hex2rgb("#64dd17"), {
    en_US: "Light Green A700",
    en_GB: "Light Green A700",
  }),
  new HueBlock(hex2rgb("#f9fbe7"), { en_US: "Lime 50", en_GB: "Lime 50" }),
  new HueBlock(hex2rgb("#f0f4c3"), { en_US: "Lime 100", en_GB: "Lime 100" }),
  new HueBlock(hex2rgb("#e6ee9c"), { en_US: "Lime 200", en_GB: "Lime 200" }),
  new HueBlock(hex2rgb("#dce775"), { en_US: "Lime 300", en_GB: "Lime 300" }),
  new HueBlock(hex2rgb("#d4e157"), { en_US: "Lime 400", en_GB: "Lime 400" }),
  new HueBlock(hex2rgb("#cddc39"), { en_US: "Lime 500", en_GB: "Lime 500" }),
  new HueBlock(hex2rgb("#c0ca33"), { en_US: "Lime 600", en_GB: "Lime 600" }),
  new HueBlock(hex2rgb("#afb42b"), { en_US: "Lime 700", en_GB: "Lime 700" }),
  new HueBlock(hex2rgb("#9e9d24"), { en_US: "Lime 800", en_GB: "Lime 800" }),
  new HueBlock(hex2rgb("#827717"), { en_US: "Lime 900", en_GB: "Lime 900" }),
  new HueBlock(hex2rgb("#f4ff81"), { en_US: "Lime A100", en_GB: "Lime A100" }),
  new HueBlock(hex2rgb("#eeff41"), { en_US: "Lime A200", en_GB: "Lime A200" }),
  new HueBlock(hex2rgb("#c6ff00"), { en_US: "Lime A400", en_GB: "Lime A400" }),
  new HueBlock(hex2rgb("#aeea00"), { en_US: "Lime A700", en_GB: "Lime A700" }),
  new HueBlock(hex2rgb("#fffde7"), { en_US: "Yellow 50", en_GB: "Yellow 50" }),
  new HueBlock(hex2rgb("#fff9c4"), {
    en_US: "Yellow 100",
    en_GB: "Yellow 100",
  }),
  new HueBlock(hex2rgb("#fff59d"), {
    en_US: "Yellow 200",
    en_GB: "Yellow 200",
  }),
  new HueBlock(hex2rgb("#fff176"), {
    en_US: "Yellow 300",
    en_GB: "Yellow 300",
  }),
  new HueBlock(hex2rgb("#ffee58"), {
    en_US: "Yellow 400",
    en_GB: "Yellow 400",
  }),
  new HueBlock(hex2rgb("#ffeb3b"), {
    en_US: "Yellow 500",
    en_GB: "Yellow 500",
  }),
  new HueBlock(hex2rgb("#fdd835"), {
    en_US: "Yellow 600",
    en_GB: "Yellow 600",
  }),
  new HueBlock(hex2rgb("#fbc02d"), {
    en_US: "Yellow 700",
    en_GB: "Yellow 700",
  }),
  new HueBlock(hex2rgb("#f9a825"), {
    en_US: "Yellow 800",
    en_GB: "Yellow 800",
  }),
  new HueBlock(hex2rgb("#f57f17"), {
    en_US: "Yellow 900",
    en_GB: "Yellow 900",
  }),
  new HueBlock(hex2rgb("#ffff8d"), {
    en_US: "Yellow A100",
    en_GB: "Yellow A100",
  }),
  new HueBlock(hex2rgb("#ffff00"), {
    en_US: "Yellow A200",
    en_GB: "Yellow A200",
  }),
  new HueBlock(hex2rgb("#ffea00"), {
    en_US: "Yellow A400",
    en_GB: "Yellow A400",
  }),
  new HueBlock(hex2rgb("#ffd600"), {
    en_US: "Yellow A700",
    en_GB: "Yellow A700",
  }),
  new HueBlock(hex2rgb("#fff8e1"), { en_US: "Amber 50", en_GB: "Amber 50" }),
  new HueBlock(hex2rgb("#ffecb3"), { en_US: "Amber 100", en_GB: "Amber 100" }),
  new HueBlock(hex2rgb("#ffe082"), { en_US: "Amber 200", en_GB: "Amber 200" }),
  new HueBlock(hex2rgb("#ffd54f"), { en_US: "Amber 300", en_GB: "Amber 300" }),
  new HueBlock(hex2rgb("#ffca28"), { en_US: "Amber 400", en_GB: "Amber 400" }),
  new HueBlock(hex2rgb("#ffc107"), { en_US: "Amber 500", en_GB: "Amber 500" }),
  new HueBlock(hex2rgb("#ffb300"), { en_US: "Amber 600", en_GB: "Amber 600" }),
  new HueBlock(hex2rgb("#ffa000"), { en_US: "Amber 700", en_GB: "Amber 700" }),
  new HueBlock(hex2rgb("#ff8f00"), { en_US: "Amber 800", en_GB: "Amber 800" }),
  new HueBlock(hex2rgb("#ff6f00"), { en_US: "Amber 900", en_GB: "Amber 900" }),
  new HueBlock(hex2rgb("#ffe57f"), {
    en_US: "Amber A100",
    en_GB: "Amber A100",
  }),
  new HueBlock(hex2rgb("#ffd740"), {
    en_US: "Amber A200",
    en_GB: "Amber A200",
  }),
  new HueBlock(hex2rgb("#ffc400"), {
    en_US: "Amber A400",
    en_GB: "Amber A400",
  }),
  new HueBlock(hex2rgb("#ffab00"), {
    en_US: "Amber A700",
    en_GB: "Amber A700",
  }),
  new HueBlock(hex2rgb("#fff3e0"), { en_US: "Orange 50", en_GB: "Orange 50" }),
  new HueBlock(hex2rgb("#ffe0b2"), {
    en_US: "Orange 100",
    en_GB: "Orange 100",
  }),
  new HueBlock(hex2rgb("#ffcc80"), {
    en_US: "Orange 200",
    en_GB: "Orange 200",
  }),
  new HueBlock(hex2rgb("#ffb74d"), {
    en_US: "Orange 300",
    en_GB: "Orange 300",
  }),
  new HueBlock(hex2rgb("#ffa726"), {
    en_US: "Orange 400",
    en_GB: "Orange 400",
  }),
  new HueBlock(hex2rgb("#ff9800"), {
    en_US: "Orange 500",
    en_GB: "Orange 500",
  }),
  new HueBlock(hex2rgb("#fb8c00"), {
    en_US: "Orange 600",
    en_GB: "Orange 600",
  }),
  new HueBlock(hex2rgb("#f57c00"), {
    en_US: "Orange 700",
    en_GB: "Orange 700",
  }),
  new HueBlock(hex2rgb("#ef6c00"), {
    en_US: "Orange 800",
    en_GB: "Orange 800",
  }),
  new HueBlock(hex2rgb("#e65100"), {
    en_US: "Orange 900",
    en_GB: "Orange 900",
  }),
  new HueBlock(hex2rgb("#ffd180"), {
    en_US: "Orange A100",
    en_GB: "Orange A100",
  }),
  new HueBlock(hex2rgb("#ffab40"), {
    en_US: "Orange A200",
    en_GB: "Orange A200",
  }),
  new HueBlock(hex2rgb("#ff9100"), {
    en_US: "Orange A400",
    en_GB: "Orange A400",
  }),
  new HueBlock(hex2rgb("#ff6d00"), {
    en_US: "Orange A700",
    en_GB: "Orange A700",
  }),
  new HueBlock(hex2rgb("#fbe9e7"), {
    en_US: "Deep Orange 50",
    en_GB: "Deep Orange 50",
  }),
  new HueBlock(hex2rgb("#ffccbc"), {
    en_US: "Deep Orange 100",
    en_GB: "Deep Orange 100",
  }),
  new HueBlock(hex2rgb("#ffab91"), {
    en_US: "Deep Orange 200",
    en_GB: "Deep Orange 200",
  }),
  new HueBlock(hex2rgb("#ff8a65"), {
    en_US: "Deep Orange 300",
    en_GB: "Deep Orange 300",
  }),
  new HueBlock(hex2rgb("#ff7043"), {
    en_US: "Deep Orange 400",
    en_GB: "Deep Orange 400",
  }),
  new HueBlock(hex2rgb("#ff5722"), {
    en_US: "Deep Orange 500",
    en_GB: "Deep Orange 500",
  }),
  new HueBlock(hex2rgb("#f4511e"), {
    en_US: "Deep Orange 600",
    en_GB: "Deep Orange 600",
  }),
  new HueBlock(hex2rgb("#e64a19"), {
    en_US: "Deep Orange 700",
    en_GB: "Deep Orange 700",
  }),
  new HueBlock(hex2rgb("#d84315"), {
    en_US: "Deep Orange 800",
    en_GB: "Deep Orange 800",
  }),
  new HueBlock(hex2rgb("#bf360c"), {
    en_US: "Deep Orange 900",
    en_GB: "Deep Orange 900",
  }),
  new HueBlock(hex2rgb("#ff9e80"), {
    en_US: "Deep Orange A100",
    en_GB: "Deep Orange A100",
  }),
  new HueBlock(hex2rgb("#ff6e40"), {
    en_US: "Deep Orange A200",
    en_GB: "Deep Orange A200",
  }),
  new HueBlock(hex2rgb("#ff3d00"), {
    en_US: "Deep Orange A400",
    en_GB: "Deep Orange A400",
  }),
  new HueBlock(hex2rgb("#dd2c00"), {
    en_US: "Deep Orange A700",
    en_GB: "Deep Orange A700",
  }),
  new HueBlock(hex2rgb("#efebe9"), { en_US: "Brown 50", en_GB: "Brown 50" }),
  new HueBlock(hex2rgb("#d7ccc8"), { en_US: "Brown 100", en_GB: "Brown 100" }),
  new HueBlock(hex2rgb("#bcaaa4"), { en_US: "Brown 200", en_GB: "Brown 200" }),
  new HueBlock(hex2rgb("#a1887f"), { en_US: "Brown 300", en_GB: "Brown 300" }),
  new HueBlock(hex2rgb("#8d6e63"), { en_US: "Brown 400", en_GB: "Brown 400" }),
  new HueBlock(hex2rgb("#795548"), { en_US: "Brown 500", en_GB: "Brown 500" }),
  new HueBlock(hex2rgb("#6d4c41"), { en_US: "Brown 600", en_GB: "Brown 600" }),
  new HueBlock(hex2rgb("#5d4037"), { en_US: "Brown 700", en_GB: "Brown 700" }),
  new HueBlock(hex2rgb("#4e342e"), { en_US: "Brown 800", en_GB: "Brown 800" }),
  new HueBlock(hex2rgb("#3e2723"), { en_US: "Brown 900", en_GB: "Brown 900" }),
  new HueBlock(hex2rgb("#fafafa"), { en_US: "Gray 50", en_GB: "Grey 50" }),
  new HueBlock(hex2rgb("#f5f5f5"), { en_US: "Gray 100", en_GB: "Grey 100" }),
  new HueBlock(hex2rgb("#eeeeee"), { en_US: "Gray 200", en_GB: "Grey 200" }),
  new HueBlock(hex2rgb("#e0e0e0"), { en_US: "Gray 300", en_GB: "Grey 300" }),
  new HueBlock(hex2rgb("#bdbdbd"), { en_US: "Gray 400", en_GB: "Grey 400" }),
  new HueBlock(hex2rgb("#9e9e9e"), { en_US: "Gray 500", en_GB: "Grey 500" }),
  new HueBlock(hex2rgb("#757575"), { en_US: "Gray 600", en_GB: "Grey 600" }),
  new HueBlock(hex2rgb("#616161"), { en_US: "Gray 700", en_GB: "Grey 700" }),
  new HueBlock(hex2rgb("#424242"), { en_US: "Gray 800", en_GB: "Grey 800" }),
  new HueBlock(hex2rgb("#212121"), { en_US: "Gray 900", en_GB: "Grey 900" }),
];

export default materialPalette;
