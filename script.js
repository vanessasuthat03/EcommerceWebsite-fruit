$(document).ready(function() {

    $.getJSON("dataBas.json", function(productList) {

        if(localStorage.getItem("cartArr") === null) {
            localStorage.setItem('cartArr', '[]')
        }

        // 1. Loopa ut alla etiketter med respektive produkt, hämtade från json-filen (productList)
        for (let i = 0; i < productList.length; i++) {
            const etiquetteHolder = $("#etiquette-holder")
            etiquetteHolder.append(
                `<div>
                    <img src="${productList[i].img}">
                    <h3>${productList[i].productName}</h3>
                    <p>${productList[i].price}</p>
                    <button id="decrease${i}">-</button>
                    <input id="${i}" class="inputQuant" type="number" min="1" max="999" value="1">
                    
                    <button class="" id="increase${i}">+</button>
                    <br>
                    <button class="addBtn" id="add${i}">Lägg till</button>
                </div`
            )
        }

        // 2. Loopa också ut varukorgen
        
        createCart()

        // 3. Lägg till eventlisteners
        const addBtns = $(".addBtn")

        addBtns.click(function(addBtn) {
            addToCart(this)
        })

        function addToCart(addBtn) {
            // Cache:a antal, produkt och pris

            let inputField = $(addBtn).siblings("input")
            let $price = $(addBtn).siblings("p")
            let newQty = inputField.val()
            let newProduct = $(addBtn).siblings("h3").text()
            let newPrice = $price.text()

            if (newQty === '0') {
                showMessage("Vänligen ange antal Tack!", "danger")
            } else {

                const cartArr = JSON.parse(localStorage.getItem("cartArr")) // hämta nuvarande localStorage

                if(duplicateExists(cartArr, newProduct)) { // om den hittar en produkt-dublett

                    if(confirm('Vill du ersätta? OK=ERSÄTT  AVBRYT=MERGE')) {
                        replaceProduct(cartArr, newProduct, newQty, newPrice)
                        showMessage("Produkten har lagts till i varukorgen.", "success")
                    } else {
                        mergeProduct(cartArr, newProduct, newQty, newPrice)
                        showMessage("Produkten har lagts till i varukorgen.", "success")
                    }

                } else {
                    cartArr.unshift({ quantity: newQty, product: newProduct, price: newPrice }) // lägg in ett objekt med info om tillägget (i slutet av arrayen)
                    localStorage.setItem("cartArr", JSON.stringify(cartArr)) // skicka arrayen till localStorage
                    showMessage("Produkten har lagts till i varukorgen.", "success")
                    createCart()

                    // och lägg till i vår table-tag

                    // $("table").append(
                    //     `<tr>
                    //         <td>${newQty}</td>
                    //         <td>${newProduct}</td>
                    //         <td>${newPrice}</td>
                    //         <td><button id="dltBtn">Delete</td>
                    //     </tr>`
                    // )

                    // Vanessa: Alternativ: skapar ny rad i tbody och lägger in produkter

                    // const list = document.querySelector("#cart-items-holder")
                    // const row = document.createElement("tr")
                    // row.innerHTML = `

                    // <td>${newProduct}</td>
                    // <td>${newQty}</td>
                    // <td>${newPrice}</td>
                    // <td><button id="dltBtn" class="btn btn-danger btn-sx delete" >Delete</td>`
                    // list.prepend(row)
                }
            }
        }

        // Delete from varukorg
        document.querySelector("#cart-items-holder").addEventListener("click", e => {
            console.log(e.target)
            if (e.target.classList.contains("delete")) {
                // let cartArr = JSON.parse(localStorage.getItem('cartArr'))
                // let targetProduct = e.target.parentElement.parentElement.firstElementChild.innerHTML
                // let targetProductInfo = cartArr.find(function(element) {
                //     return element.product === targetProduct
                // })
                // let indexoftargetProductInfo = cartArr.indexOf(targetProductInfo)
                // cartArr.splice(indexoftargetProductInfo, 1)
                // localStorage.setItem('cartArr', JSON.stringify(cartArr))
                e.target.parentElement.parentElement.remove()
                deleteItem(e.target.parentElement.parentElement)
            }
        })

        let inputFields = $(".inputQuant")

        inputFields.on("input", function() {
            let $inputField = $(this)
            let $price = $inputField.siblings("p")
            let unitPrice = parseInt(
                productList[parseInt($inputField.attr("id"))].price
            )

            if($inputField.val() === "") {
                $inputField.val("1")
            }

            $price.text(`${parseInt($inputField.val()) * unitPrice}`)
        })

        function createCart() {
            const cartArr = JSON.parse(localStorage.getItem('cartArr'))
            const $cart = $('#cart-items-holder')
            let content = ''

            for(let i = 0; i < cartArr.length; i++) {
                content +=
                    `<tr>
                        <td>${cartArr[i].product}</td>
                        <td>${cartArr[i].quantity}</td>
                        <td>${cartArr[i].price}</td>
                        <td><button id="dltBtn" class="btn btn-danger btn-sx delete">Delete</td>
                    </tr>`
            }
            $cart.html(content)
        }

        // Vanessa: Lägger till popup message
        function showMessage(message, className) {
            const div = document.createElement("div")
            div.className = `alert alert-${className}`
            div.appendChild(document.createTextNode(message))
            const cart = document.querySelector(".cart")
            const table = document.querySelector("#getLocal")
            cart.insertBefore(div, table)
            setTimeout(() => document.querySelector(".alert").remove(), 3000)

            console.log(showMessage)
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

        function duplicateExists(cartArr, newProduct) {
            return cartArr.find(element => { return element.product === newProduct}) // Returnerar truthy eller falsy
        }

        function replaceProduct(cartArr, newProduct, newQty, newPrice) {
            cartArr.find(function (element, index) { // Loopa igenom varukorgen (Local Storage)
                if(element.product === newProduct) { // IFALL produkten i varukorgen === produkten man lägger till
                    cartArr.splice(index, 1) // ta bort produkten ur varukorgen 
                    cartArr.unshift({ quantity: newQty, product: newProduct, price: newPrice }) // och lägg till nya produkten i början av varukorgen
                }
            })
            localStorage.setItem('cartArr', JSON.stringify(cartArr)) // Skicka nya listan till Local Storage
            createCart()
        }

        function mergeProduct(cartArr, newProduct, newQty, newPrice) {
            cartArr.find(function (element, index) { // Loopa igenom varukorgen (Local Storage)
                if(element.product === newProduct) { // IFALL produkten i varukorgen === produkten man lägger till
                    const qtySum = parseInt(newQty)+parseInt(element.quantity) // addera antalen
                    const priceSum = parseInt(newPrice)+parseInt(element.price) // och addera priset
                    cartArr.splice(index, 1, { quantity: qtySum, product: element.product, price: priceSum }) // Ta bort produkten ur varukorgen och ersätt det med de nya värdena
                }
            })
            localStorage.setItem('cartArr', JSON.stringify(cartArr)) // Skicka nya listan till Local Storage
            createCart()
        }

        function getProductInfo(targetProduct) {
            return productList.find(function(element) {
                return element.productName === targetProduct
            })
        }

    })
})