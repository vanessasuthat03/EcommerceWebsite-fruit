$(document).ready(function() {
    localStorage.clear()
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
            let quantity = $(this).siblings("input").val()
            let price = $(this).siblings("p").text()
            let product = $(this).siblings("h3").text()
            let cartArr = []
            if(localStorage.getItem('cartArr') === null) {
                cartArr.push({quantity: quantity, product: product, price: price})
                localStorage.setItem('cartArr', JSON.stringify(cartArr))
                $('table').append(
                    `<tr>
                        <td>${JSON.parse(localStorage.getItem('cartArr'))[0].quantity}</td>
                        <td>${JSON.parse(localStorage.getItem('cartArr'))[0].product}</td>
                        <td>${JSON.parse(localStorage.getItem('cartArr'))[0].price}</td>
                        <td><button id="dltBtn">Delete</td>
                    </tr>`)
            } else {
                cartArr = JSON.parse(localStorage.getItem('cartArr'))
                const duplicate = cartArr.find(function(element) {
                    return element.product === product
                })
                console.log(duplicate)
                cartArr.push({quantity: quantity, product: product, price: price})
                localStorage.setItem('cartArr', JSON.stringify(cartArr))
                let lastElementIndexInArray = cartArr.length - 1
                $('table').append(
                    `<tr>
                        <td>${JSON.parse(localStorage.getItem('cartArr'))[lastElementIndexInArray].quantity}</td>
                        <td>${JSON.parse(localStorage.getItem('cartArr'))[lastElementIndexInArray].product}</td>
                        <td>${JSON.parse(localStorage.getItem('cartArr'))[lastElementIndexInArray].price}</td>
                        <td><button id="dltBtn">Delete</td>
                    </tr>`)
            }
        })
    })
})
            