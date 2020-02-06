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
                        <h3 class="card-title">${productList[i].product}</h3>
                        <p class="card-text">${productList[i].price} kr</p>
                        <input class="inputQuant" type="number" min="1" value="1">
                        <button class="addBtn btn btn-primary">Lägg till</button>
                    </div>
                </li`
            );
        };
        createCart(); // 2. Loopa också ut varukorgen
        // Eventlisteners nedan:
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
            const product = $inputField.siblings("h3").text();
            const unitPrice = getProductInfo(product).price;
            
            if ($inputField.val() === "") {
                $inputField.val("1");
            };
            $price.text(`${$inputField.val() * unitPrice} kr`);
        });
        // Lägger till en produktbeställning i localStorage
        function addToCart(addBtn) {
            const $inputField = $(addBtn).siblings("input");
            const $priceElement = $(addBtn).siblings("p");
            const qty = parseInt($inputField.val());
            const product = $(addBtn).siblings("h3").text();
            const price = getProductInfo(product).price * qty;

            if (qty === 0) {
                showMessage("Vänligen ange antal Tack!", "danger");
            } else {
                const cartArr = JSON.parse(localStorage.getItem("cartArr")); // hämta nuvarande localStorage
                if (duplicateExists(cartArr, product)) { // om den hittar en produkt-dublett
                    if (confirm("Vill du ersätta? OK=ERSÄTT  AVBRYT=MERGE")) {
                        replaceProduct(cartArr, product, qty, price);
                        createCart()
                        showMessage("Produkten har lagts till i varukorgen.", "success");
                    } else {
                        mergeProduct(cartArr, product, qty, price);
                        createCart()
                        showMessage("Produkten har lagts till i varukorgen.", "success");
                    };
                } else {
                    cartArr.unshift({quantity: qty, product: product, price: price}); // lägg in ett objekt med info om tillägget (i början av arrayen)
                    localStorage.setItem("cartArr", JSON.stringify(cartArr)); // skicka arrayen till localStorage
                    createCart();
                    showMessage("Produkten har lagts till i varukorgen.", "success");
                };
            };
            $inputField.val(1)
            $priceElement.text(`${getProductInfo(product).price} kr`)
        };
        // Lägger till popup message
        function showMessage(message, className) {
            $('table').before(`<div class="alert alert-${className}">${message}</div>`);
            const $alertElement = $('.alert');
            // const div = document.createElement("div");
            // div.className = `alert alert-${className}`;
            // div.appendChild(document.createTextNode(message));
            // const cart = document.querySelector(".cart");
            // const table = document.querySelector("table");
            // cart.insertBefore(div, table);
            setTimeout(() => $alertElement.remove(), 3000);
        };
        // Skapar varukorgen i HTML utifrån localStorage
        function createCart() {
            const cartArr = JSON.parse(localStorage.getItem("cartArr"));
            const $cart = $("#cart-items-holder");
            let content = "";
            let totalCost = 0;

            for (let i = 0; i < cartArr.length; i++) {
                content += 
                    `<tr><td class="product">${cartArr[i].product}</td><td>`;
                if (cartArr[i].quantity !== 1) {
                    content += '<button class="decrease">-</button>';
                };
                content += 
                            `<span>${cartArr[i].quantity}</span>
                            <button class="increase">+</button>
                        </td>
                        <td>${cartArr[i].price} kr</td>
                        <td>
                            <button class="dltBtn btn btn-danger btn-sx delete">Delete</button>
                        </td>
                    </tr>`;
                totalCost += cartArr[i].price;
            };
            $("#total").text("Totalt:" + " " + totalCost + " kr");
            $cart.html(content);

            $(".decrease").click(function() {
                const $btn = $(this);
                const product = $btn.parent().prev().text();
                const newQty = parseInt($btn.next().text()) - 1;
                const newPrice = newQty * getProductInfo(product).price;

                replaceProduct(cartArr, product, newQty, newPrice);
                createCart();
            });

            $(".increase").click(function() {
                const $btn = $(this);
                const product = $btn.parent().prev().text();
                const newQty = parseInt($btn.prev().text()) + 1;
                const newPrice = newQty * getProductInfo(product).price;

                replaceProduct(cartArr, product, newQty, newPrice);
                createCart();
            });

            $(".dltBtn").click(function() {
                const targetProduct = $(this).parent().siblings('.product').text();

                deleteItem(cartArr, targetProduct);
                createCart();
            });
        };
        // Kollar om en produkt redan finns i localStorage
        function duplicateExists(cartArr, targetProduct) {
            return cartArr.find(element => element.product === targetProduct); // Returnerar truthy eller falsy
        };
        // Ersätter en produktbeställning med den nya, i localStorage
        function replaceProduct(cartArr, targetProduct, newQty, newPrice) {
            cartArr.forEach(function(element, index) { // Loopa igenom varukorgen (Local Storage)
                if (element.product === targetProduct) { // IFALL produkten i varukorgen === produkten man lägger till
                    cartArr.splice(index, 1, {quantity: newQty, product: targetProduct, price: newPrice}); // ta bort produkten ur varukorgen
                };
            });
            localStorage.setItem("cartArr", JSON.stringify(cartArr)); // Skicka nya listan till Local Storage
        };
        // Slår ihop två produktbeställningar i localStorage
        function mergeProduct(cartArr, targetProduct, newQty, newPrice) {
            cartArr.forEach(function(element, index) { // Loopa igenom varukorgen (Local Storage)
                if (element.product === targetProduct) { // IFALL produkten i varukorgen === produkten man lägger till
                    const qtySum = newQty + element.quantity; // addera antalen
                    const priceSum = newPrice + element.price; // och addera priset
                    cartArr.splice(index, 1, {quantity: qtySum, product: targetProduct, price: priceSum}); // Ta bort produkten ur varukorgen och ersätt det med de nya värdena
                };
            });
            localStorage.setItem("cartArr", JSON.stringify(cartArr)); // Skicka nya listan till Local Storage
        };
        // Delete from local storage
        function deleteItem(cartArr, targetProduct) {
            cartArr.forEach((element, index) => {
                if (element.product === targetProduct) {
                    cartArr.splice(index, 1);
                };
            });
            localStorage.setItem("cartArr", JSON.stringify(cartArr));
        };
        // Hämtar produktinfo från JSON-filen
        function getProductInfo(targetProduct) {
            return productList.find(element => element.product === targetProduct);
        };
    });
});