$( document ).ready(function() {
    $("#compare").on('click', function() {

        let queryString1 = $("textarea[name=query-string-1]").val();
        let queryString2 = $("textarea[name=query-string-2]").val();

        try {
            queryString1 = validateQuery(queryString1);
            queryString2 = validateQuery(queryString2);
            
            $("#alert").hide();

            let diff = compare(queryString1, queryString2);
        
            mountTable('table-1', diff);
            mountTable('table-2', diff);

            $("#diff").css({display: "block"});
            $("#compare-form").css({display: "none"});
        } catch (e) {
            $("#alert").html(e).show();
        }
        
    });

    $("#new-diff").on('click', function() {
        $("#diff").css({display: "none"});
        $("#compare-form").css({display: "block"});
    })
})

function mountTable(tableId, diff) {
    let gutter = $(`#${tableId} .gutter pre code`).html("");
    let compareCol = $(`#${tableId} .compare-col pre code`).html("");

    let gutterIndex = 0;

    const rowDisplay = {"display": "table-row"}

    const addRows = (rowsArray, rowClass, otherRowArray = false) => {

        rowsArray.forEach((item, index) => {
            gutterIndex++;
            const { key, values } = item;
            gutter.append(`<span>${gutterIndex}.</span>`).css(rowDisplay);
            if(values.length === 1) {
                compareCol.append(`<span class="${rowClass}">${key}=${values[0]}</span>`).css(rowDisplay);
            } else {
                compareCol.append(`<span class="${rowClass}">${key}=</span>`).css(rowDisplay);
                values.forEach(value => {
                    gutter.append(`<span><br></span>`).css(rowDisplay);
                    compareCol.append(`<span class="${rowClass}">    ${value}</span>`).css(rowDisplay);
                })
            }
            if(otherRowArray !== false)
                fillGapWithBlankRows(item.values, otherRowArray[index].values, rowClass);
        });
    };

    const fillGapWithBlankRows = (valuesArray1, valuesArray2, rowClass) => {
        if(valuesArray2.length > valuesArray1.length) {
            let gap = valuesArray2.length - valuesArray1.length;
            if(valuesArray1.length === 1)
                gap++;
            console.log('gap', gap)
            for(let i = 0; i < gap; i++) {
                gutter.append(`<span><br></span>`).css(rowDisplay);
                compareCol.append(`<span class="${rowClass}"><br></span>`).css(rowDisplay);
            }
        }
    }

    const { equalValuesArray, diffValuesArray1, diffValuesArray2, diffKeysArray1, diffKeysArray2 } = diff;

    addRows(equalValuesArray, 'alert-light');

    if(tableId === 'table-1') {
        addRows(diffValuesArray1, 'alert-danger', diffValuesArray2);
        addRows(diffKeysArray1, 'alert-success', diffKeysArray2);
    } else if(tableId === 'table-2') {
        addRows(diffValuesArray2, 'alert-danger', diffValuesArray1);
        addRows(diffKeysArray2, 'alert-success', diffKeysArray1);
    }
    
    gutter.css({
        "display": "table"
    })

    compareCol.css({
        "display": "table",
        "width": "100%",
        "overflow-x": "scroll"
    });
}

function validateQuery(queryString) {
    queryString = queryString.trim();

    if(!queryString || queryString === "")
        throw "You must fill in both query string fields!";

    pairs = queryString.split('&');

    if ( !pairs.every(pair => pair.match(/=/)) )
        throw "Invalid query strings!"

    return queryString;
}

function compare(queryString1, queryString2) {
    
    let constructQueryArray = queryString => {
        let queryArray = queryString.split('&').map(pair => {
            pair = pair.split('=', 2);

            return {key: pair[0], values: [pair[1]]}
        }).filter(item => item.key) // filters only items that have a key

        // For repeated values
        for(let i = 0; i < queryArray.length; i++) {
            for(let j = 0; j < queryArray.length; j++) {
                if(i != j && queryArray[i].key == queryArray[j].key) {
                queryArray[i].values.push(queryArray[j].values[0])
                queryArray.splice(j, 1);
                j--;
                }
            }
        }

        return queryArray.map(pair => { pair.values.sort(); return pair; } );
    }

    let queryArray1 = constructQueryArray(queryString1)
    let queryArray2 = constructQueryArray(queryString2)

    let equalKeysArray = [];

    for(let i1 = 0; i1 < queryArray1.length; i1++) {
        for(let i2 = 0; i2 < queryArray2.length; i2++) {
            if(queryArray1[i1].key === queryArray2[i2].key) {
                equalKeysArray.push({key: queryArray1[i1].key, values1: queryArray1[i1].values, values2: queryArray2[i2].values});
            }
        }
    }

    let filterEqualValues = item => item.values1.length === item.values2.length && item.values1.every(value1 => item.values2.find(value2 => value1 === value2));
    let equalValuesArray = equalKeysArray.filter(filterEqualValues).map(item => ({key: item.key, values: item.values1}))

    let filterDiffValues = item => item.values1.length !== item.values2.length || item.values1.find((value1, idx) => value1 !== item.values2[idx]);
    let diffValuesArray1 = equalKeysArray.filter( filterDiffValues ).map( item => ( { key: item.key, values: item.values1 } ) )
    let diffValuesArray2 = equalKeysArray.filter( filterDiffValues ).map( item => ( { key: item.key, values: item.values2 } ) )

    let filterDiffKey = item => {
        for(let i = 0; i < equalKeysArray.length; i++) {
            if(item.key === equalKeysArray[i].key)
                return false;
        }
        return true;
    }
    
    let diffKeysArray1 = queryArray1.filter(filterDiffKey);
    let diffKeysArray2 = queryArray2.filter(filterDiffKey);

    return { equalValuesArray, diffValuesArray1, diffValuesArray2, diffKeysArray1, diffKeysArray2 };
}
