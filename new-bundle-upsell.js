window.addEventListener("load", (event) => {
    setTimeout(function () {
      // Function to get the variant data based on product ID, size, and color
      function getVariantData(productId, size, color) {
        const variants = variantData[productId];
        if (!variants) return null;
  
        for (let variant of variants) {
          if (variant.size === size && variant.color === color) {
            return variant;
          }
        }
        return null;
      }
  
      const addToCartButton = document.querySelector("#add-bundle-to-cart");
      const products = document.querySelectorAll(".product__item");
      const selectedProducts = [];
  
      // Function to update checkbox availability based on selected size and color
      function updateCheckboxAvailability(
        product,
        product_id,
        sizeCheckboxes,
        colorCheckboxes,
        index
      ) {
        const selectedSize = product.querySelector(
          `input[name="size_product_${product_id}"]:checked`
        );
        const selectedColor = product.querySelector(
          `input[name="color_product_${product_id}"]:checked`
        );
  
        // Update size checkboxes based on selected color
        sizeCheckboxes.forEach((sizeCheckbox) => {
          const size = sizeCheckbox.value;
          const variant = selectedColor
            ? getVariantData(product_id, size, selectedColor.value)
            : null;
  
          if (variant && !variant.available) {
            sizeCheckbox.disabled = true;
          } else {
            sizeCheckbox.disabled = false;
          }
        });
  
        // Update color checkboxes based on selected size
        colorCheckboxes.forEach((colorCheckbox) => {
          const color = colorCheckbox.value;
          const variant = selectedSize
            ? getVariantData(product_id, selectedSize.value, color)
            : null;
  
          if (variant && !variant.available) {
            colorCheckbox.disabled = true;
          } else {
            colorCheckbox.disabled = false;
          }
        });
      }
  
      products.forEach((product, index) => {
        const product_id = product.getAttribute("data-product-id");
  
        const sizeCheckboxes = product.querySelectorAll(
          `input[name="size_product_${product_id}"]`
        );
  
        const colorCheckboxes = product.querySelectorAll(
          `input[name="color_product_${product_id}"]`
        );
  
        // Add event listeners to size checkboxes
        sizeCheckboxes.forEach((sizeCheckbox) => {
          sizeCheckbox.addEventListener("change", () => {
            const selectedSize = sizeCheckbox.value;
            const selectedColor = product.querySelector(
              `input[name="color_product_${product_id}"]:checked`
            );
  
            if (selectedColor) {
              const variant = getVariantData(
                product_id,
                selectedSize,
                selectedColor.value
              );
  
              if (variant && variant.available) {
                const existingProductIndex = selectedProducts.findIndex(
                  (product) => product.product_id === product_id
                );
  
                if (existingProductIndex !== -1) {
                  selectedProducts[existingProductIndex].id = variant.variant_id;
                } else {
                  selectedProducts.push({
                    product_id: product_id,
                    id: variant.variant_id,
                    quantity: 1,
                  });
                }
              }
            }
  
            // Update checkbox availability after selecting size
            updateCheckboxAvailability(
              product,
              product_id,
              sizeCheckboxes,
              colorCheckboxes
            );
          });
        });
  
        // Add event listeners to color checkboxes
        colorCheckboxes.forEach((colorCheckbox) => {
          colorCheckbox.addEventListener("change", () => {
            const selectedColor = colorCheckbox.value;
            const selectedSize = product.querySelector(
              `input[name="size_product_${product_id}"]:checked`
            );
  
            if (selectedSize) {
              const variant = getVariantData(
                product_id,
                selectedSize.value,
                selectedColor
              );
  
              if (variant && variant.available) {
                const existingProductIndex = selectedProducts.findIndex(
                  (product) => product.product_id === product_id
                );
  
                if (existingProductIndex !== -1) {
                  selectedProducts[existingProductIndex].id = variant.variant_id;
                } else {
                  selectedProducts.push({
                    product_id: product_id,
                    id: variant.variant_id,
                    quantity: 1,
                  });
                }
              }
            }
  
            // Update checkbox availability after selecting color
            updateCheckboxAvailability(
              product,
              product_id,
              sizeCheckboxes,
              colorCheckboxes,
              index
            );
          });
        });
  
        // Initial checkbox availability check
        updateCheckboxAvailability(
          product,
          product_id,
          sizeCheckboxes,
          colorCheckboxes
        );
  
        // const checkboxes = product.querySelectorAll("input");
  
        // checkboxes.forEach((checkbox_btn) => {
        //   checkbox_btn.addEventListener("change", (event) => {
        //     const selectedSize = product.querySelector(
        //       `input[name="size_product_${product_id}"]:checked`
        //     );
        //     const selectedColor = product.querySelector(
        //       `input[name="color_product_${product_id}"]:checked`
        //     );
  
        //     if (selectedSize && selectedColor) {
        //       // console.log(selectedSize);
        //       // console.log(selectedColor);
  
        //       const size = selectedSize.value;
        //       const color = selectedColor.value;
        //       const variantId = getVariantId(`${product_id}`, size, color);
  
        //       if (variantId) {
        //         //   selectedProducts.push({
        //         //     id: variantId,
        //         //     quantity: 1,
        //         //     product_id: product_id,
        //         //   });
  
        //         const existingProductIndex = selectedProducts.findIndex(
        //           (product) => product.product_id === product_id
        //         );
  
        //         if (existingProductIndex !== -1) {
        //           // Update the existing entry
        //           selectedProducts[existingProductIndex].id = variantId;
        //         } else {
        //           // Add a new entry
        //           selectedProducts.push({
        //             product_id: product_id,
        //             id: variantId,
        //             quantity: 1,
        //           });
        //         }
        //       }
  
        //       console.log(selectedProducts);
        //     }
        //   });
        // });
      });
  
      // Free Product Script
      const freeGiftCheckbox = document.querySelector(".mid-free_checkbox");
      const freeProduct = {
        product_id: freeGiftCheckbox.id,
        id: freeGiftCheckbox.value,
        quantity: 1,
      };
  
      freeGiftCheckbox.addEventListener("change", () => {
        if (freeGiftCheckbox.checked) {
          freeGiftCheckbox.setAttribute("checked", "checked");
          const free_product = selectedProducts.push(freeProduct);
          
        } else {
          freeGiftCheckbox.removeAttribute("checked");
          const index = selectedProducts.findIndex(
            (product) => product.id === freeProduct.id
          );
          if (index !== -1) {
            selectedProducts.splice(index, 1);
          }
          
        }
        console.log(selectedProducts);
      });
  
      addToCartButton.addEventListener("click", function (e) {
        e.preventDefault();
  
        const lineItems = selectedProducts.map((product) => {
          return {
            id: product.id,
            quantity: 1,
          };
        });
  
        console.log(lineItems);
  
        const cartData = {
          cart: {
            items: lineItems,
          },
        };
  
        fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify(cartData.cart),
        })
          .then((response) => response.json())
          .then((data) => {
            // window.location.href = "/cart";
            console.log(data);
            document.documentElement.dispatchEvent(
              new CustomEvent("cart:refresh", {
                bubbles: true,
              })
            );
  
            document.documentElement.dispatchEvent(
              new CustomEvent("product:added", {
                bubbles: true,
                detail: {
                  quantity: 1,
                },
              })
            );
          })
          .catch((error) => {
            // Handle errors
            console.error(error);
          });
      });
    }, 500);
  });
  