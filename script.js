$(document).ready(function() {
    localStorage.clear()
    $.getJSON("dataBas.json", function(response) {
        // 1. Loopa ut alla etiketter med respektive produkt, hämtade från json-filen (vår response)
        console.log(response)
        for (let i = 0; i < response.products.length; i++) {
            const etiquetteHolder = $("#etiquette-holder")
            etiquetteHolder.append(
                `<div>
                <img src="${response.products[i].img}">
                <h3>${response.products[i].productName}</h3>
                <p>${response.products[i].price}</p>
                <button id="decrease${i}">-</button>
                <input id="${i}" class="inputQuant">
                
                <button class="" id="increase${i}">+</button>
                <br>
                <button class="addBtn" id="add${i}">Lägg till</button>
            </div`
            )
        }
        // 2. Lägg till eventlistener på alla "Lägg till"-knappar för att skicka data till localStorage
        let addBtns = $(".addBtn")
        console.log(addBtns)
        let inputQuantity = $(".inputQuant")
        console.log(inputQuantity)

        // Vanessa: Lägger till popup message
        function showMesseage(message, className) {
            const div = document.createElement("div")
            div.className = `alert alert-${className}`
            div.appendChild(document.createTextNode(message))
            const cart = document.querySelector(".cart")
            const table = document.querySelector("#getLocal")
            cart.insertBefore(div, table)
            setTimeout(() => document.querySelector(".alert").remove(), 3000)

            console.log(showMesseage)
        }

        addBtns.click(function(addBtn) {
            console.log(inputQuantity.val())
            if (inputQuantity.val() === "") {
                console.log("hej")
                showMesseage("Vänligen ange antal Tack!", "danger")
            } else {
                addToCart(this)
                showMesseage("Produkten har lagt till i varukorgen.", "success")
            }

            // const duplicate = cartArr.find(function(element) {
            //     return element.product === newProduct // om frukten redan finns i varukorgen så sparas det objektet i duplicate-variabeln
            // })
        })

        function addToCart(addBtn) {
            // Cache:a antal, produkt och pris

            let newQuantity = $(addBtn)
                .siblings("input")
                .val()
            let newProduct = $(addBtn)
                .siblings("h3")
                .text()
            let newPrice = $(addBtn)
                .siblings("p")
                .text()
            let cartArr = []

            // const duplicate = cartArr.find(function(element) {
            //     console.log("hej")
            // })

            if (localStorage.getItem("cartArr") !== null) {
                // om cartArr redan finns i localStorage
                cartArr = JSON.parse(localStorage.getItem("cartArr")) // hämta nuvarande localStorage
            }
            cartArr.push({
                quantity: newQuantity,
                product: newProduct,
                price: newPrice
            }) // lägg in ett objekt med info om tillägget (i slutet av arrayen)
            localStorage.setItem("cartArr", JSON.stringify(cartArr)) // skicka arrayen till localStorage

            // och lägg till i vår table-tag

            // $("table").append(
            //     `<tr>
            //         <td>${newQuantity}</td>
            //         <td>${newProduct}</td>
            //         <td>${newPrice}</td>
            //         <td><button id="dltBtn">Delete</td>
            //     </tr>`
            // )

            // Vanessa: Alternativ: skapar ny rad i tbody och lägger in produkter

            const list = document.querySelector("#fruit-list")
            const row = document.createElement("tr")
            row.innerHTML = `

            <td>${newProduct}</td>
            <td>${newQuantity}</td>
            <td>${newPrice}</td>
            <td><button id="dltBtn" class="btn btn-danger btn-sx delete" >Delete</td>`
            list.appendChild(row)
        }

        // Delete
        document.querySelector("#fruit-list").addEventListener("click", e => {
            console.log(e.target)
            if (e.target.classList.contains("delete")) {
                e.target.parentElement.parentElement.remove()
            }
        })
    })
})
