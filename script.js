"use strict";
/*
ALI ALGHARIBAWI
COMP125
Assignment 4
*/

let productsContainer = document.getElementById("layout");
let rowContainer = document.createElement("div");
rowContainer.className = "row";
productsContainer.appendChild(rowContainer);

let loadingBarContainer = document.createElement("div");
loadingBarContainer.id = "loading-bar-container";
let loadingBar = document.createElement("div");
loadingBar.id = "loading-bar";
loadingBarContainer.appendChild(loadingBar);
productsContainer.parentNode.insertBefore(
  loadingBarContainer,
  productsContainer
);

let xmlHttp = new XMLHttpRequest();

xmlHttp.onreadystatechange = function () {
  if (xmlHttp.readyState === 4) {
    if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
      let products = JSON.parse(xmlHttp.responseText);

      let fetchPromises = products.map((product) => {
        if (product.actionURL) {
          return fetch(product.actionURL)
            .then((response) => {
              return response.json();
            })
            .then((details) => {
              product.actionURL = details;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });

      Promise.all(fetchPromises)
        .then(() => {
          for (let i = 0; i < products.length; i++) {
            setTimeout(function () {
              buildProductCard();
              updateLoadingBar();
            }, i * 1000);

            function buildProductCard() {
              let product = products[i];
              let productCard = document.createElement("div");
              productCard.className = "product-card";
              let figureBox = document.createElement("figure");
              let productImage = document.createElement("img");
              productImage.className = "product-image";
              productImage.src = product.src;
              productImage.alt = product.alt;
              let imageTitle = document.createElement("figcaption");
              imageTitle.textContent = product.title;
              let productInfo = document.createElement("h4");
              productInfo.textContent = product.description;

              rowContainer.appendChild(productCard);
              productCard.appendChild(figureBox);
              figureBox.appendChild(productImage);
              figureBox.appendChild(imageTitle);
              productCard.appendChild(productInfo);

              if (product.actionLabel) {
                let button = document.createElement("button");
                button.innerHTML = product.actionLabel;
                productCard.appendChild(button);
                button.onclick = createModal;

                function createModal() {
                  let modalWindow = document.createElement("div");
                  modalWindow.id = "detail-overlay";

                  let overlayfigureBox = document.createElement("figure");
                  modalWindow.appendChild(overlayfigureBox);
                  let modalImage = document.createElement("img");
                  modalImage.className = "modalImage";
                  modalImage.src = productImage.src;
                  overlayfigureBox.appendChild(modalImage);
                  let figureCaption = document.createElement("figcaption");
                  figureCaption.textContent = product.actionURL.details;
                  overlayfigureBox.appendChild(figureCaption);

                  let closeBox = document.createElement("div");
                  closeBox.id = "overlay-close";
                  closeBox.innerHTML = "&times;";
                  closeBox.onclick = function () {
                    document.body.removeChild(modalWindow);
                  };
                  modalWindow.appendChild(closeBox);

                  document.body.appendChild(modalWindow);
                }
              }
            }

            function updateLoadingBar() {
              if (Math.floor(loadingBarWidth) < 800) {
                loadingBar.innerHTML = "LOADING..";
                loadingBarWidth += loadingBarIncrement;
                loadingBar.style.width = loadingBarWidth + "%";
                loadingBarFontSize += 0;
                loadingBar.style.fontSize = loadingBarFontSize + "px";
                console.log(Math.floor(loadingBarWidth));
                if (100 <= loadingBarWidth) {
                  productsContainer.parentNode.removeChild(
                    loadingBarContainer,
                    productsContainer
                  );
                }
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      let loadingBarIncrement = 100 / products.length;
      let loadingBarWidth = 0;
      let loadingBarFontSize = 18;
    }
  }
};
xmlHttp.open("get", "products.json");
xmlHttp.send(null);
