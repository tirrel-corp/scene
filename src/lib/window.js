export function incomingLinkToWindow(link, { apps, windows, selectedWindow }) {
    const splitUrl = link.split("/");
    const desk = splitUrl[splitUrl.indexOf("apps") + 1];
    const remainderUrl = splitUrl.slice(splitUrl.indexOf(desk)).join("/");
    if (desk in apps?.value?.charges) {
        const charge = { ...apps.value.charges[desk], ...{ href: { glob: { base: remainderUrl } } } };
        if (windows.value.some((e) => e.desk === desk)) {
            windows.set([charge, ...windows.value.filter((e) => e.desk !== desk)]);
            selectedWindow.set([charge, ...selectedWindow.value.filter((e) => e.desk !== desk)])
        } else {
            windows.set([...windows.value, charge])
            selectedWindow.set([charge, ...selectedWindow.value])
        }
    }
    return false
}