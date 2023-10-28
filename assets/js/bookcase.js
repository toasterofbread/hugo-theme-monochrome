function removeTag() {
    const url = new URL(window.location.href)
    url.searchParams.delete("tag")
    
    window.location = url.search ? url.href : url.href.replace('?', '')
}

function setTagIndicator(tag) {
    const title = document.querySelector("#content.content-margin h1").parentElement
    title.style.setProperty("display", "flex")
    title.style.setProperty("gap", "20px")
    title.style.setProperty("align-items", "center")

    const tag_element = title.querySelector("#tag-label")
    if (tag_element != null) {
        tag_element.innerHTML = tag
        return
    }

    const template = document.createElement("template")
    template.innerHTML = `
        <style>
            #bookcase-tag {
                display: flex;
                align-items: center;
                gap: 5px;
                // background: var(--color-border-collapsible-menu);
                border: 2px solid var(--color-border);
                padding: 5px;
                border-radius: 9px;
                
                * {
                    color: var(--color-text);
                }

                button {
                    margin-left: 10px;
                    background-color: transparent;
                    border: none;
                    cursor:pointer;
                }
            }
        </style>

        <div id="bookcase-tag">
            <i class="fa-solid fa-tag"></i>
            <div id="tag-label">${tag}</div>

            <button>
                <i class="fa-solid fa-xmark"></i>
            </button> 
        </div>
        `

    title.appendChild(template.content)
    
    const remove_button = title.querySelector("#bookcase-tag button")
    remove_button.addEventListener("click", removeTag)
}

function filterByTag(tag) {
    const items = document.getElementsByClassName("bookcase-item")
    
    let remaining = items.length
    for (var i = 0; i < items.length; i++) {
        const item = items.item(i)
        
        const tags = JSON.parse(item.attributes.getNamedItem("tags").value)
        if (tags == null || !tags.some(item => item.toLowerCase() == tag.toLowerCase())) {
            item.remove()
            remaining--
        }
    }

    const no_projects_indicator = document.querySelector("#tag-no-projects #tag")

    if (remaining == 0) {
        if (no_projects_indicator == null) {
            const template = document.createElement("template")
            template.innerHTML = `
                <style>
                    #tag-no-projects {
                        display: flex;
                        width: 100%;
                        justify-content: center;

                        h5 {
                            text-align: center;
                        }
                        h6 {
                            margin-left: 50px;
                            margin-top: auto;
                        }
                    }

                    *.bookcase-layout {
                        display: flex !important;
                    }
                </style>
            
                <div id="tag-no-projects">
                    <h5>No projects match tag '</h5>
                    <h5 id="tag">${tag}</h5>
                    <h5>'</h5>
                    <h6>...yet.</h6>
                </div>
                `
        
            const layout = document.querySelector(".bookcase-layout")
            layout.appendChild(template.content)
        }
    }
    else if (no_projects_indicator != null) {
        no_projects_indicator.remove()
    }

    setTagIndicator(tag)
}

function onThemeChanged() {
    const light = document.documentElement.getAttribute("data-theme") === "light"

    const items = document.getElementsByClassName("bookcase-item")
    for (var i = 0; i < items.length; i++) {
        const item = items.item(i)
        
        item.style.setProperty(
            "--accent-colour",
            light ? item.style.getPropertyValue("--accent-colour-dark") : item.style.getPropertyValue("--accent-colour-light")
        )
    }
}

function onAttributesChanged(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
            onThemeChanged()
            return
        }
    })
}

var observer = new MutationObserver(onAttributesChanged)
observer.observe(document.documentElement, { attributes: true })

onThemeChanged()

const params = new URLSearchParams(window.location.search)
const tag = params.get("tag")

if (tag != null) {
    console.log("TAG ", tag)
    filterByTag(tag.trim())
}

document.addEventListener("ZoomOpen", function () {
    const image_layouts = document.querySelectorAll("#bookcase-images")
    for (var i = 0; i < image_layouts.length; i++) {
        const images = image_layouts.item(i)
        images.style.setProperty("overflow-x", "visible")
    }
});

document.addEventListener("ZoomClose", function () {
    const image_layouts = document.querySelectorAll("#bookcase-images")
    for (var i = 0; i < image_layouts.length; i++) {
        const images = image_layouts.item(i)
        images.style.setProperty("overflow-x", "scroll")
    }
});
