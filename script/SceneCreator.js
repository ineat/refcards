let controller = new ScrollMagic.Controller();

/**
 * Return the height of an element
 * @param element
 * @returns {number}
 */
function getHeight(element) {
    return element.scrollHeight
}

/**
 * Create a scene to pin an element
 * @param element
 */
function sceneCreator(element) {
    const height = getHeight(element)
    const scene = new ScrollMagic.Scene({
        duration:height,
        triggerElement:element,
        triggerHook:0.05,
        reverse:true,
    })
        .setPin(element.children[1].children[0],{pushFollowers:false})
        .addTo(controller)
        .setClassToggle(element,"isPinned")

    window.addEventListener("resize",function (){
        scene.duration = height;
    });
}

/**
 * Create all the scenes of the page
 */
function allSceneCreator () { // wait for document ready
    let items = document.querySelectorAll(".h2-part");
    items.forEach(item => sceneCreator(item));
}
allSceneCreator();



