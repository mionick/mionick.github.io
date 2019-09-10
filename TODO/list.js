
// Moves an element in an array from one index to another.
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

var categories = {};
function displayEvents(entries) {
    var body = document.getElementById("todo");
    //Load all objects in the entries json file and organize them into categories.

    //Buid each node. They will not be edited in the browser.
    var node;
    var metadata;
    var key;
    var value;
    var d; // The 0 there is the key, which sets the date to the epoch

    var masterList = document.createElement("ul");
    masterList.id = "MasterList"
    body.appendChild(masterList); 
    var liElement;

    var entry;

    for (i = 0; i < entries.length; i++) {
        entry = entries[i];
        var node = document.createElement("div");
        node.className = "node";

        if (entry.Category.includes("Done")) {
            node.className += " done";
        }

        liElement = document.createElement("li");
        liElement.appendChild(node);
        masterList.appendChild(liElement);
        
        key = document.createElement("p");
        key.className = "name";
        key.appendChild(document.createTextNode(entry["Name"]));
        node.appendChild(key);
        
        if (entry.Body) {
            key = document.createElement("div");
            key.className = "body";
            key.innerHTML = entry["Body"];
            node.appendChild(key);
        }

        metadata = document.createElement("div");
        metadata.className = "metaData";




        key = document.createElement("p");
        key.className = "indexNumber";
        key.appendChild(document.createTextNode("index: " + i ));
        metadata.appendChild(key);

        d = new Date(0);
        d.setUTCSeconds(parseInt(entry["Created"] || '0'));
        key = document.createElement("time");
        key.className = "created";
        key.appendChild(document.createTextNode(d));
        metadata.appendChild(key);

        d = new Date(0);
        d.setUTCSeconds(parseInt(entry["Modified"] || '0'));
        key = document.createElement("time");
        key.className = "modified";
        key.appendChild(document.createTextNode(d));
        metadata.appendChild(key);

        node.appendChild(metadata);

        //At this point they have been displayed in the default way. 
        //Now change the nodes to be objects with {diplayable, dates}

        node  = {"element" : node,
                 "created" : parseInt(entry["Created"] || "0"),
                 "modified": parseInt(entry["Modified"] || "0")  };


        // Add the node to each category list that it is part of.
        for (let category of entry.Category) {
            categories[category] = categories[category] || [];
            categories[category].push(node);

            key = document.createElement("p");
            key.appendChild(document.createTextNode(category));
            metadata.insertBefore(key, metadata.firstChild); 

        }
        
    }

    compactMenu('MasterList',false,'&plusmn; ');
    expandCollapseAll('MasterList',true);

    sortByCategory();

    document.getElementById("Expand").addEventListener("click", function() {expandCollapseAll("MasterList",true)});
    document.getElementById("Collapse").addEventListener("click",  function() {expandCollapseAll("MasterList",false)});


}

/*function loading() {

    displayEvents();

}*/

function sortByCategory() {
    var body = document.getElementById("todo");
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    var masterList = document.createElement("ul");
    masterList.id = "MasterList";

    body.appendChild(masterList);


    var liElement;
    var divElement;


    let keys = Object.keys(categories);

    keys.sort();

    keys.move(keys.findIndex(x => { return x === "Done"}), keys.length-1);

    for (let category of keys) {

        var list = document.createElement("ul");
        list.className = "CategoryList"
        list.id = category;

        
        for (let node of categories[category]) {
            liElement = document.createElement("li");
            liElement.appendChild(node.element.cloneNode(true));
            list.appendChild(liElement);
        }
        liElement = document.createElement("li");
        liElement.appendChild(document.createTextNode(category));
        liElement.appendChild(list);
        liElement.id = category + "LI";
        if (category === "Urgent") {
            masterList.insertBefore(liElement, masterList.firstChild); 
        } else {
            masterList.appendChild(liElement); 
        }
        liElement.className = "category-header"
        divElement = document.createElement("div");
        divElement.className = "ClearerDiv";
        liElement.appendChild(divElement);

    }
    compactMenu("MasterList",false,'&plusmn; ');
    stateToFromStr('MasterList',localStorage.getItem('menuState'));
    //expandCollapseAll("MasterList",false);


}

window.onbeforeunload = function () {
  localStorage.setItem('menuState',stateToFromStr('MasterList'));
}

/*if(window.attachEvent) {
    window.attachEvent('onload', loading);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            loading();
        };
        window.onload = newonload;
    } else {
        window.onload = loading;
    }
}
*/