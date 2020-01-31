$(document).ready(function() {
    localStorage.setItem('name', 'Birk')
    $.getJSON('dataBas.json', function(response) {
        console.log(response) // resp = object
        console.log(response.products[0].productName)
        for(let i = 0; i < response.products.length; i++) {
            const etiquetteHolder = $('#etiquette-holder')
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
        }
        
        let addBtns = $('.addBtn')
        console.log(addBtns)
        //console.log($('#add0'))
        //console.log(document.querySelector('#add0'))
        addBtns.click(function(){
            $('#' + this.id).siblings('input')[0].value
        })

    }) 
})