document.querySelectorAll(".addToCartBtn").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      const pid = this.getAttribute("data-product-id");

      // Make a POST request to the Add to Cart endpoint
      await fetch(`/api/carts/65b4430c54e41489c7bb5d7a/products/${pid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
        console.log(error.message);
    }
  });
});
