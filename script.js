$(document).ready(function() {
    $.getJSON("dataBas.json", function(response) {
        console.log(response) // resp = object
        console.log(response.products[0].productName)
        for (let i = 0; i < response.products.length; i++) {
            const etiquetteHolder = $("#etiquette-holder")
            console.log(etiquetteHolder)
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
            console.log(etiquetteHolder)
        }

        let addBtns = $(".addBtn")
        console.log(addBtns)
        //console.log($('#add0'))
        //console.log(document.querySelector('#add0'))
        addBtns.click(function() {
            $("#" + this.id) // hämtar ett Element i "jQuery-format" för att kunna köra metoden siblings()
                .siblings("input")[0].value // hämtar alla input-element i en "konstig array" med prototypen object // därför kan vi ta index 0 och få första (och i det här fallet det enda) input-elementet i vanligt format // sen kan vi ta value på det
            console.log($("#" + this.id).siblings("input")[0].value)
            let inputValue = $("#" + this.id).siblings("input")[0].value
            console.log(inputValue)

            let price = $("#" + this.id).siblings("p")[0].textContent
            console.log(price)

            let name = $("#" + this.id).siblings("h3")[0].textContent
            console.log(name)
        })
    })
})
