"use client";
import { Button } from "./ui/button";

function MyButton() {
  return <Button onClick={() => alert("Clicked")}>Click</Button>;
}

export default MyButton;
