$(document).ready(function() {
    // localStorage.clear()
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
                <input id="${i}" class="inputQuant" type="number" min="1" max="999" value="1">
                
                <button class="" id="increase${i}">+</button>
                <br>
                <button class="addBtn" id="add${i}">Lägg till</button>
            </div`
            )
        }
        // 2. Loopa också ut varukorgen om det finns någon i localStorage
        if (localStorage.getItem("cartArr") !== null) {
            let cartArr = JSON.parse(localStorage.getItem("cartArr"))
            let $fruitList = $("#fruit-list")

            for (let i = 0; i < cartArr.length; i++) {
                $fruitList.prepend(
                    `<tr>
                        <td>${cartArr[i].product}</td>
                        <td>${cartArr[i].quantity}</td>
                        <td>${cartArr[i].price}</td>
                        <td><button id="dltBtn" class="btn btn-danger btn-sx delete">Delete</td>
                    </tr>`
                )
            }
        }
        // 3. Lägg till eventlistener på alla "Lägg till"-knappar för att skicka data till localStorage
        let addBtns = $(".addBtn")

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
            addToCart(this)
            // if (inputQuantity.val() === "" || isNaN(parseInt(inputQuantity.val()))) {
            //     console.log("hej")
            //     showMesseage("Vänligen ange antal Tack!", "danger")
            // } else {
            //     addToCart(this)
            //     showMesseage("Produkten har lagt till i varukorgen.", "success")
            // }

            // const duplicate = cartArr.find(function(element) {
            //     return element.product === newProduct // om frukten redan finns i varukorgen så sparas det objektet i duplicate-variabeln
            // })
        })

        function addToCart(addBtn) {
            // Cache:a antal, produkt och pris

            let inputField = $(addBtn).siblings("input")
            let $price = $(addBtn).siblings("p")
            let newQuantity = inputField.val()
            let newProduct = $(addBtn)
                .siblings("h3")
                .text()
            let newPrice = $price.text()
            let cartArr = []

            showMesseage("Produkten har lagts till i varukorgen.", "success")
            inputField.val("1")

            let found = response.products.find(function(element) {
                return element.productName === newProduct
            })
            let indexOfFound = response.products.indexOf(found)
            $price.text(response.products[indexOfFound].price)

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
            list.prepend(row)
        }

        // Delete from local storage

        function deleteItem(fruitItem) {
            let product = fruitItem.firstChild.nextElementSibling.textContent
            let cartArr = JSON.parse(localStorage.getItem("cartArr"))

            cartArr.forEach(function(fruit, index) {
                if (fruit.product === product) {
                    cartArr.splice(index, 1)
                } else {
                    console.log(
                        "Frukten från localStorage och varokorgen stämmer inte"
                    )
                }
            })
            localStorage.setItem("cartArr", JSON.stringify(cartArr))
        }

        // Delete from varukorg
        document.querySelector("#fruit-list").addEventListener("click", e => {
            console.log(e.target)
            if (e.target.classList.contains("delete")) {
                e.target.parentElement.parentElement.remove()
                console.log(e.target.parentElement.parentElement)
                deleteItem(e.target.parentElement.parentElement)
            }
        })

        let inputFields = $(".inputQuant")

        inputFields.on("input", function() {
            let $inputField = $(this)
            let $price = $inputField.siblings("p")
            console.log(unitPrice)
            let unitPrice = parseInt(
                response.products[parseInt($inputField.attr("id"))].price
            )

            if ($inputField.val() === "") {
                $inputField.val("1")
            }

            $price.text(`${parseInt($inputField.val()) * unitPrice}`)
        })
    })
})
