$(document).ready(function() {
    $.getJSON("dataBase.json", function(productList) {
        const $table = $('tbody');
        const cartArr = JSON.parse(localStorage.getItem('cartArr'));
        let totalCost = 0;

        for(let i = 0; i < cartArr.length; i++) {
            const imgUrl = getProductInfo(cartArr[i].product).img;

            totalCost += cartArr[i].price;
            $table.append(
                `<tr>
                    <td><img src="${imgUrl}"></td>
                    <td>${cartArr[i].product}</td>
                    <td>${cartArr[i].quantity}</td>
                    <td>${cartArr[i].price}</td>
                </tr>`
            );
        };
        $('span').html(`Totalt: ${totalCost}`);

        $('a').click(function() {
            localStorage.setItem('cartArr', '[]');
        });

        function getProductInfo(targetProduct) {
            return productList.find(element => element.product === targetProduct);
        };
    });
});