function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function cleanData(aList, url=false){
    temp = ''
    if (url == true) {
        if (aList.length == 1){
            for (const key of aList) {
                temp += `<a href=${key}>${key}</a>` 
            }
        } 
        else if (aList.length > 1) {
            for (const key of aList) {
                temp += `
                <a href=${key}>
                    <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ ${key}
                </a>
                ` 
            }
        }
        else {
            temp += `---`
        }
    }
    else {
        if (aList.length == 1){
            for (const key of aList) {
                temp += `  ${key}` 
            }
        } 
        else if (aList.length > 1) {
            for (const key of aList) {
                temp += `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ ${key}` 
            }
        }
        else {
            temp += `---`
        }
    }

    return temp
}

function loadDataset(dataset){
    let dataHTML = ''
    for (const element of dataset) {
        urls = cleanData(element.URL, true)
        datatypes = cleanData(element.DataType)
        tasks = cleanData(element.Task)
        if (!element.Preview){
            preview = `
            <img 
                style="border-radius:50%; width: 10rem; height: 10rem"
                src="./material/98239648_p0.png">
            </img>`
        }
        else{
            preview = `<img src="${element.Preview}"></img>`
        }
        dataHTML += `
        <div>
            ${preview}
            <ul>
                <li><b>Dataset</b>: ${element.Dataset != '' ? element.Dataset : "---"}</li>
                <li><b>URL</b>: ${urls}</li>
                <li><b>Abbreviation</b>: ${element.Abbreviation != ''  ? element.Abbreviation : "---"}</li>
                <li><b>Datatype</b>: ${datatypes}</li>
                <li><b>Domain</b>: ${element.Domain != ''  ? element.Domain : "---"}</li>
                <li><b>Task</b>: ${tasks}</li>
            </ul>
        </div>
        `
    }
    document.querySelector(".content").innerHTML = dataHTML
}

readTextFile("dataset.json", function(text){
    var dataset = JSON.parse(text)
    loadDataset(dataset)
})

function searchAttribute(theThing, dataset){
    var filteredData = []

    for (const element of dataset) {
        abort = false
        for (var key in element) {
            if (abort == false) {
                temp = [element[key]].flat()
                for (const value of temp) {
                    if (value == ``){
                        break
                    }
                    else if (value.toLowerCase().includes(theThing.toLowerCase())) {
                        filteredData.push(element)
                        abort = true
                        break
                    }
                }
            }
        }
    }
    return filteredData;
}

function search() {
    readTextFile("dataset.json", function(text){
        var dataset = JSON.parse(text)
        loadDataset(searchAttribute(document.getElementById('search-bar-input').value, dataset)) 
    })
}