import cn from 'classnames';
import { useNotifications } from "../lib/useNotifications";
import { useContext, useState } from 'react';
import { ThemeContext } from '../App';
import { whiteOrBlack } from '../lib/background';
import { WidgetContext } from './HeaderBar';

export default function Notifications({ charges, focusByCharge }) {
    const { showNotifications: visible } = useContext(WidgetContext);
    const { notifications, count } = useNotifications();
    const [latestYarn, setLatestYarn] = useState(window.localStorage.getItem('tirrel-desktop-latest-yarn'));

    const palette = useContext(ThemeContext);
    const header = `rgb(${palette?.["Muted"]?.join(",") || "0,0,0"})`;
    const text = whiteOrBlack(header);

    const latestYarnFilter = (e) => {
        if (latestYarn) {
            return e?.latest > latestYarn
        }
        else return true
    };

    return <div id="notifications" className={cn("p-2 rounded-xl flex flex-col justify-center items-center absolute z-[9999] top-12 right-2 space-y-4 bg-[rgba(0,0,0,0.3)]", {
        "visible": visible.value,
        "hidden": !visible.value
    })}>
        <div className='self-end'>
            {(notifications?.length > 0 && latestYarn < notifications[0]?.latest) &&
                <button
                    style={{
                        borderColor: 'transparent',
                        color: text,
                        backgroundColor: header
                    }}
                    onClick={() => {
                        window.localStorage.setItem('tirrel-desktop-latest-yarn', notifications[0]?.latest || null)
                        setLatestYarn(notifications[0]?.latest || null)
                    }}
                >
                    Clear
                </button>}
        </div>
        <div
            className="max-h-[25vh] overflow-y-auto space-y-6">
            {notifications.filter(latestYarnFilter).map((grouping) => (
                <div className='space-y-2' key={grouping.date}>
                    <h2 className="text-white text-xl font-medium text-right">{grouping.date}</h2>
                    <ul className='space-y-2'>
                        {grouping.bins.map((b) => (
                            <li key={b.time}>
                                <Notification bin={b} charges={charges} focusByCharge={focusByCharge} visible={visible} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            {notifications?.filter(latestYarnFilter)?.length === 0 && <p className='text-xs pb-4 px-4' style={{ color: text }}>No notifications</p>}
        </div>
    </div>
}

function Notification({ bin, charges, focusByCharge, visible }) {
    const palette = useContext(ThemeContext);
    const header = `rgb(${palette?.["Muted"]?.join(",") || "0,0,0"})`;
    const content = `rgb(${palette?.["DarkMuted"]?.join(",") || "0,0,0"})`;
    const desk = bin?.topYarn?.rope?.desk;
    const charge = charges?.[desk] ? charges[desk] : {
        chad: {},
        color: "#ee5432",
        desk: "garden",
        image: null
    };
    const wer = 'glob' in charge.chad ? bin.topYarn.wer.substring(1) : bin?.topYarn?.wer;
    const channel = wer.includes("groups/") ?
        `groups/?grid-note=${encodeURI("/" + wer)}`
        : wer.includes(desk)
            ? wer
            : `${desk}${bin?.topYarn?.rope?.thread}`;
    return <div className="rounded-xl flex flex-col max-w-[350px] cursor-default"
        onClick={() => {
            focusByCharge(charge, channel)
            visible.set(!visible.value)
        }}
        style={{
            backgroundColor: content,
            color: whiteOrBlack(content)
        }}>
        <div className="p-2 space-x-2 flex w-full text-xs text-semibold rounded-t-xl"
            style={{
                backgroundColor: header
            }}
        >
            <DocketImage color={charge?.color} image={charge?.image} />
            <p>{charge.title}</p>
        </div>
        <div>
            <p className="p-2 text-xs overflow-hidden truncate max-w-30ch">
                {bin?.topYarn?.con.map((content) => {
                    if (typeof content === 'string') {
                        return <span className='' key={content}>{content}</span>
                    }
                    if ('ship' in content) {
                        return <span className='font-bold' key={content.ship}>
                            {content.ship}
                        </span>
                    }
                    return <span className="font-bold" key={content.emph}>{content.emph}</span>
                })}
            </p>
        </div>
    </div>
}

const DocketImage = ({ className = "", color = "#ee5432", image }) => {
    const bgColor = color;

    return (
        <div className={cn(className, "h-4 w-4")} style={{ background: bgColor }}>
            {image && <img src={image} alt="" />}
        </div>
    )
}