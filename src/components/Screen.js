import Window from "./Screen/Window";
import { screenPadding } from '../lib/constants';
import { useContext } from "react";
import { WindowContext } from "../App";

export default function Screen({
  children,
}) {
  const { windows, selectedWindow, hiddenWindow, launchOpen } = useContext(WindowContext);

  return (
    <div
      className="grow flex flex-col justify-end items-center"
      style={{
        // enlarges this bit without changing position of content. 
        marginInline: `-${screenPadding.inline}px`,
        paddingInline: `${screenPadding.inline}px`,
        marginBottom: `-${screenPadding.bottom}px`,
        paddingBottom: `${screenPadding.bottom}px`,
      }}
    >
      {children}
      {windows.value.map((win, index) => (
        <Window
          key={win.desk}
          win={win}
          launchOpen={launchOpen}
          index={index}
          windows={windows}
          selectedWindow={selectedWindow}
          hiddenWindow={hiddenWindow}
        />
      ))}
    </div>
  );
}
