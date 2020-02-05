$(document).ready(function() {
    $.getJSON("dataBas.json", function(productList) {
        if (localStorage.getItem("cartArr") === null) {
            localStorage.setItem("cartArr", "[]");
        };
        for (let i = 0; i < productList.length; i++) { // 1. Loopa ut alla etiketter med respektive produkt, hämtade från json-filen (productList)
            const etiquetteHolder = $("#etiquette-wrapper");
            etiquetteHolder.append(
                `<li class="card">
                    <img src="${productList[i].img}">
                    <div class="card-body">
                        <h3 class="card-title">${productList[i].productName}</h3>
                        <p class="card-text">${productList[i].price} kr</p>
                        <input id="${i}" class="inputQuant" type="number" min="1" value="1">
                        <button class="addBtn btn btn-primary" id="add${i}">Lägg till</button>
                    </div>
                </li`
            );
        };
        createCart(); // 2. Loopa också ut varukorgen

        $(".addBtn").click(function() {
            addToCart(this);
        });

        $("#toggle-cart-btn").click(function() {
            $(".cart").slideToggle(800);
        });

        $("#emptyCart").click(function() {
            localStorage.setItem("cartArr", "[]");
            createCart();
        });

        $(".inputQuant").on("input", function() {
            const $inputField = $(this);
            const $price = $inputField.siblings("p");
            const unitPrice = parseInt(productList[parseInt($inputField.attr("id"))].price);
            
            if ($inputField.val() === "") {
                $inputField.val("1");
            };
            $price.text(`${parseInt($inputField.val()) * unitPrice}`);
        });
        // Delete from varukorg
        document.querySelector("#cart-items-holder").addEventListener("click", e => {
            if (e.target.classList.contains("delete")) {
                // let cartArr = JSON.parse(localStorage.getItem('cartArr'))
                // let targetProduct = e.target.parentElement.parentElement.firstElementChild.innerHTML
                // let targetProductInfo = cartArr.find(function(element) {
                //     return element.product === targetProduct
                // })
                // let indexoftargetProductInfo = cartArr.indexOf(targetProductInfo)
                // cartArr.splice(indexoftargetProductInfo, 1)
                // localStorage.setItem('cartArr', JSON.stringify(cartArr))
                e.target.parentElement.parentElement.remove();
                deleteItem(e.target.parentElement.parentElement);
                createCart();
            };
        });

        function addToCart(addBtn) {
            let inputField = $(addBtn).siblings("input");
            let $price = $(addBtn).siblings("p");
            let newQty = inputField.val();
            let newProduct = $(addBtn).siblings("h3").text();
            let newPrice = $price.text();

            if (newQty === "0") {
                showMessage("Vänligen ange antal Tack!", "danger");
            } else {
                const cartArr = JSON.parse(localStorage.getItem("cartArr")); // hämta nuvarande localStorage
                if (duplicateExists(cartArr, newProduct)) { // om den hittar en produkt-dublett
                    if (confirm("Vill du ersätta? OK=ERSÄTT  AVBRYT=MERGE")) {
                        replaceProduct(cartArr, newProduct, newQty, newPrice);
                        showMessage("Produkten har lagts till i varukorgen.", "success");
                    } else {
                        mergeProduct(cartArr, newProduct, newQty, newPrice);
                        showMessage("Produkten har lagts till i varukorgen.", "success");
                    };
                } else {
                    cartArr.unshift({quantity: newQty, product: newProduct, price: newPrice}); // lägg in ett objekt med info om tillägget (i början av arrayen)
                    localStorage.setItem("cartArr", JSON.stringify(cartArr)); // skicka arrayen till localStorage
                    showMessage("Produkten har lagts till i varukorgen.", "success");
                    createCart();
                };
            };
        };
        // Vanessa: Lägger till popup message
        function showMessage(message, className) {
            const div = document.createElement("div");
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));
            const cart = document.querySelector(".cart");
            const table = document.querySelector("#getLocal");
            cart.insertBefore(div, table);
            setTimeout(() => document.querySelector(".alert").remove(), 3000);
        };

        function createCart() {
            const cartArr = JSON.parse(localStorage.getItem("cartArr"));
            const $cart = $("#cart-items-holder");
            let content = "";
            let totalCost = 0;

            for (let i = 0; i < cartArr.length; i++) {
                content += 
                    `<tr><td>${cartArr[i].product}</td><td>`;
                if (cartArr[i].quantity != 1) {
                    content += '<button class="decrease">-</button>';
                };
                content += 
                            `<span>${cartArr[i].quantity}</span>
                            <button class="increase">+</button>
                        </td>
                        <td>${cartArr[i].price} kr</td>
                        <td>
                            <button id="dltBtn" class="btn btn-danger btn-sx delete">Delete</button>
                        </td>
                    </tr>`;
                totalCost += parseInt(cartArr[i].price);
            };
            $("#total").text("Totalt:" + " " + totalCost + " kr");
            $cart.html(content);

            $(".decrease").click(function() {
                const $btn = $(this);
                const qty = $btn.next().text();
                const product = $btn.parent().prev().text();
                const price = $btn.parent().next().text();
                const newPrice = parseInt(price) - parseInt(getProductInfo(product).price);
                const newQty = parseInt(qty) - 1;

                replaceProduct(cartArr, product, newQty, newPrice);
                createCart();
            });

            $(".increase").click(function() {
                $btn = $(this);
                const qty = $btn.prev().text();
                const product = $btn.parent().prev().text();
                const price = $btn.parent().next().text();
                const newPrice = parseInt(price) + parseInt(getProductInfo(product).price);
                const newQty = parseInt(qty) + 1;

                replaceProduct(cartArr, product, newQty, newPrice);
                createCart();
            });
        };

        function duplicateExists(cartArr, newProduct) {
            return cartArr.find(element => element.product === newProduct); // Returnerar truthy eller falsy
        };

        function replaceProduct(cartArr, newProduct, newQty, newPrice) {
            cartArr.find(function(element, index) { // Loopa igenom varukorgen (Local Storage)
                if (element.product === newProduct) { // IFALL produkten i varukorgen === produkten man lägger till
                    cartArr.splice(index, 1, {quantity: newQty, product: newProduct, price: newPrice}); // ta bort produkten ur varukorgen
                };
            });
            localStorage.setItem("cartArr", JSON.stringify(cartArr)); // Skicka nya listan till Local Storage
            createCart();
        };

        function mergeProduct(cartArr, newProduct, newQty, newPrice) {
            cartArr.find(function(element, index) { // Loopa igenom varukorgen (Local Storage)
                if (element.product === newProduct) { // IFALL produkten i varukorgen === produkten man lägger till
                    const qtySum = parseInt(newQty) + parseInt(element.quantity); // addera antalen
                    const priceSum = parseInt(newPrice) + parseInt(element.price); // och addera priset
                    cartArr.splice(index, 1, {quantity: qtySum, product: element.product, price: priceSum}); // Ta bort produkten ur varukorgen och ersätt det med de nya värdena
                };
            });
            localStorage.setItem("cartArr", JSON.stringify(cartArr)); // Skicka nya listan till Local Storage
            createCart();
        };
        // Delete from local storage
        function deleteItem(fruitItem) {
            let product = fruitItem.firstChild.nextElementSibling.textContent;
            let cartArr = JSON.parse(localStorage.getItem("cartArr"));

            cartArr.forEach(function(fruit, index) {
                if (fruit.product === product) {
                    cartArr.splice(index, 1);
                } else {
                    console.log( "Frukten från localStorage och varokorgen stämmer inte");
                };
            });
            localStorage.setItem("cartArr", JSON.stringify(cartArr));
        };

        function getProductInfo(targetProduct) {
            return productList.find(element => element.productName === targetProduct);
        };
    });
});