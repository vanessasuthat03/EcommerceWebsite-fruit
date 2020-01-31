$(document).ready(function() {
    $.getJSON("dataBas.json", function(response) {
        // console.log(response) // resp = object
        for (let i = 0; i < response.products.length; i++) {
            const etiquetteHolder = $("#etiquette-holder")
            etiquetteHolder.append(`
                <div>
                    <img src="${response.products[i].img}">
                    <h3>${response.products[i].productName}</h3>
                    <p>${response.products[i].price}</p>
                    <button id="decrease${i}">-</button>
                    <input id="${i}">
                    
                    <button class="" id="increase${i}">+</button>
                    <br>
                    <button class="addBtn" id="add${i}">Lägg till</button>
                </div`)
        }
        let addBtns = $('.addBtn')

        addBtns.click(function(){
            let inputValue = $("#" + this.id).siblings("input")[0].value
            console.log(inputValue)
            let price = $("#" + this.id).siblings("p")[0].textContent
            console.log(price)
            let name = $("#" + this.id).siblings("h3")[0].textContent
            console.log(name)
        })
    })
})
            