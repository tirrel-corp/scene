import cn from 'classnames';
import { useNotifications } from "../lib/useNotifications";

export default function Notifications({ visible, charges, focusByCharge }) {
    const { notifications, count } = useNotifications();

    return <div id="notifications" className={cn("p-2 rounded-xl flex flex-col absolute z-[9999] top-12 right-2 space-y-4 bg-[rgba(0,0,0,0.3)]", {
        "visible": visible.value,
        "hidden": !visible.value
    })}>
        <div
            className="max-h-[25vh] overflow-y-auto space-y-2">
            {notifications.map((grouping) => (
                <div key={grouping.date}>
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
        </div>
    </div>
}

function Notification({ bin, charges, focusByCharge, visible }) {
    const desk = bin?.topYarn?.rope?.desk;
    const charge = charges?.[desk] ? charges[desk] : {
        chad: {},
        color: "#ee5432",
        desk: "garden",
        image: null
    };
    const wer = 'glob' in charge.chad ? bin.topYarn.wer.substring(1) : bin?.topYarn?.wer;
    const channel = wer.includes(desk) ? wer : `${desk}${bin?.topYarn?.rope?.thread}`;
    return <div className="rounded-xl bg-white flex flex-col max-w-[250px] cursor-default"
        onClick={() => {
            focusByCharge(charge, channel)
            visible.set(!visible.value)
        }}>
        <div className="p-2 space-x-2 flex w-full bg-neutral-100 text-black text-xs text-semibold rounded-t-xl">
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