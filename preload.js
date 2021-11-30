const { ipcRenderer } = require('electron')

const es = require("./strings/es.json")
const eu = require("./strings/eu.json")
let language = "eu"
let executionOKMessage = ""

const inputIsEmpty = (element) => {
    if (element === "")
        return true
    else
        return false
}

const thereAreErrors = (error) => {
    if (error === -1)
        return true
    else
        return false
}

const getExecutionOutput = (executionResult) => {
    if (thereAreErrors(executionResult[0])) {
        return executionResult[1]
    }
    else {
        return executionOKMessage
    }
}

const initializeStringsEU = () => {
    document.title = eu["title"]
    document.getElementById("flag").src = "images/ikurrina.png"
    document.getElementById("change_language_button").innerText = eu["change_language"]
    document.getElementById("select_directory_button").innerText = eu["select_directory"]
    document.getElementById("rename_images_header").innerText = eu["rename_images_header"]
    document.getElementById("rename_captures_header").innerText = eu["rename_captures_header"]
    document.getElementById("prefix_label1").innerText = eu["prefix"]
    document.getElementById("prefix_label2").innerText = eu["prefix"]
    document.getElementById("error1").innerHTML = "<b>" + eu["error"] + "</b>"
    document.getElementById("error2").innerHTML = "<b>" + eu["error"] + "</b>"
    document.getElementById("error3").innerHTML = "<b>" + eu["error"] + "</b>"
    document.getElementById("name_structure_label").innerText = eu["name_structure"]
    document.getElementById("rename_images_button").innerText = eu["change_names"]
    document.getElementById("rename_captures_button").innerText = eu["change_names"]
    executionOKMessage = eu["ok"]
}

const initializeStringsES = () => {
    document.title = es["title"]
    document.getElementById("flag").src = "images/bandera-espana.webp"
    document.getElementById("change_language_button").innerText = es["change_language"]
    document.getElementById("select_directory_button").innerText = es["select_directory"]
    document.getElementById("rename_images_header").innerText = es["rename_images_header"]
    document.getElementById("rename_captures_header").innerText = es["rename_captures_header"]
    document.getElementById("prefix_label1").innerText = es["prefix"]
    document.getElementById("prefix_label2").innerText = es["prefix"]
    document.getElementById("error1").innerHTML = "<b>" + es["error"] + "</b>"
    document.getElementById("error2").innerHTML = "<b>" + es["error"] + "</b>"
    document.getElementById("error3").innerHTML = "<b>" + es["error"] + "</b>"
    document.getElementById("name_structure_label").innerText = es["name_structure"]
    document.getElementById("rename_images_button").innerText = es["change_names"]
    document.getElementById("rename_captures_button").innerText = es["change_names"]
    executionOKMessage = es["ok"]
}

window.addEventListener('DOMContentLoaded', () => {
    initializeStringsEU()

    document.getElementById("change_language_button").addEventListener("click", () => {
        if (language === "eu") {
            initializeStringsES()
            language = "es"
        }
        else {
            initializeStringsEU()
            language = "eu"
        }
    })

    document.getElementById("select_directory_button").addEventListener("click", () => {
        ipcRenderer.invoke("select_directory").then((result) => {
            if (result.length > 0) {
                document.getElementById("directory").innerText = result[0]
                document.getElementById("directory").style.visibility = "inherit"
                document.getElementById("secondary_div2").style.visibility = "inherit"
            }
        })
    })

    document.getElementById("prefix1").addEventListener("keyup", () => {
        if (inputIsEmpty(document.getElementById("prefix1").value)) {
            document.getElementById("error1").style.visibility = "inherit"
        }
        else {
            document.getElementById("error1").style.visibility = "hidden"
        }
    })

    document.getElementById("prefix2").addEventListener("keyup", () => {
        if (inputIsEmpty(document.getElementById("prefix2").value)) {
            document.getElementById("error2").style.visibility = "inherit"
        }
        else {
            document.getElementById("error2").style.visibility = "hidden"
        }
    })

    document.getElementById("name_structure").addEventListener("keyup", () => {
        if (inputIsEmpty(document.getElementById("name_structure").value)) {
            document.getElementById("error3").style.visibility = "inherit"
        }
        else {
            document.getElementById("error3").style.visibility = "hidden"
        }
    })

    document.getElementById("rename_images_button").addEventListener("click", () => {
        if (document.getElementById("prefix1").value !== "") {
            ipcRenderer.invoke("rename_images", [document.getElementById("directory").innerText,
            document.getElementById("prefix1").value]).then((result) => {
                alert(getExecutionOutput(result))
            })
        }
    })

    document.getElementById("rename_captures_button").addEventListener("click", () => {
        if (document.getElementById("prefix2").value !== "" && document.getElementById("name_structure").value !== "") {
            ipcRenderer.invoke("rename_captures", [document.getElementById("directory").innerText, document.getElementById("prefix2").value,
            document.getElementById("name_structure").value]).then((result) => {
                alert(getExecutionOutput(result))
            })
        }
    })
})

process.once("loaded", () => {
    window.addEventListener("message", evt => {
        if (evt.data.type === "select_directory") {
            ipcRenderer.send("select_directory")
        }
    })
})

ipcRenderer.on("selected_directory_path", (event, arg) => {
    document.getElementById("directory").style.display = "block"
    document.getElementById("directory").innerText = arg
    document.getElementById("secondary_div2").style.visibility = "inherit"
})
