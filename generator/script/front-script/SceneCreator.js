let controller = new ScrollMagic.Controller();
function sceneCreator(element) {
    const height = element.scrollHeight;
    const scene = new ScrollMagic.Scene({
        duration:height,
        triggerElement:element,
        triggerHook:0.05,
        reverse:true,
    })
        .setPin(element.children[1].children[0],{pushFollowers:false})
        .addTo(controller)
}
function allSceneCreator () { // wait for document ready
    let items = document.querySelectorAll(".h2-part");
    items.forEach(item => sceneCreator(item));
}
allSceneCreator();



