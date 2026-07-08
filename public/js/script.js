(() => {
    "use strict";

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll(".needs-validation")

    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();

                }

                form.classList.add("was-validated");
            },
            false
        );
    });
})();


  (function () {
    var header = document.getElementById('airbnbHeader');
    var tabs = document.querySelectorAll('#airbnbTabs .tab');
    var compactSearch = document.querySelector(".compact-search");

    // Collapse the navbar once the page scrolls past 40px
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

        // Expand navbar when compact search is clicked
    compactSearch.addEventListener("click", function () {
        header.classList.remove("scrolled");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Tab click handling
    // tabs.forEach(function (tab) {
    //   tab.addEventListener('click', function () {
    //     tabs.forEach(function (t) { t.classList.remove('active'); });
    //     tab.classList.add('active');
    //   });
    // });
  })();

  