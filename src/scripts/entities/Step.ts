export interface Step {
  position: "left" | "right";
  description: string;
  image: {
    url: string;
    alt: string;
  };
}
