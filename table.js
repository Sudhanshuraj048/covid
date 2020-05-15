$(document).ready(function() {
    //get json data from the url
    $.getJSON("https://api.covid19india.org/data.json", function (data) {
        var states = [];
        var confirmed = [];
        var recovered = [];
        var deaths = [];

        var total_active;
        var total_confirmed;
        var total_recovered;
        var total_deaths;
        
        total_active= data.statewise[0].active;
        total_confirmed= data.statewise[0].confirmed;
        total_recovered= data.statewise[0].recovered;
        total_deaths= data.statewise[0].deaths;

        //increased cases
        var increased_confirmed;
        var increased_recovered;
        var increased_deaths;
        
        increased_confirmed= data.statewise[0].deltaconfirmed;
        increased_recovered= data.statewise[0].deltarecovered;
        increased_deaths= data.statewise[0].deltadeaths;
        
        // Intl.NumberFormat().format(total_confirmed)-for converting 1255 to 1,255

        $("#confirmed").append(Intl.NumberFormat().format(total_confirmed));
        $("#active").append(Intl.NumberFormat().format(total_active));
        $("#recovered").append(Intl.NumberFormat().format(total_recovered));
        $("#deaths").append(Intl.NumberFormat().format(total_deaths));


        $("#iconfirmed").append(Intl.NumberFormat().format(increased_confirmed));
        $("#irecovered").append(Intl.NumberFormat().format(increased_recovered));
        $("#ideaths").append(Intl.NumberFormat().format(increased_deaths));

        // The each loop select a single statewise array element
        // Take the data in that array and add it to variables
        $.each(data.statewise, function(id,obj) {
            states.push(obj.state);
            confirmed.push(obj.confirmed);
            recovered.push(obj.recovered);
            deaths.push(obj.deaths);
        });
        // Remove the first element in the states, confirmed, recovered, and deaths as that is the total value
        states.shift();
        confirmed.shift();
        recovered.shift();
        deaths.shift();

        data.statewise.shift();
        

        data.statewise.sort(function(a, b){return a-b}); 
        // for searching any state
        $('#search-input').on('keyup', function(){
            var valu = $(this).val()
            var dat =  searchTable(valu,data.statewise)
            buildTable(dat)
        })
       
        buildTable(data.statewise)
       
        function searchTable(valu,dat){
            var filteredData =[];
            for(var i=0;i<dat.length;i++)
            {
                valu=valu.toLowerCase()
                var name =dat[i].state.toLowerCase()
                
                if(name.includes(valu))
                {
                    filteredData.push(dat[i])
                    
                }
            }
            return filteredData
        }
        //building the table
        function buildTable(value){
            var table = document.getElementById('mytable')
            table.innerHTML ='' //for searching
            for(var i=0; i < value.length; i++)
            {
                var row = `<tr>
                                <td>${value[i].state}</td>
                                <td>
                                
                                <span class="delconf" style="color: #ff073a;">
                                <small><i class="fas fa-arrow-up"></i></small>
                                ${Intl.NumberFormat().format(value[i].deltaconfirmed)}
                                </span>
                                ${Intl.NumberFormat().format(value[i].confirmed)}
                                </td>
                                
                                <td>${Intl.NumberFormat().format(value[i].active)}</td>
                                <td>
                                <span class="delrec" style="color: #009970;">
                                <small><i class="fas fa-arrow-up"></i></small>
                                ${Intl.NumberFormat().format(value[i].deltarecovered)}
                                </span>
                                ${Intl.NumberFormat().format(value[i].recovered)}
                                </td>
                                <td>
                                <span class="deldeath" style="color: #4d4d4d;">
                                <small><i class="fas fa-arrow-up"></i></small>
                                ${Intl.NumberFormat().format(value[i].deltadeaths)}
                                </span>
                                ${Intl.NumberFormat().format(value[i].deaths)}
                                </td>
                                <td>
                                ${parseInt(value[i].confirmed)}
                                </td>
                            </tr>`
                            table.innerHTML += row
            }
                        
                            sortTableByColumn(document.querySelector("table"),5,false);
                            //removing the last column
                            $('table tr').find('td:eq(5),th:eq(5)').remove();
                                        
        }
        /**
 * Sorts a HTML table.
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

        return parseInt(aColText) > parseInt(bColText) ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);
    
    
}

    });
});