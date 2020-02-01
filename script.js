$(document).ready(function() {
    localStorage.clear()
    $.getJSON("dataBas.json", function(response) {

        // 1. Loopa ut alla etiketter med respektive produkt, hämtade från json-filen (vår response)

        for (let i = 0; i < response.products.length; i++) {
            const etiquetteHolder = $("#etiquette-holder")
            etiquetteHolder.append(
                `<div>
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

        // 2. Lägg till eventlistener på alla "Lägg till"-knappar för att skicka data till localStorage

        let addBtns = $('.addBtn')

        addBtns.click(function(){
            addToCart(this)
            
            // const duplicate = cartArr.find(function(element) {
            //     return element.product === newProduct // om frukten redan finns i varukorgen så sparas det objektet i duplicate-variabeln
            // })
        })

    function addToCart(addBtn) {

        // Cache:a antal, produkt och pris

        let newQuantity = $(addBtn).siblings("input").val()
        let newProduct = $(addBtn).siblings("h3").text()
        let newPrice = $(addBtn).siblings("p").text()
        let cartArr = []

        if(localStorage.getItem('cartArr') !== null) { // om cartArr redan finns i localStorage
            cartArr = JSON.parse(localStorage.getItem('cartArr')) // hämta nuvarande localStorage
        }
        cartArr.push({quantity: newQuantity, product: newProduct, price: newPrice}) // lägg in ett objekt med info om tillägget (i slutet av arrayen)
        localStorage.setItem('cartArr', JSON.stringify(cartArr)) // skicka arrayen till localStorage

        // och lägg till i vår table-tag

        $('table').append(
            `<tr>
                <td>${newQuantity}</td>
                <td>${newProduct}</td>
                <td>${newPrice}</td>
                <td><button id="dltBtn">Delete</td>
            </tr>`)
    }
    })
})
            