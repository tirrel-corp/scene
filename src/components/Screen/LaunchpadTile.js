import cn from 'classnames';

export default function LaunchpadTile({ desk, charge, focusByCharge, launchOpen }) {
    return <div
        key={desk}
        className="flex flex-col items-center justify-center text-white space-y-4"
    >
        <div
            className={cn(
                "h-[125px] w-[125px] rounded-xl overflow-hidden mx-2",
                {
                    "hover:brightness-110 cursor-pointer": !("install" in charge?.chad) && !("suspend" in charge?.chad),
                    "opacity-25": Boolean("install" in charge?.chad) || Boolean("suspend" in charge?.chad),
                    "cursor-not-allowed grayscale": Boolean("suspend" in charge?.chad),
                    "cursor-wait": Boolean("install" in charge?.chad)
                }
            )}
            style={{ backgroundColor: charge.color }}
            onClick={() => {
                if (!("install" in charge?.chad || "suspend" in charge?.chad)) {
                    focusByCharge(charge);
                    launchOpen.set(prev => !prev);
                }
            }}
        >
            {charge?.image?.startsWith("http") && (
                <img className="h-[125px] w-[125px]" src={charge.image} />
            )}
        </div>
        <p>{charge.title}</p>
    </div>
}