import "../styles/index.css";
import AnimatedPixel from "./elements/AnimatedPixel";

new AnimatedPixel({
  width: 600,
  height: 600,
  element: document.querySelector("#app") as HTMLElement,
});
