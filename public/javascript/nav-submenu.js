document.addEventListener("DOMContentLoaded", function () {
    const shopMenu = document.querySelector("#shop-sub-menu");
    const submenu = document.querySelector(".submenu");

    shopMenu.addEventListener("click", function (event) {
        event.stopPropagation(); // Diğer tıklama olaylarını engelle
        submenu.style.display = submenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function () {
        submenu.style.display = "none"; // Menü dışına tıklanınca kapat
    });
});

