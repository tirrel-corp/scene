import Window from "./Screen/Window";
import { screenPadding } from '../lib/constants';

export default function Screen({
  windows,
  selectedWindow,
  hiddenWindow,
  launchOpen,
  children,
}) {
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
