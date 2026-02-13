async function getData() {
    try{
        const response = await fetch("data.json");
        const data = await response.json();

        const card = document.querySelectorAll(".card");

        // thumbnail declare
        function creatThumbnail (name, price, num, image, imgdisplay){
            const thumbnail = document.createElement("div");
            const thumbnailMenu = document.createElement("img");
            const thumbnaildiv = document.createElement("div");
            const thumbnailName = document.createElement("p");
            const thumbnailValue = document.createElement("span");
            const thumbnailPrice = document.createElement("span");
            const thumbnailTotal = document.createElement("span");

            //? bikin svg biar bisa costum color pas hover 
            const remove = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            remove.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            remove.setAttribute("width", "20");
            remove.setAttribute("height", "20");
            remove.setAttribute("viewBox", "0 0 10 10");
            remove.setAttribute("fill", "none");

            remove.setAttribute(
            "class",
            "cursor-pointer border-2 border-Rose-300 text-Rose-300 hover:border-Rose-900 hover:text-Rose-900 p-0.5 rounded-full"
            );

            path.setAttribute("fill", "currentColor");
            path.setAttribute(
            "d",
            "M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
            );

            remove.appendChild(path);
            
            thumbnail.id = name.replace(/\s/g, '');
            thumbnailValue.className = "value";
            thumbnailTotal.className = "total";
            //! karena remove ini svg jadi gabisa make .className, alternatifnya add aja class
            remove.classList.add("remove");
            
            thumbnailName.textContent = `${name} `
            thumbnailValue.textContent = `${num}x `
            thumbnailPrice.textContent = `@ ${(price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})} `;
            thumbnailTotal.textContent = `${(num*price).toLocaleString('en-US', {style: 'currency',currency: 'USD',})}`;
            thumbnailMenu.src = `${image}`;
            thumbnailMenu.style.display = `${imgdisplay}`;

            thumbnail.classList.add("displayThumbnail");
            thumbnaildiv.classList.add("displayThumbnaildiv");
            thumbnailMenu.classList.add("displayThumbnailMenu");
            thumbnailName.classList.add("displayThumbnailName");
            thumbnailValue.classList.add("displayThumbnailValue");
            thumbnailPrice.classList.add("displayThumbnailPrice");
            thumbnailTotal.classList.add("displayThumbnailTotal");
            
            thumbnaildiv.appendChild(thumbnailName);
            thumbnaildiv.appendChild(thumbnailValue);
            thumbnaildiv.appendChild(thumbnailPrice);
            thumbnaildiv.appendChild(thumbnailTotal);
            thumbnail.appendChild(thumbnailMenu);
            thumbnail.appendChild(thumbnaildiv);
            thumbnail.appendChild(remove);

            return thumbnail
        }

        let cart = [];
        let totalNum = 0;
        let totalPrice = 0;
        const totalItem = document.getElementById("totalItem");
        const totalItemPrice = document.getElementById("totalItemPrice");
        const totalItemPriceText = totalItemPrice.lastElementChild;
        const totalItemPriceCopy = totalItemPrice.cloneNode(true);
        const orderItem = document.getElementById("orderItem");
        const displayOrder = document.querySelector(".displayOrder");
        const displayEmpty = document.querySelector(".displayEmpty");
        const confirm = document.querySelector(".confirm");
        const popupConfirm = document.querySelector(".popupConfirm");

        //? fungsi misal barangnya 0
        function noneOrder () {
            if (totalNum < 1){
                displayOrder.classList.add("hidden");
                displayOrder.classList.remove("block");
                displayEmpty.classList.add("flex");
                displayEmpty.classList.remove("hidden");
            } else{
                displayOrder.classList.add("block");
                displayOrder.classList.remove("hidden");
                displayEmpty.classList.add("hidden");
                displayEmpty.classList.remove("flex");
            }
        }

        const tabletQuery = window.matchMedia('(min-width: 768px)');
        const desktopQuery = window.matchMedia('(min-width: 1280px)');
        function query(targetimg, desktop, tablet, mobile){
            if(desktopQuery.matches){
                targetimg.src = desktop;
                console.log("desktop");
            }else if (tabletQuery.matches){
                targetimg.src = tablet;
                console.log("tablet");
            }else{
                targetimg.src = mobile;
                console.log("hp");
            };
        };
        tabletQuery.addEventListener('change', query);
        desktopQuery.addEventListener('change', query);
        
        card.forEach((item,index) => {
            const menuImg = item.querySelector(".menuImg");
            const cartButton = item.querySelector(".cartButton");
            const menuCategory = item.querySelector(".menuCategory");
            const menuName = item.querySelector(".menuName");
            const menuPrice = item.querySelector(".menuPrice");
            const value = item.querySelector(".value");
            const add = item.querySelector(".add");
            const plus = item.querySelector(".plus");
            const minus = item.querySelector(".minus");
            
            query(menuImg, data[index].image.desktop, data[index].image.tablet, data[index].image.mobile);
            menuCategory.textContent = `${data[index].category}`;
            menuName.textContent = `${data[index].name}`;
            menuPrice.textContent = `${(data[index].price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`;

            function btnDisplay (addflex, addhidden, hidden, inline, addCart, removeCart, imgSelect = null){
                add.classList.add(addflex);
                add.classList.remove(addhidden);

                plus.classList.add(hidden);
                plus.classList.remove(inline);

                minus.classList.add(hidden);
                minus.classList.remove(inline);

                value.classList.add(hidden);
                value.classList.remove(inline);

                cartButton.classList.add(addCart);
                cartButton.classList.remove(removeCart);

                if(imgSelect){
                    menuImg.classList.add(imgSelect)
                }else{
                    menuImg.classList.remove("imgSelected")
                };
            };
            
            let num = 0;
            let product = creatThumbnail(data[index].name, data[index].price, num, data[index].image.thumbnail, "none");
            const removeBtn = product.querySelector(".remove")

            removeBtn.addEventListener("click", () => {
                totalNum -= num;
                totalPrice -= num*data[index].price;
                num = 0;

                btnDisplay ("flex", "hidden", "hidden", "inline", "addCartButton", "removeCartButton");
                
                cart = cart.filter(itemID => itemID !== product.id);
                product.remove();
                
                totalItem.textContent = `Your Cart (${totalNum})`;
                totalItemPriceText.textContent = `${totalPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`;

                noneOrder();
            });

            add.addEventListener("click", () => {
                num = 1; 
                totalNum ++; 
                totalPrice += data[index].price;

                product.querySelector(".value").textContent = "1x ";
                product.querySelector(".total").textContent = (data[index].price).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                value.textContent = `${1}`

                document.getElementById("carts").insertBefore(product, displayOrder);
                cart.push(product.id);

                btnDisplay ("hidden", "flex", "inline", "hidden", "removeCartButton", "addCartButton", "imgSelected");

                totalItem.textContent = `Your Cart (${totalNum})`;
                totalItemPriceText.textContent = `${totalPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`;

                noneOrder();
            });
            
            minus.addEventListener("click", () => {
                if (num < 2){ //! kondisi kalo barang sampai 0 -------------
                    totalNum -= num;
                    totalPrice -= num*data[index].price;
                    num = 0;

                    btnDisplay ("flex", "hidden", "hidden", "inline", "addCartButton", "removeCartButton");

                    cart = cart.filter(itemID => itemID !== product.id);
                    product.remove(); //? opsi ini lebih aman buat remove
                    //todo opsi lain dibawah
                    // document.getElementById("tes").removeChild(document.getElementById(product.id));
                }else{
                    num --;
                    totalNum --;
                    totalPrice -= data[index].price;
                    value.textContent = `${num}`
                    
                    document.getElementById(product.id).querySelector(".value").textContent = `${num}x `
                    document.getElementById(product.id).querySelector(".total").textContent = `${(num*data[index].price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`
                };
                totalItem.textContent = `Your Cart (${totalNum})`;
                totalItemPriceText.textContent = `${totalPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`;

                noneOrder();
            });

            plus.addEventListener("click", () => {
                noneOrder();
                num ++;
                totalNum ++;
                totalPrice += data[index].price
                
                value.textContent = `${num}`;
                document.getElementById(product.id).querySelector(".value").textContent = `${num}x `
                document.getElementById(product.id).querySelector(".total").textContent = `${(num*data[index].price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`
                totalItem.textContent = `Your Cart (${totalNum})`;
                totalItemPriceText.textContent = `${totalPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`;

                noneOrder();
            });
            
        });
        confirm.addEventListener("click", () => {
            popupConfirm.classList.add("block");
            popupConfirm.classList.remove("hidden");
            popupConfirm.classList.add("min-[795px]:flex");
            popupConfirm.classList.remove("min-[795px]:hidden");
            console.log(cart);

            cart.forEach ((item) => {
                let cloneProduct = document.getElementById(item).cloneNode(true);
                cloneProduct.id = item + `-confirm`;

                cloneProduct.children[0].style.display = "block";
                cloneProduct.children[2].classList.add("hidden");
                cloneProduct.children[1].children[3].classList.add("ml-auto");
                cloneProduct.appendChild(cloneProduct.children[1].children[3]);
                orderItem.appendChild(cloneProduct);
            });

            orderItem.appendChild(totalItemPriceCopy);
            totalItemPriceCopy.lastElementChild.textContent = `${totalPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`;
            totalItemPriceCopy.classList.add("pt-6");
        });

    }
    catch (error) {
        console.error("Error ini boyyy:", error);
    }
}

getData();